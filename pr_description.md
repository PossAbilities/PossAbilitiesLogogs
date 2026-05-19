🧪 Testing improvement for UserProvider

🎯 **What:** Added tests for `UserProvider` to cover missing authentication state scenarios.
📊 **Coverage:** Covered the simulated authentication flow including initial loading state, fully loaded state with properties (`user`, `isAdmin`), and the context usage error when used outside a `UserProvider`.
✨ **Result:** Improved test coverage significantly with asynchronous timer manipulation to verify `UserProvider` acts correctly under simulated network wait scenarios.
