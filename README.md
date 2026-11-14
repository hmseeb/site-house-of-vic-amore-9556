# House of Vic Amore — site-house-of-vic-amore-9556

Single-page marketing site for **House of Vic Amore**, a private, by-appointment
beauty and style studio at 1957 Lurting Ave, Apt QF, Bronx, NY 10461.

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The entire single-page site (semantic landmarks, JSON-LD, meta tags) |
| `styles.css` | Mobile-first design system: espresso ink, cream paper, single terracotta accent |
| `script.js` | Footer year, `_page` hidden field, inline validation, `fetch()` form submit with plain-POST fallback |
| `favicon.svg` | Favicon placeholder |
| `robots.txt`, `sitemap.xml` | Crawler basics |

## Primary action

One action is used site-wide: **Request an appointment** — in the header, hero,
after the services, in the studio card, in the closing band and in a mobile
sticky bar. It targets the appointment form in the contact section.

No business phone number was supplied, so no `tel:` link is published rather
than inventing one.

## Form

The single form posts to LeadrVision:

```
POST https://vision.leadrai.com/api/forms/17d92a8bbcef468e47c6a4e0875ffeb5
```

* Works without JavaScript (plain HTML POST, returns with `?submitted=1`).
* With JavaScript it posts the same fields as JSON to the same URL and shows the
  confirmation inline; any failure falls back to a normal browser POST.
* Hidden fields: `_form` (form name), `_page` (set to `window.location.href`),
  `_gotcha` (honeypot). No file uploads, no third-party form services.

## Review link

"Leave us a review" links to the relative path `/review` from both the footer and
the contact section. That route is provided by the platform and is deliberately
not implemented in this repo.

## Content policy

All copy describes the studio, its location and its services only. No reviews,
ratings, statistics, years in business, awards, licenses or guarantees are
claimed, because none were supplied.
