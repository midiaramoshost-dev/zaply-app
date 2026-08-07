// Zaply Enterprise Types - Reconstructed for Scalability

export type UserRole = 'master_admin' | 'org_admin' | 'member' | 'viewer';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  custom_domain?: string;
  is_white_label: boolean;
  logo_url?: string;
  primary_color: string;
  stripe_customer_id?: string;
  subscription_status: string;
  plan_id?: string;
  settings: Record<string, any>;
  created_at: string;
}

export interface Organization {
  id: string;
  tenant_id: string;
  name: string;
  settings: Record<string, any>;
  created_at: string;
}

export interface Profile {
  id: string;
  tenant_id?: string;
  full_name?: string;
  avatar_url?: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  approved: boolean;
  requested_plan?: string;
  created_at: string;
}

// AI Gateway
export interface AIProvider {
  id: string;
  tenant_id?: string;
  name: string;
  provider_type: string;
  is_active: boolean;
  priority: number;
}

export interface AIModel {
  id: string;
  provider_id: string;
  model_name: string;
  task_type: 'text' | 'image' | 'video';
  is_active: boolean;
  config: Record<string, any>;
}

export interface AIPrompt {
  id: string;
  tenant_id?: string;
  organization_id?: string;
  title: string;
  description?: string;
  content: string;
  variables: string[];
  category?: string;
  is_public: boolean;
}

export interface AIAgent {
  id: string;
  tenant_id: string;
  organization_id?: string;
  name: string;
  description?: string;
  avatar_url?: string;
  system_prompt: string;
  config: Record<string, any>;
  tools: string[];
  is_active: boolean;
}

// CRM
export interface Client {
  id: string;
  tenant_id: string;
  name: string;
  email?: string;
  company_name?: string;
  status: string;
  created_at: string;
}

export interface Lead {
  id: string;
  tenant_id: string;
  full_name: string;
  email: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
  ai_score: number;
  created_at: string;
}

// Marketing
export interface Campaign {
  id: string;
  tenant_id: string;
  name: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  budget?: number;
  start_date?: string;
  end_date?: string;
}

// Social
export interface SocialAccount {
  id: string;
  tenant_id: string;
  platform: 'instagram' | 'linkedin' | 'facebook' | 'x' | 'tiktok' | 'youtube';
  account_name: string;
  account_id: string;
  created_at: string;
}

export interface SocialPost {
  id: string;
  tenant_id: string;
  content?: string;
  media_urls: string[];
  platform: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_at?: string;
  published_at?: string;
}
