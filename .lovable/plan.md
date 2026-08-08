# Plan: Enterprise Admin Master & Site Management

Implementing a full-featured admin panel and site management (CMS) system to solve the "not functional" and "missing menus" issues.

## 1. Database & Infrastructure
- [ ] Create `platform_settings` table to store landing page content, brand colors, and global platform toggles.
- [ ] Seed default values for Zaply brand and landing page sections.
- [ ] Ensure RLS and proper GRANTS for `service_role` and `authenticated` (master admins).

## 2. Server-side Logic (Modules)
- [ ] Implement `platform-management.functions.ts` for CMS operations.
- [ ] Implement `finance.functions.ts` for global revenue and subscription monitoring.
- [ ] Implement `system.functions.ts` for platform controls (maintenance, credits).

## 3. Administrative Interface
- [ ] **Gestão do Site (CMS)**: Create a real editor for the landing page (Headline, Hero, Features, Testimonials).
- [ ] **Financeiro**: Create a dashboard for revenue, MRR, and tenant subscription tiers.
- [ ] **Sistema**: Create a control center for global platform settings.
- [ ] **Tenants & IA**: Refine existing components for better reliability.

## 4. White-Label Delivery
- [ ] Update Landing Page to use dynamic data from `platform_settings` instead of hardcoded strings.
- [ ] Inject brand colors (OKLCH tokens) dynamically if possible or via CSS variables.

## 5. Validation
- [ ] Verify that saving settings reflects immediately on the landing page.
- [ ] Verify that master admin can manage all aspects without restrictions.
