# REAHUB design system

Source of truth for every UI change. Read before building.

## Brand & thesis
REAHUB is real estate compliance software for brokerages and agents.
Thesis: **Every closing file, cleared before the audit.**
Scene: a compliance manager at a desk, a closing file open, a survey flag on the one thing still missing.
Voice: plain, dry, specific. The product does the talking.

## Audience & the one job
Brokers, compliance managers and independent agents. One job: book a demo.

## Palette (OKLCH, named roles)
- bg: oklch(1 0 0) white, page background (client request)
- surface: oklch(1 0 0) white, panels and forms
- tint: oklch(0.93 0.025 247) quiet fills
- line: oklch(0.87 0.02 250) rules
- ink: oklch(0.24 0.05 258) text and dark sections
- ink-soft: oklch(0.44 0.035 256) secondary text
- accent: #5170ff brand blue (client-specified, matches the logo). The only saturated colour. Used for flags, the tape highlight and the closing band. Text on accent fills is white.
Never pure #000 or #fff. Neutrals are tinted toward blue.

## Type
- Display: Familjen Grotesk 600/700, tight tracking, sentence case.
- Body: Public Sans 400/500/600.
- Utility: IBM Plex Mono, small uppercase, eyebrows and data labels.
- Scale: clamp(2.6rem, 6.2vw, 5.6rem) hero, 2.25 to 3.5rem section, 1.125rem body.
- Do: short headlines, one accent word per headline. Don't: Inter, gradient text, centered paragraphs.

## Layout & spacing
Max width 72rem. Asymmetric splits, a product board that bleeds past the grid. Section rhythm 6 to 9rem. Alternate row direction. No identical card grids.

## Signature element
The tape: the key word of a headline sits on a blue "tape" strip, slightly rotated. Open items are marked by a tinted row.

## Motion
Structural: Lenis inertia scroll, GSAP reveals on scroll, hero board parallax, hero load-in, nav becomes a blurred bar after the hero.
Polish: film grain, magnetic primary button, small hover states on rows and links.
Restraint: no custom cursor. Everything off under prefers-reduced-motion and on touch where relevant.

## Components
Board mock (rows with status), license list, checklist, audit trail, plan card, numbered feature rows, tape word, flag eyebrow, magnetic button.

## Copy rules
Sentence case. No em dashes. No "luxury", "premium", "experience", "journey". Concrete, checkable claims. Buttons name the action.

## Assets plan
No stock photos. Product visuals are built as UI mockups in code using sample data, labelled as sample. Real screenshots replace them when the app exists.

## Conversion essentials
"Book a demo" in the nav, hero, every closing band and every plan.

## Anti-patterns
Gradient text, glassmorphism cards, big-number hero metric, identical card grids, emoji bullets, Inter body, cream + serif + terracotta, near-black + acid accent, hairline broadsheet layouts.

## References
Surveyor's flagging tape and stakes, closing folders, audit logs.
