# Dent house Dental Clinic — Midterm Project

**Course:** Introduction to Web Technologies  
**Group:** SE-2531  
**Students:** Saparkhan Shyngyskhan and Turarbek Nurakhmet

## 1. Project Overview

Dent house is a six-page dental clinic website continued from Assignment 1.

The website uses HTML5, CSS3 and Bootstrap 5.3.8. Bootstrap handles the main layout, responsive grid, spacing, navigation, typography, tables and form controls.

Custom CSS is kept as a correction layer for the website's colours, fonts, hero section, animations, doctor cards and small responsive adjustments.

No custom JavaScript or backend has been added for the booking process in this midterm version. The booking form is a front-end prototype and does not send a real appointment request.

## 2. Page List

| Page | Purpose |
|---|---|
| `index.html` | Clinic overview, highlights and gallery |
| `services.html` | Dental services and price tables |
| `orthodontics.html` | Orthodontics, 3D diagnostics and workflow |
| `team.html` | Doctors, experience and specialities |
| `contacts.html` | Address, opening hours, telephone and booking form |
| `colophon.html` | Technical documentation and team responsibilities |

## 3. Team Responsibilities

### Saparkhan Shyngyskhan

- Home page
- Services and Pricing page
- Colophon page
- `css/saparkhan.css`
- Shared design contributions

### Turarbek Nurakhmet

- Orthodontics page
- Medical Team page
- Contacts and Booking page
- `css/turarbek.css`
- Shared design contributions

## 4. CSS Architecture

### `css/base.css`

Contains shared colour variables, typography, header and navigation styles, table and form corrections, footer styles, responsive safety and prepared interface-state classes.

### `css/saparkhan.css`

Contains the announcement animation, home hero decoration, heading animation and gallery image styling.

### `css/turarbek.css`

Contains doctor-card and orthodontic workflow decoration.

Each HTML page loads Bootstrap first, then `css/base.css`, followed by the appropriate personal stylesheet.

## 5. Three User Journeys

### Journey 1 — Find the Clinic and Opening Hours

1. Start on `index.html`.
2. Select **Contacts & Booking** in the navigation.
3. Read the clinic address and opening hours.
4. Click **Call Clinic** on a compatible device.
5. End: the visitor has found the address, opening hours and telephone contact.

### Journey 2 — Compare Services and Contact the Clinic

1. Start on `index.html`.
2. Open **Services & Pricing**.
3. Compare the treatment and prosthetic service prices.
4. Open **Contacts & Booking**.
5. Review the booking form and select a service.
6. Use the telephone link to contact the clinic for a real appointment.
7. End: the visitor has compared services and has a working contact route.

Note: the booking form is a front-end prototype and does not send a real request.

### Journey 3 — Choose a Specialist

1. Start on `index.html`.
2. Open **Medical Team**.
3. Read the doctors' specialities, experience and focus areas.
4. Open **Contacts & Booking**.
5. Contact the clinic to discuss a suitable specialist.
6. End: the visitor can connect the doctor information with a direct contact action.

## 6. Preparing HTML for Future JavaScript

- Each page has a navbar toggler with a stable ID.
- The booking form uses `id="booking-form"`.
- Form controls use consistent IDs and labels.
- The submit and reset buttons have their own IDs.
- Confirmation and error message containers are prepared.
- CSS state classes are prepared: `.is-hidden`, `.is-active`,
  `.is-selected`, `.is-error` and `.is-success`.

These elements are prepared for later work. They do not mean that the booking form works or that an appointment is actually sent.

## 7. Technologies

- HTML5
- CSS3
- Bootstrap 5.3.8
- Bootstrap Grid and responsive breakpoints
- Bootstrap Navbar
- Bootstrap tables and form controls
- CSS animations and pseudo-elements

## 8. Local Setup

1. Keep all six HTML pages in the same project folder.
2. Keep all three stylesheets in the `css/` folder.
3. Add the team's own photographs to the `images/` folder.
4. Make sure the image filenames match the paths used in `index.html`.
5. Open `index.html` in a browser.

Bootstrap is loaded through a CDN, so an internet connection is needed for Bootstrap resources.

## 9. Responsive Testing

Check the website at these viewport widths:

- Mobile: 375 px
- Tablet: 768 px
- Desktop: approximately 1366 px

Also test the collapsed mobile navigation.

Save the four screenshots in the `evidence/` folder:

- `phone-375.png`
- `tablet-768.png`
- `desktop.png`
- `mobile-navbar-collapsed.png`

## 10. Quality Pass

Before submission:

1. Open every HTML page.
2. Click every navigation link and content link.
3. Test form validation.
4. Check the website at mobile, tablet and desktop sizes.
5. Check for horizontal overflow at 375 px.
6. Confirm that all local images load.
7. Check the browser console.
8. Run the W3C HTML validator on every HTML page.
9. Run the W3C CSS validator on every stylesheet.
10. Record actual findings in `quality-pass.md`.

The target is zero W3C validation errors.

## 11. Final Submission

The repository must contain the six HTML pages, all CSS files, README, AI log, removed-CSS notes, quality-pass record and the required screenshots.

Create the final Git commit and tag it `midterm`.

The commit history must be checked in the actual repository to confirm contributions from both students across at least four different days.

Manual tests, validation results, screenshots and Git requirements must not be marked complete until they have actually been verified.