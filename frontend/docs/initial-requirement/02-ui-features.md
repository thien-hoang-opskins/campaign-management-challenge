# UI features

## Campaign status badge (color-coded)

| Status | Color |
|--------|--------|
| `draft` | Grey |
| `scheduled` | Blue |
| `sent` | Green |

The Notion spec only defines colors for these three statuses. If the backend adds other statuses (for example `sending` in an alternate Part 1 variant), define an explicit mapping and badge copy so the UI stays consistent.

## Action buttons

Provide **Schedule**, **Send**, and **Delete** controls on the campaign detail experience (and list row actions if useful), **shown or hidden based on campaign status** and backend rules (for example: edit/delete only when `draft`).

## Stats display

Show **open rate** and **send rate** using a **progress bar** or a **simple chart**.

## Error handling

Surface **API errors in a meaningful way** (toast, inline alert, or dedicated error region—not silent failures).

## Loading states

While data is fetching, use **skeleton loaders** or **spinners** so the UI does not look broken during network latency.
