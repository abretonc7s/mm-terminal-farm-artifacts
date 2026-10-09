# Learnings

- Compare depth and display the maximum using the same whole-bps conversion as the submitted order. A 0.015% draft has a 0.01% effective cap.
- Regression fixtures must exercise both long and short estimates between the raw and floored caps. Three assertions fail before the fix; estimates below the effective cap remain allowed.
- Advanced-draft persistence currently excludes every advanced type. The reviewer allowed a test rename; the test now describes that behavior without suggesting a completeness check.
- The main merge includes fixes for both failing LimitPriceEditor CI tests. They pass under Node 22.
- Recipe ui.set_input checks exact readback, so it rejects intentional cap normalization. Configure 0.01%, add the fractional digit with ui.key_press, then assert the effective value. Terminal video is unsupported; the screenshot fallback passed.
- The lead explicitly owns GitHub replies. No comments or review-thread replies were posted.
