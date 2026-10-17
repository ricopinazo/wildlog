This is an app for tracking species spotted in the wild.

It needs to allow:

1. capture findings
2. Review previous findings

When logged in, the app has three pages:

- Log
- Journal
- Account

When not logged in, the app shows a Login page:

- Login

General app flow:

- While the app checks for a saved session, show a loading screen.
- If there’s no session, show Login.
- If there is a session, show the Log / Journal / Account tabs.
- If a session expires, return to Login. After signing in, open Log by default.
- Log, Journal, and Account require a session.
