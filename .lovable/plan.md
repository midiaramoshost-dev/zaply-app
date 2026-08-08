# Plan: Master Admin Access & UI Refinement

The platform is already configured for **free access** to the administrative area via `/admin`. I will refine the bypass logic and the UI to make it more intuitive and professional.

## Phase 1: Access Robustness
- **Hook Optimization**: Ensure `useRole` and `useProfileAccess` are bulletproof against any auth-related redirects when on `/admin`.
- **Root Protection**: Double-check `src/routes/__root.tsx` to ensure no "Loading..." or "Syncing..." screens block an unauthenticated admin user for more than a flash.

## Phase 2: UI/UX Simplification
- **Admin Dashboard**: Update `src/routes/admin.tsx` with a cleaner layout focusing on:
    - **Pending Approvals**: A more prominent view of users waiting for access.
    - **Infrastructure Health**: Real-time status of AI providers.
    - **Global Settings**: Easy access to n8n and API configurations.
- **Branding**: Ensure the "IA Zaply" branding is consistent throughout the admin experience.

## Phase 3: Discovery
- **Admin Link**: Add a subtle, hidden-in-plain-sight link to `/admin` in the footer for easier navigation without typing the URL every time.

## Verification
- **Playwright Test**: Run an automated script to verify `/admin` is accessible in a clean browser session (no cookies/localStorage).
