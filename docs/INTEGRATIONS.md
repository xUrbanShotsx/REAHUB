# Connecting the services

REAHUB runs today as a self-contained demo: every agency record lives in the browser (`localStorage`, plus IndexedDB for proof files), sign in and sign up accept anything, and no email or payment leaves the app. This file says exactly where each service plugs in, in the order you plan to connect them.

Checked on 16 Nov 2026: types, lint, formatting and the production build pass; all 111 built pages and 97 internal links return 200; no console errors on any page; no sideways scroll at 375px on any page.

---

## 1. Supabase (accounts and data)

### Accounts

| Where | Today | Change to |
|---|---|---|
| `src/app/login/SignInForm.tsx`, `submit` | any email and password open `/dashboard` | `supabase.auth.signInWithPassword`, show its error on failure |
| `src/app/login/SignInForm.tsx`, `forgot` | shows a message only | `supabase.auth.resetPasswordForEmail` |
| `src/app/signup/SignUpForm.tsx`, `DetailsStep` | moves to the plan step | `supabase.auth.signUp` with name, agency and ABN as metadata |
| `src/components/app/AppShell.tsx`, Sign out link | goes to `/login` | `supabase.auth.signOut()` first |
| new `src/proxy.ts` | nothing guards `/dashboard` | redirect to `/login` without a session (Next 16 calls this file `proxy`, not `middleware`) |
| `src/lib/demo-data.ts`, `me` | the user is always "Dana Whitfield" | the signed-in member's profile |

### Data

All reads and writes already go through one place: the actions on `useStore()` in `src/components/app/DemoStore.tsx`. Swap the body of each action from the local `update(...)` to a Supabase call and the screens do not need to change.

Tables follow the `Saved` type in that file: properties, templates, register entries, accreditations, members, settings, tasks, events, meetings, diary, trust (ledgers and entries), KPIs, audit, documents.

Rules that matter for compliance:
- **Every table carries `agency_id`**, with row level security so a member only sees their own agency.
- **The audit log is append-only.** Allow insert, never update or delete, for every role. The app promises an audit log that cannot be edited, so the database has to enforce it.
- **Approved Vault documents are locked.** Store the signature, signer, date and SHA-256 fingerprint with the version, and block edits to an approved version (a new version is a new row).
- **Proof files** (`src/lib/proofs.ts`, IndexedDB today) move to Supabase Storage in a private bucket per agency.
- **Roles** come from `ACCESS_LEVELS` in `demo-data.ts`: Owner, Admin, Team Lead, Team Member, Auditor. Team Members do not see trust accounting; Auditors are read-only.

Remove the "You are viewing a demo workspace" bar and the Reset demo button in `AppShell.tsx` once real data is in.

---

## 2. Resend (email)

Nothing sends email yet. These are the places that need it:

| Email | Trigger | Where |
|---|---|---|
| **Demo request** | someone submits the Book a demo form | `src/app/demo/DemoForm.tsx` only shows "Thanks" today. **Requests are currently lost**, so this is the first one to wire up. |
| Password reset and email confirmation | Supabase auth | point Supabase's SMTP at Resend so these come from your domain |
| Welcome | sign up finishes | after `startTrial` |
| Trial ending | 2 days before `trialEnds` | scheduled job |
| Team invite | Invite in Settings > Team | `inviteMember` in `TeamSection.tsx` |
| Licence and CPD reminders | the same rules as the bell (`src/components/app/useReminders.ts`) | daily scheduled job |

Send from a server route only. Keep the Resend key server-side (no `NEXT_PUBLIC_` prefix).

---

## 3. Stripe (billing)

| Where | Today | Change to |
|---|---|---|
| `src/app/signup/SignUpForm.tsx`, `CardStep` | card number typed into our own fields, checked in the browser, only brand, last four and expiry kept | Stripe Elements (Payment Element) or Checkout. **Do not send raw card numbers to your server**; that brings the full card-security (PCI) burden. |
| `startTrial` in `DemoStore.tsx` | writes plan, card and trial end locally | server route creates the customer and a subscription with a 7-day trial; a webhook writes plan and status to Supabase |
| `src/app/dashboard/settings/BillingSection.tsx`, `choose` | switches plan locally | update the subscription, with proration |
| `INVOICES` in `BillingSection.tsx` | three fixed sample invoices | list the customer's Stripe invoices |
| card on file in Billing | from sign up | Stripe customer portal for changing the card |

Prices live in `PLANS` in `src/lib/demo-data.ts` (A$99, A$249, A$369 a month plus GST). Create matching Stripe prices in AUD with GST as tax. `planBlocker` in `src/lib/usage.ts` already stops a downgrade below the agency's head count; keep that check on the server too.

Add a Content-Security-Policy in `next.config.ts` at this point, allowing Stripe's and Supabase's domains. The other security headers are already sent.

---

## 4. Claude API (Assistance and Document Vault)

Already built. Add `ANTHROPIC_API_KEY` to the server environment and both features switch from demo mode to the real model. The model defaults to `claude-opus-5-5`; `ASSISTANT_MODEL` overrides it.

Before going live:
- **Require a signed-in session in `src/app/api/assistant/route.ts` and `src/app/api/vault/route.ts`.** Today they only check that the request came from the same site and apply a per-server-instance rate limit, which anyone with a script can get around. With a key connected, that is a cost risk.
- **Count queries per agency** in Supabase and enforce the plan's `queries` limit on the server. Settings > Usage shows the limit but nothing enforces it yet.
- The in-memory rate limit resets whenever the server restarts and is not shared between instances. Replace it with a per-agency counter in the database.

---

## Environment variables

| Name | Used by | Public? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | sitemap, canonical links, social images | yes |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser client | yes |
| `SUPABASE_SERVICE_ROLE_KEY` | server only, webhooks and jobs | **no** |
| `RESEND_API_KEY` | server only | **no** |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | server only | **no** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Elements | yes |
| `ANTHROPIC_API_KEY`, `ASSISTANT_MODEL` | server only | **no** |

Add each to `.env.example` (names only) as you connect it. `.env*` files other than the example are already ignored by git.
