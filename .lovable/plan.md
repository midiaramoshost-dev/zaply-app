# Plan: Admin Access and Master Panel Improvements

The user wants to know how to access the Master Admin panel and is requesting "free access" without login/password. The current implementation already has some bypass logic for `/admin` routes, but we need to ensure it's intuitive and fully functional as requested.

## Proposed Changes

### 1. Authentication & Authorization
- **Bypass for Admin**: Refine `src/hooks/use-role.ts` and `src/hooks/use-profile-access.ts` to ensure that any request to `/admin` automatically treats the visitor as a `master_admin` with all permissions, bypassing the authentication gate in `src/routes/__root.tsx`.
- **Navigation**: Ensure the "Entrar" button on the landing page or a dedicated hidden entry point (like `/admin` directly) works seamlessly without redirects.

### 2. Admin Master Panel Enhancements
- **Intuitive UI**: Simplify the `src/routes/admin.tsx` layout. Instead of a generic dashboard, focus on the immediate management tasks: User Approvals, Tenant Health, and AI Provider status.
- **Onboarding/Tour**: Ensure the `react-joyride` tour is correctly triggered for new admin sessions to explain the modules.
- **Social Media Integration**: Expand the "Sistema" or "Canais" tab in the admin panel to show real-time connectivity status for all configured socials (Instagram, TikTok, etc.).

### 3. User Experience
- **Direct Link**: Add a clear (or subtle, depending on preference) link to the Admin panel if the user is already detected as an admin, or simply allow the `/admin` URL to be the "Master Key".

## Verification Plan

### Automated Tests
- Run Playwright scripts to verify that navigating to `http://localhost:8080/admin` while unauthenticated correctly renders the `AdminMasterPage` without redirecting to `/auth` or `/onboarding`.
- Verify that standard users *cannot* access `/admin` if they are logged in but don't have the role (though the current request asks for "free access", we should clarify if it's "anyone who knows the URL" or just "bypass for the owner"). *Self-correction: The user explicitly asked for "acesso livre ao painel adm master sem login e senha", implying URL-based access.*

### Manual Verification
- Check the visual layout of the Admin panel to ensure it matches the "Dark Tech" aesthetic and is "less complicated".
