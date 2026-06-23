## Kohn Law Firm — Website Redesign Plan

A modern, fully responsive multi-page marketing site built on TanStack Start with the firm's brand colors, mega-menu navigation, and dedicated pages for every practice area.

### Brand & Design System

- **Colors** (tokens in `src/styles.css`):
  - Primary `#004AAD` (deep blue) — headers, CTAs, links
  - Accent `#9F2828` (crimson) — secondary CTA, emphasis
  - Highlight `#FDBA34` (gold) — underlines, badges, hover accents
  - Base white / off-white surfaces, deep slate text
- **Typography**: Serif display (Playfair Display) for headlines to match the legal/editorial logo treatment + Inter for body.
- **Logo**: use uploaded `Kohn-Law-Firm-Logo-White.webp` in the dark header/footer; a dark variant placeholder if needed.
- **Imagery**: generated photography of Colorado Springs skyline (hero), courthouse/legal interiors, attorney portraits (placeholders), and category-relevant photos per service page.
- **Motion**: subtle fade/slide-in on hero text, gold underline draw-in, and on-scroll reveals (Motion/Framer-Motion).

### Information Architecture

Top-level nav with mega menu:

```
Home | About | Criminal Defense ▾ | Family Law ▾ | Protection Orders ▾ | Team | Contact | [Schedule Consultation]
```

Mega menu groupings:
- **Criminal Defense**: Misdemeanor Crimes, Financial Crimes, Sexual Assault, Burglary, Domestic Violence, Felony Crimes, Theft, Sexual Offenses, Crimes Against a Person, Murder / Attempted Murder, Sexual Assault on a Child, Sexual Exploitation of a Child
- **Family Law**: Divorce & Separation, Adoption, Child Support, Allocation of Parental Responsibilities
- **Protection Orders**: Permanent Protection Order (PPO), Temporary Protection Order (TPO)

Persistent header shows phone `1-719-482-8092` and email `shimon@kohn.law`. Mobile nav collapses into a slide-out drawer with accordion submenus.

### Page Inventory

1. **Home** (`/`) — split hero (left: headline + subhead + Schedule Consultation CTA + phone, right: Colorado Springs cityscape image) with light entrance animation, Services overview grid (3 practice pillars), About snippet, Our Legal Team preview, FAQs accordion, Who We Are band, Testimonials carousel, contact CTA band.
2. **About** (`/about`) — firm story, values, credentials, photo.
3. **Team** (`/team`) — attorney cards (Shimon Kohn lead) with bio modal/page.
4. **Contact** (`/contact`) — phone, email, address, hours, contact form, embedded map.
5. **Consultation** (`/consultation`) — dedicated intake form (name, phone, email, case type, message) + reassurance copy. Form posts to a server function that stores submissions (Lovable Cloud, opt-in if user wants persistence) or, for now, emails via a placeholder handler — see Open Questions.
6. **Practice area landing pages**:
   - `/criminal-defense`, `/family-law`, `/protection-orders` — small hero + intro + child links.
7. **Service detail pages** (one per item listed above) — small hero banner (~40vh) with H1, subheader, and Schedule a Consultation button; followed by descriptive content, what-to-expect, penalties/process, related services, CTA band.

All routes use TanStack Start file-based routing (`src/routes/...tsx`), each with its own `head()` meta (title, description, og tags). No hash-anchor sections for primary nav.

### Components to Build

- `SiteHeader` (logo, desktop nav with mega menu, top utility bar with phone/email, mobile drawer)
- `MegaMenu` (multi-column dropdown, keyboard accessible)
- `SiteFooter` (nav, contact info, disclaimer, logo)
- `Hero` (variant: `home` split layout, `service` compact)
- `CTASection` (consultation band, reused)
- `ServiceCard`, `TeamCard`, `FAQAccordion`, `TestimonialCarousel`, `ContactForm`, `ConsultationForm`
- `ScheduleButton` (primary CTA shared everywhere)

### Content Source

Copy adapted from `https://new.shimonkohnlaw.com` for each page — rewritten in our own voice (no verbatim copying), preserving facts (services offered, locations, contact info).

### Responsive Behavior

- Mobile-first: stacked hero, hamburger drawer with accordion submenus, single-column service grids, tap-friendly CTAs, sticky bottom "Call Now" bar on mobile.
- Tablet: 2-column service grid, condensed nav.
- Desktop: split hero, mega menu, 3-col service grid.

### Technical Notes

- TanStack Start routes under `src/routes/`, flat dot-separated naming (e.g. `criminal-defense.theft.tsx`).
- Brand tokens defined as oklch in `src/styles.css` + semantic Tailwind utilities.
- Images generated via `imagegen` saved to `src/assets/`.
- Per-route `head()` meta with unique title/description/OG; leaf pages add og:image.
- `useNavigate`/`Link` from `@tanstack/react-router` only.

### Open Questions

1. **Consultation form submissions** — where should they go? Options: (a) enable Lovable Cloud to store submissions + email via Resend, (b) mailto fallback to `shimon@kohn.law`, (c) third-party form provider. Default if not specified: **(b) mailto** for now, swap to Cloud later.
2. **Real photos / headshots** — none provided; I'll use AI-generated placeholders (Colorado Springs cityscape for hero, generic professional portraits for team). Replace later with real assets.
3. **Testimonials** — use 3–4 representative placeholder quotes attributed generically ("Former Client, Colorado Springs") unless you provide real ones.
4. **Address** — not in the brief; I'll omit the street address and only show phone/email/Colorado Springs region until you share it.

I'll proceed with the defaults above unless you say otherwise.