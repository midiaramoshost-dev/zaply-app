# Plan: API Key Management Interface for Master Admin

Implementing a comprehensive interface in the Master Admin panel to manage AI provider API keys, models, and global router configurations, fulfilling the "Central de IA" requirement.

## 1. Backend: API Management Server Functions
- Create `src/modules/ai-gateway/services/ai-management.functions.ts`:
  - `getAIProviders`: Fetches all providers and their models (system-wide and tenant-specific).
  - `updateAIProvider`: Creates or updates provider settings (name, type, priority, active status).
  - `saveAPIKey`: Securely handles API keys. Since direct secret management is abstracted, this will store a reference to the secret name in the `ai_providers` table.
  - `toggleAIModel`: Enables/disables specific models for a provider.
  - `updateRouterConfig`: Updates the default task-to-model mapping.

## 2. Frontend: Admin UI Enhancements
- Refactor the "IA Gateway" tab in `src/routes/admin.tsx`:
  - Replace the placeholder with a professional management dashboard.
  - **Provider List**: Cards showing active providers, their status, and priority.
  - **Configuration Modal**: A form to add/edit providers (Select type: OpenAI, Gemini, etc.), input API keys (masked), and set priority.
  - **Model Management**: Toggle switches for individual models (GPT-4o, Claude 3.5, etc.) within each provider.
  - **Global Routing Rules**: A section to define which model is the "Primary" for Text, Images, and Video.

## 3. Database & Security
- Ensure RLS policies in `ai_providers` and `ai_models` allow `master_admin` full access.
- Use `supabaseAdmin` for write operations to bypass RLS when necessary (Admin context).

## 4. Validation
- Verify that changes in the Admin panel correctly reflect in the `ai_providers` table.
- Test the fallback logic by disabling a high-priority provider and ensuring the `zaplyAIRouter` picks the next one.
