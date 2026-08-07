import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid().nullable(),
  full_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
  email: z.string().email(),
  role: z.enum(['master_admin', 'org_admin', 'member', 'viewer']),
  is_active: z.boolean(),
  approved: z.boolean(),
  requested_plan: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  subdomain: z.string().nullable(),
  custom_domain: z.string().nullable(),
  is_white_label: z.boolean(),
  logo_url: z.string().nullable(),
  primary_color: z.string(),
  stripe_customer_id: z.string().nullable(),
  subscription_status: z.string(),
  plan_id: z.string().nullable(),
  settings: z.record(z.any()),
  created_at: z.string(),
});

export type Tenant = z.infer<typeof TenantSchema>;
