---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces using the IBM Carbon Red design system. Uses the Vision CMS v3 brand red (#ea2224), IBM Plex Sans typography, flat-square geometry (0px corners), and minimalist enterprise restraint blended with high-impact, professional layouts.
license: Complete terms in LICENSE.txt
---
# Frontend Design - IBM Carbon Red Design System
This skill enforces the strict, elegant, and highly structured IBM Carbon design language, customized with the Vision CMS v3 brand red, while demanding the visual distinction, premium motion, and layout mastery of professional frontend engineering.
This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.
---
## 1. Geometric & Visual Constraints
- **Flat-Square Geometry (0px Rule):** Every button, card, input, dropdown, banner, and panel must have `border-radius: 0px` (`rounded-none`). Rounded elements or pills are strictly forbidden.
- **Hairline Depth:** Replace drop-shadows with sharp 1px borders (`#e0e0e0` for subtle structures, `#161616` for focus/strong emphasis) and solid color contrasts.
- **Typography (IBM Plex Sans):** 
  - Headlines: `'IBM Plex Sans'`, weight `300` (Light) for premium, editorial gravitas.
  - Body: Weight `400` (Regular) with `0.16px` letter-spacing (`tracking-[0.16px]` or `tracking-wide`).
  - Actions/Labels: Weight `600` (Semibold) for ultimate legibility.
---
## 2. Color Tokens
- **Brand Accent:** `#ea2224` (Vision CMS Red) used sparingly for active states, focus lines, links, and major primary CTAs.
- **Brand Accent Hover:** `#c11b1d` (Deep crimson).
- **Canvas:** `#ffffff` (Pure White).
- **Surfaces:** `#f4f4f4` (Surface 1 / light gray) or `#e0e0e0` (Surface 2 / medium gray).
- **Inverted Canvas:** `#161616` (Charcoal) for bold, full-bleed header blocks or footers.
- **Typography Ink:** Charcoal `#161616` (Primary), `#525252` (Muted), and `#ffffff` on primary/charcoal backgrounds.
---
## 3. High-Quality Design Guidelines
- **Asymmetry & Scale:** Don't build generic template layouts. Create unforgettable layouts using dramatic scale changes (pairing massive light headers with high-density grid modules) and clever use of white space.
- **Micro-Interactions & Motion:** Use highly crisp, linear, or fast ease-out motion (`cubic-bezier(0.16, 1, 0.3, 1)`) for micro-interactions. Focus on subtle focus state animations, line drawing borders on page load, or swift slide-out panels.
- **Atmospheric Grid Lines:** Use actual architectural lines and grid borders to separate sections, creating the feel of a precision blueprint or technical blueprint board.
---
## 4. Forbidden Design Patterns
Strictly avoid:
- **glassmorphism**
- **neumorphism**
- **soft floating cards**
- **oversized border radii**
- **purple/blue AI gradients**
- **generic SaaS hero layouts**
- **excessive animation**
- **glowing shadows**
- **centered landing-page monotony**
- **random color palettes**
- **inconsistent spacing systems**
- **decorative motion without purpose**
Every visual element must feel:
- **intentional**
- **architectural**
- **technical**
- **production-grade** now all good man right 