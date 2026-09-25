# Assignment 2 — CSS Feature & Tag Checklist

**Group:** SE-2531  
**Project:** Dent house Dental Clinic Website  
**Students:** Saparkhan Shyngyskhan & Turarbek Nurakhmet

---

## 1. Shared stylesheet architecture

| Requirement | Location | Owner |
|---|---|---|
| Shared `base.css` | `css/base.css` | Both |
| Saparkhan personal CSS | `css/saparkhan.css` | Saparkhan |
| Turarbek personal CSS | `css/turarbek.css` | Turarbek |
| Base loaded first | every HTML file | Both |
| Personal stylesheet loaded second | every HTML file | Both |

---

## 2. Required selectors

| Selector | Location |
|---|---|
| Universal `*` | `base.css` |
| Type selector | `body`, `p`, `h1`, `h2` |
| Class selector | multiple selectors |
| ID selector | `#home-title` and other page IDs |
| Descendant selector | `.doctor-card p` |
| Child selector `>` | `.nav-list > li`, `.form-field > span` |
| Adjacent sibling `+` | `.page-intro h2 + p` |
| Grouping selector | `h1, h2, h3` |
| Attribute selector | `a[href^="tel:"]`, `input[type="tel"]` |
| `:hover` | `.nav-link:hover` |
| `:focus` | `.nav-link:focus` |
| `:first-child` | `.nav-list > li:first-child` |
| `:nth-child()` | table rows and form field |
| `::before` | hero/footer |
| `::after` | section labels/workflow decoration |

---

## 3. IDs

Meaningful IDs are used for unique page headings.

- `#home-title`
- `#services-title`
- `#orthodontics-title`
- `#team-title`
- `#contacts-title`
- `#colophon-title`

Each page uses its heading ID only once.

---

## 4. Colours

Five main palette colours:

- `#005F73`
- `#0A9396`
- `#EE9B00`
- `#1D2D44`
- `#F8F9FA`

Named colour:

- `white`

RGBA is also used for transparency.

---

## 5. Fonts

Heading font:

```css
"Segoe UI", Tahoma, Geneva, Verdana, sans-serif