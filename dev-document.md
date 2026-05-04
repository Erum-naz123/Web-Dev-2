# BigPlanetarium — Development Document

## Project Overview

BigPlanetarium is a three-page educational website about the Milky Way galaxy and our Solar System, built for a Bristol-based planetarium. The site aims to make space science engaging and accessible to the widest possible audience — from school children to adults — regardless of their technological abilities or disabilities.

---

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Milky Way overview, interactive quiz, planet previews |
| Planets | `planets.html` | All eight planets with images and key facts |
| Mars | `mars.html` | Deep dive into Mars: tabs, gallery, lightbox, video |

---

## Technical Implementation

### HTML — Semantic Elements

All three pages use HTML5 semantic elements rather than generic `<div>` containers. This benefits both search engine optimisation and assistive technologies.

- `<header role="banner">` and `<footer role="contentinfo">` mark page-level landmarks
- `<nav role="navigation" aria-label="...">` is used separately for the main navigation and the footer navigation, each with a distinct `aria-label` so screen readers can distinguish them
- `<main id="main-content" role="main">` wraps the primary page content
- `<section aria-labelledby="...">` groups thematically related content with a heading reference
- `<article>` is used for each planet card on `planets.html`, as each one is an independent, self-contained item
- `<figure>` and `<figcaption>` wrap all images to provide visible captions
- `<dl>`, `<dt>`, and `<dd>` are used for key–value fact pairs (planet stats, Mars quick facts) — semantically the most appropriate element for this type of data

### CSS — Styling & Layout

- **CSS Custom Properties** (variables) defined in `:root` ensure a consistent design language across all pages. Changing the accent colour in one place updates the entire site.
- **CSS Grid** and **Flexbox** handle responsive layouts without a framework. The `planets-grid` uses `auto-fill` and `minmax` to automatically adjust columns based on viewport width.
- **`clamp()`** is used for fluid typography so headings scale smoothly between mobile and desktop without media query breakpoints for font sizes.
- **Media queries** at 900 px and 600 px breakpoints reorganise the layout for tablet and mobile respectively.
- **`@media (prefers-reduced-motion: reduce)`** disables all animations and transitions for users who have enabled this operating-system setting, addressing WCAG 2.1 Success Criterion 2.3.3.
- **`@media (forced-colors: active)`** provides a fallback for Windows High Contrast mode.

### JavaScript — Interactions

All JavaScript is in `js/main.js`. Six distinct interaction modules are implemented:

1. **Starfield Canvas** — An animated HTML5 `<canvas>` element draws 250 twinkling stars behind the homepage hero. The animation loop uses `requestAnimationFrame` for performance. If the user has `prefers-reduced-motion: reduce` set, a static star field is rendered instead.

2. **Mobile Navigation Toggle** — The hamburger button updates its `aria-expanded` attribute when opened/closed, allowing screen readers to correctly announce the menu state. The menu closes when a link is clicked or when the user clicks outside it.

3. **Scroll Reveal** — An `IntersectionObserver` watches `.reveal` elements and adds a `.visible` class when they enter the viewport, triggering a CSS fade-up transition. This is skipped if the user prefers reduced motion.

4. **Space Quiz** — A five-question multiple-choice quiz is rendered dynamically. It uses an `aria-live="polite"` region to announce feedback to screen readers without interrupting the user. All buttons are keyboard accessible, and correct/incorrect answers are indicated both by colour and by a text symbol (✓ / ✗) to avoid relying on colour alone.

5. **Accessible Tab Interface** — The Mars page uses the WAI-ARIA tab pattern with `role="tablist"`, `role="tab"`, and `role="tabpanel"`. Arrow key navigation (left, right, Home, End) is implemented in JavaScript as specified by the ARIA Authoring Practices Guide.

6. **Image Lightbox** — Clicking a gallery image opens a full-size overlay (`role="dialog"`, `aria-modal="true"`). Focus is moved to the close button when the dialog opens, and returned to the triggering element when it closes. The Escape key also closes it. Gallery items have `tabindex="0"` and `role="button"` so they are reachable and activatable by keyboard users.

---

## Additional Requirement: Accessibility

Accessibility was treated as a first-class concern throughout the project, not an afterthought. The following techniques were applied:

### Perceivable

- **Alt text**: Every `<img>` element has a descriptive `alt` attribute that conveys the meaning and context of the image to screen reader users. Decorative elements (the starfield `<canvas>`, emoji icons) have `aria-hidden="true"`.
- **Captions**: Visible `<figcaption>` elements accompany all photographs, crediting the source.
- **Colour contrast**: All text meets WCAG AA minimum contrast ratios — body text on the dark background achieves approximately 14:1. The gold accent (#f0c848 on #08090f) achieves approximately 10:1.
- **No colour alone**: The quiz uses both colour (green/red) and a text symbol (✓/✗) to communicate correct and incorrect answers.
- **Video**: YouTube embeds include a descriptive `title` attribute. YouTube's built-in player provides captions for all NASA videos used.

### Operable

- **Skip link**: A visually hidden "Skip to main content" link appears at the top of every page. It becomes visible on focus, allowing keyboard users to bypass the navigation.
- **Keyboard navigation**: All interactive elements (buttons, links, quiz options, tabs, gallery items, lightbox) are reachable and operable by keyboard. The tab order follows a logical reading sequence.
- **Visible focus indicators**: `:focus-visible` provides a 3 px gold outline on all interactive elements, clearly showing keyboard focus position.
- **ARIA states**: The nav toggle uses `aria-expanded`, tabs use `aria-selected`, the lightbox uses `aria-modal="true"`. These communicate widget state to assistive technologies.
- **Touch targets**: All interactive elements have a minimum clickable area of 44 × 44 px, meeting WCAG 2.5.5 (Target Size).
- **Reduced motion**: Animations are disabled via `prefers-reduced-motion: reduce`.

### Understandable

- **Language**: `lang="en"` is set on every `<html>` element so screen readers use the correct voice/pronunciation.
- **Descriptive page titles**: Each page has a unique, descriptive `<title>` (e.g., "Mars | BigPlanetarium") so users navigating by browser tab or screen reader can identify the page.
- **Heading hierarchy**: Each page uses a single `<h1>`, followed by logically nested `<h2>`, `<h3>` headings. No heading levels are skipped.
- **Descriptive link text**: Links describe their destination (e.g., "Explore Mars in detail →" rather than "Click here").
- **Plain language**: Content is written to be readable and jargon-free wherever possible, supporting the client's goal of making science accessible to everyone.

### Robust

- **Semantic HTML**: Using correct semantic elements ensures the site works well with both current and future assistive technologies.
- **`<noscript>` fallback**: The quiz section includes a `<noscript>` notice for users with JavaScript disabled.
- **Valid HTML**: All pages aim to produce valid, well-formed HTML5.

---

## Critical Reflection

### What Went Well

The accessible tab interface on the Mars page worked particularly effectively — the full ARIA pattern with keyboard arrow-key support is something rarely implemented correctly, and getting it working well was satisfying. The colour scheme also maintained strong contrast throughout while still feeling visually engaging.

### What Could Be Improved

- **Real captions**: The YouTube videos used rely on auto-generated captions. Manually reviewed, human-edited captions would be more accurate and better serve D/deaf users.
- **Dark mode / light mode toggle**: While the site uses a dark theme, a user-controlled light mode toggle would improve flexibility for users with photosensitivity or visual impairments who prefer light backgrounds.
- **More planet pages**: The brief asked for "at least one" dedicated planet page; with more time, individual pages for each planet would provide a richer experience.
- **Screen reader testing**: Ideally, the site would be tested with real assistive technologies (NVDA, VoiceOver) rather than relying solely on code review and automated tools like Lighthouse.
- **Automated accessibility audit**: Running an axe-core or Lighthouse scan could surface any remaining contrast or labelling issues.

---

## Image & Video Credits

All images are sourced from NASA, ESA, or Wikimedia Commons and are in the public domain or freely licensed.

All videos are official NASA content hosted on YouTube.

---

*© 2024 BigPlanetarium — Built for educational purposes.*
