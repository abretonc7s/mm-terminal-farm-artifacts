import { appendFileSync, writeFileSync, existsSync } from 'node:fs';
const root = 'temp/tasks/fix/180-1009-183037/artifacts/twap-diagnosis';
const log = (event) => appendFileSync(`${root}/provider-network.jsonl`, JSON.stringify({time:new Date().toISOString(),...event})+'\n');
let done = false;
const sockets = new Set();
const targets = new Set();
const infoRequests = new Map();
const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));
const enableExpression = `(() => {if(location.origin !== 'http://localhost:9343')return false;localStorage.setItem('perps.debug','1');console.info('[TWAP diagnostic] existing perps debug logger enabled');return true;})()`;
let oldTargets = [];
try {oldTargets=await (await fetch('http://127.0.0.1:9543/json/list')).json();}catch{}
for(const target of oldTargets) targets.add(target.id);
writeFileSync(`${root}/observer-ready.json`,JSON.stringify({ready:true,oldTargetCount:targets.size,port:9543}));
async function attach(target){
 const ws=new WebSocket(target.webSocketDebuggerUrl);sockets.add(ws);
 let id=1;const pending=new Map();
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=id++;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
 ws.addEventListener('message',event=>{const msg=JSON.parse(String(event.data));if(msg.id){const p=pending.get(msg.id);pending.delete(msg.id);if(p){msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg.result);}return;}
 if(msg.method==='Network.requestWillBeSent' && msg.params.request.url.startsWith('https://api.hyperliquid-testnet.xyz/info')){
 let type;try{type=JSON.parse(msg.params.request.postData??'{}').type;}catch{}infoRequests.set(msg.params.requestId,type??'unknown');
 }
 if(msg.method==='Network.responseReceived' && msg.params.response.url.startsWith('https://api.hyperliquid-testnet.xyz/info'))log({kind:'info-response',status:msg.params.response.status,type:infoRequests.get(msg.params.requestId)??'unknown'});
 if(msg.method==='Runtime.consoleAPICalled'){
 const args=msg.params.args;const strings=args.filter(a=>a.type==='string').map(a=>a.value).join(' ');
 if(/perps-controller/.test(strings)&&/initializ|Placing order|Validating order|Target DEX position|Submitting TWAP|query answered|query failed|PROVIDER_NOT_AVAILABLE|asset mapping|client.*ready/i.test(strings)){
 const details=args.filter(a=>a.type==='object').map(a=>Object.fromEntries((a.preview?.properties??[]).filter(p=>['orderType','symbol','dex','count','error','hip3Enabled','isBuy','marginMode','leverage','durationMinutes','size','assetId','message'].includes(p.name)).map(p=>[p.name,p.value])));
 log({kind:'provider-console',message:strings,details});
 }
 }
 });
 await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
 await send('Runtime.enable');await send('Network.enable');
 const added=await send('Page.addScriptToEvaluateOnNewDocument',{source:enableExpression});
 log({kind:'attached',targetId:target.id});
 const interval=setInterval(async()=>{if(done||ws.readyState!==WebSocket.OPEN)return;try{const result=await send('Runtime.evaluate',{expression:enableExpression,returnByValue:true});if(result.result?.value===true){clearInterval(interval);log({kind:'debug-enabled',targetId:target.id});}}catch{}},300);
 ws.addEventListener('close',()=>{clearInterval(interval);sockets.delete(ws);});
 while(!done&&ws.readyState===WebSocket.OPEN)await sleep(1000);
 clearInterval(interval);
 if(ws.readyState===WebSocket.OPEN){await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:added.identifier}).catch(()=>{});await send('Runtime.evaluate',{expression:`if(location.origin==='http://localhost:9343')localStorage.removeItem('perps.debug')`}).catch(()=>{});ws.close();}
}
while(!existsSync(`${root}/observer-stop`)){
 try{const pages=await (await fetch('http://127.0.0.1:9543/json/list')).json();for(const t of pages){if(t.type==='page'&&!targets.has(t.id)){targets.add(t.id);attach(t).catch(e=>log({kind:'attach-error',message:String(e)}));}}}catch{}
 await sleep(250);
}
done=true;await sleep(1800);for(const ws of sockets)ws.close();log({kind:'stopped'});
