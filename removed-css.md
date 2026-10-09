# CSS Migration Notes — Dent house Midterm Project

Bootstrap handles most of the website layout and common UI components. The custom CSS files remain as a correction layer.

| Layout Purpose | Bootstrap Replacement | Custom CSS Retained For |
|---|---|---|
| Main page width and padding | `.container`, `.container-fluid`, `py-*`, `px-*` | Small viewport corrections |
| Responsive columns | `.row`, `.col-12`, `.col-md-*`, `.col-lg-*` | No primary grid replacement |
| Flex layouts and spacing | `.d-flex`, `.flex-wrap`, `.gap-*`, alignment utilities | No primary flex replacement |
| Navigation | `.navbar`, `.navbar-expand-lg`, `.navbar-toggler`, `.collapse` | Header gradient and navigation colours |
| Tables | `.table`, `.table-striped`, `.table-hover`, `.table-responsive` | Minimum table width and caption styling |
| Form controls | `.form-control`, `.form-select`, `.form-label` | Focus styling and textarea resizing |
| Cards | `.bg-white`, `.border`, `.rounded-4`, `.shadow-sm` | Doctor-card and workflow decoration |
| Buttons | `.btn-*` | No general button recreation |
| Status labels | `.badge`, `.alert` | No general badge recreation |
| Colours and typography | Bootstrap utilities and type scale | Project palette and font variables |
| Hero section | Bootstrap spacing utilities | Gradient and decorative circle |
| Announcement strip | Bootstrap Flexbox utilities | Scrolling animation |

This document describes the current layout responsibilities. To produce an exact line-by-line deletion history, compare these files with the original Assignment 2 stylesheets.