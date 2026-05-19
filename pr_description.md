🧪 Add tests for BirthdayBanner

🎯 **What:** Added comprehensive unit tests for the `BirthdayBanner` component to ensure it properly handles user state and renders correctly based on the current date and stored preferences.
📊 **Coverage:** Covered scenarios:
- Does not render when user data is missing.
- Does not render when it is not the user's birthday.
- Renders the banner with the correct user's name when it is their birthday.
- Successfully dismisses the banner and saves the dismissal state to `localStorage`.
- Prevents rendering if the banner was already dismissed today.
✨ **Result:** Improved test coverage for `BirthdayBanner`, ensuring regressions can be caught automatically when making future changes.
