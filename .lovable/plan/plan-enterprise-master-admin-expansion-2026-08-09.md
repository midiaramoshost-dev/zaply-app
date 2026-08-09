# Plan: Enterprise Master Admin Expansion

Expanding the Master Admin Control Center to include the full "Enterprise" suite as requested, focusing on Marketplace, Audit Logs, and granular permissions.

## Proposed Changes

### 1. Database & Infrastructure
- Create `audit_logs` table to track all admin actions.
- Create `prompt_marketplace` table for shared AI templates.
- Update `profiles` and `user_roles` to support more granular status (e.g., support_staff, billing_admin).

### 2. Services Expansion
- Update `src/modules/admin/services/admin.functions.ts` to include:
  - `getAuditLogs`: Fetch recent system actions.
  - `getMarketplaceItems`: Fetch prompt templates.
  - `createMarketplaceItem`: Allow admin to add new prompts to the library.
  - `deleteMarketplaceItem`: Remove prompts.

### 3. UI Modules Expansion
- Create `src/modules/admin/components/admin-marketplace.tsx`: A grid to manage prompt templates.
- Create `src/modules/admin/components/admin-audit-logs.tsx`: A detailed list of system changes.
- Update `src/routes/admin.tsx`:
  - Add new Tabs: "Marketplace" and "Suporte".
  - Integrate the new components.
  - Improve the "Sistema" tab with more granular toggles.

### 4. Support & CRM
- Add a "Suporte" tab in `src/routes/admin.tsx` showing users who requested contact (from the landing page/plans waiting list).

## Verification Plan
- Navigate to `/admin`.
- Verify new tabs appear: Marketplace, Auditoria, Suporte.
- Test adding a new prompt to the marketplace.
- Verify that toggling a system setting generates an entry in the Audit Log.
- Check if user status changes are correctly reflected in the Users & Credits list.
