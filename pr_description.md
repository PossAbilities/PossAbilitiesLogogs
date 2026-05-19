🧪 [Testing Improvement] Add Error Handling Tests for AdminNewsPage

🎯 **What:** The untested error handling code block in `AdminNewsPage.handleSubmit` where a fallback mechanism triggers if the Supabase request fails.

📊 **Coverage:**
* Added a test case confirming successful behavior: The `mockUpsert` operates flawlessly and signals success correctly.
* Added a test case to cover the untested code block: Simulated a `supabase.from('news').upsert()` error, asserting `console.error` logs the error, a `window.alert` informs the user of the fallback, and the local `setNews` is properly called.

✨ **Result:** Enhanced test coverage for the error-handling fallback logic within the Admin News Page, ensuring any refactoring does not break the optimistic/fallback update mechanism.
