# Wedding Checklist + Budget Planner

Month-wise wedding checklist, rupee budget tracker and guest list with RSVP.

**Live app:** https://akash991833.github.io/wedding-checklist-budget-app/

Free, no sign-up, no ads. Works in the browser, offline after the first visit, and can be installed on your phone (Chrome menu > Add to Home screen / Install app). Everything is saved on your device only.

## Features

- Countdown to the wedding date
- 35 ready tasks in 5 stages (6+ months before to wedding day); add, tick, filter and delete your own
- Budget tracker in Indian rupee format: total budget, per-category plan, expenses, paid / pending, over-budget warnings
- Guest list with family size, groom/bride side and RSVP status, headcount totals
- Export Expenses, Guests and Checklist as CSV (opens in Excel / Google Sheets)
- JSON backup and restore, print view
- Dark and light mode, works offline, installable on phone

## How to use

1. Home tab: enter names, date and total budget.
2. Checklist tab: tick tasks as you complete them.
3. Budget tab: set a plan per category, then add every expense and mark it paid when settled.
4. Guests tab: add families and update RSVP as replies come.
5. Backup tab: export CSV or JSON.

## Screenshots

<img src="screenshots/0-home.png" width="240" alt="0-home">
<img src="screenshots/1-checklist.png" width="240" alt="1-checklist">
<img src="screenshots/2-budget.png" width="240" alt="2-budget">
<img src="screenshots/3-guests.png" width="240" alt="3-guests">
<img src="screenshots/5-light.png" width="240" alt="5-light">

![desktop](screenshots/4-desktop.png)

## Good to know (limits)

- Data is stored only in your browser. Take a backup before changing phone or clearing browser data.
- Export is CSV (not .xlsx); Excel opens it directly.
- Checklist tasks are a general Indian-wedding guide; adjust for your family traditions.

## Run it yourself

No build step. Clone the repo and open `index.html`, or serve the folder with any static server:

```bash
git clone https://github.com/AKASH991833/wedding-checklist-budget-app.git
cd wedding-checklist-budget-app
python3 -m http.server 8080
```

Plain HTML, CSS and JavaScript. No tracking, no external requests (fonts, scripts and data are all local).

## Privacy

No account, no server, no analytics. Data stays in your browser's local storage. Clearing browser data deletes it, so use the Backup option if it matters.

## License

MIT
