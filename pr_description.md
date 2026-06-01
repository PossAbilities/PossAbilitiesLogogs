🧪 [testing improvement] Add missing test file for Footer component

🎯 **What:** The `Footer` component was missing a test file, leaving a testing gap for this functional UI element.

📊 **Coverage:** A new test file `src/components/Footer.test.tsx` has been added. The following scenarios are now tested:
- Correct rendering of the footer navigation area.
- Correct rendering of the copyright text featuring the dynamically updated current year.
- Presence and correctness of all three required navigation links and their `href` attributes (Whistleblowing, Compliments & Complaints, Terms of Use).

✨ **Result:** Test coverage for the application has been improved, and changes or refactors to the Footer component will now be safely caught by the unit tests.
