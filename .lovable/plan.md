# Plan - Remove "Meu Painel" Menu

The user requested to remove the "Meu Painel" menu item. This item appears in the sidebar and is associated with the `/conta` route.

## Proposed Changes

### Components
#### [src/components/app-sidebar.tsx]
- Remove the "Meu painel" item from the `groups` array (under the "Conta" label).

### Routes
#### [src/routes/conta.tsx]
- Review if this route should be kept or if it's redundant now that the link is removed. Given the name "Meu painel" linked to `/conta`, it seems to be the profile/account settings page. I will keep the route but remove the entry point from the sidebar as requested.

## Validation Plan
1. Check the sidebar in the preview to ensure "Meu painel" is no longer visible.
2. Verify that other items in the "Conta" group (Clientes, Planos) are still present.
