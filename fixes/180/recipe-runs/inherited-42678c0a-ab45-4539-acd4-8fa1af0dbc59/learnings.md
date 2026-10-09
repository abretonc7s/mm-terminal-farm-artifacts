# Learnings

- Default-book precision comes from the requested subscription. Sparse price gaps cannot reliably identify its aggregation.
- Book asks are sorted for display. Execution estimates must walk a copied list from best price outward.
- Initial controls and status must use SSR-safe inputs. Persisted drafts cannot choose first-render layout.
- Margin intent belongs on new entries. A global isolated-only guard can break existing cancel-and-replace or reverse flows.
- Freeze source before live proof. Terminal rejects provenance drift even when every recipe node passes; native TWAP needs time to finish before cleanup.
