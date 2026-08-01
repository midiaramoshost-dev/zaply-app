export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_prompts: {
        Row: {
          company_id: string | null
          content: string
          created_at: string
          id: string
          is_default: boolean
          kind: string
          name: string
          updated_at: string
          user_id: string
          variables: Json
        }
        Insert: {
          company_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_default?: boolean
          kind?: string
          name: string
          updated_at?: string
          user_id: string
          variables?: Json
        }
        Update: {
          company_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_default?: boolean
          kind?: string
          name?: string
          updated_at?: string
          user_id?: string
          variables?: Json
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics: {
        Row: {
          channel: string | null
          clicks: number
          comments_count: number
          company_id: string | null
          created_at: string
          followers: number
          id: string
          impressions: number
          likes: number
          metric_date: string
          post_id: string | null
          reach: number
          shares: number
          user_id: string
        }
        Insert: {
          channel?: string | null
          clicks?: number
          comments_count?: number
          company_id?: string | null
          created_at?: string
          followers?: number
          id?: string
          impressions?: number
          likes?: number
          metric_date?: string
          post_id?: string | null
          reach?: number
          shares?: number
          user_id: string
        }
        Update: {
          channel?: string | null
          clicks?: number
          comments_count?: number
          company_id?: string | null
          created_at?: string
          followers?: number
          id?: string
          impressions?: number
          likes?: number
          metric_date?: string
          post_id?: string | null
          reach?: number
          shares?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          comment: string | null
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision: string
          id: string
          post_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision?: string
          id?: string
          post_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          answered: boolean
          author: string | null
          channel: string
          company_id: string | null
          created_at: string
          external_id: string | null
          id: string
          intent: string | null
          post_id: string | null
          reply: string | null
          sentiment: string
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answered?: boolean
          author?: string | null
          channel?: string
          company_id?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          intent?: string | null
          post_id?: string | null
          reply?: string | null
          sentiment?: string
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answered?: boolean
          author?: string | null
          channel?: string
          company_id?: string | null
          created_at?: string
          external_id?: string | null
          id?: string
          intent?: string | null
          post_id?: string | null
          reply?: string | null
          sentiment?: string
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          audience: string | null
          banned_words: string[]
          colors: string[]
          contact: string | null
          created_at: string
          fonts: string[]
          goals: string | null
          id: string
          logo_url: string | null
          name: string
          niche: string | null
          owner_id: string
          tone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          audience?: string | null
          banned_words?: string[]
          colors?: string[]
          contact?: string | null
          created_at?: string
          fonts?: string[]
          goals?: string | null
          id?: string
          logo_url?: string | null
          name: string
          niche?: string | null
          owner_id: string
          tone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          audience?: string | null
          banned_words?: string[]
          colors?: string[]
          contact?: string | null
          created_at?: string
          fonts?: string[]
          goals?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          niche?: string | null
          owner_id?: string
          tone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      images: {
        Row: {
          company_id: string | null
          created_at: string
          height: number | null
          id: string
          post_id: string | null
          prompt: string | null
          source: string
          style: string | null
          url: string
          user_id: string
          width: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          height?: number | null
          id?: string
          post_id?: string | null
          prompt?: string | null
          source?: string
          style?: string | null
          url: string
          user_id: string
          width?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          height?: number | null
          id?: string
          post_id?: string | null
          prompt?: string | null
          source?: string
          style?: string | null
          url?: string
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "images_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "images_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          kind: string
          link: string | null
          message: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          message?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          message?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          code: string
          created_at: string
          currency: string
          description: string | null
          features: Json
          id: string
          interval: string
          is_active: boolean
          is_featured: boolean
          max_clients: number | null
          max_posts: number | null
          name: string
          price_cents: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string
          description?: string | null
          features?: Json
          id?: string
          interval?: string
          is_active?: boolean
          is_featured?: boolean
          max_clients?: number | null
          max_posts?: number | null
          name: string
          price_cents?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string
          description?: string | null
          features?: Json
          id?: string
          interval?: string
          is_active?: boolean
          is_featured?: boolean
          max_clients?: number | null
          max_posts?: number | null
          name?: string
          price_cents?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      post_variants: {
        Row: {
          caption: string
          channel: string
          created_at: string
          cta: string | null
          emojis: string[]
          format: string | null
          hashtags: string[]
          id: string
          image_url: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          caption?: string
          channel: string
          created_at?: string
          cta?: string | null
          emojis?: string[]
          format?: string | null
          hashtags?: string[]
          id?: string
          image_url?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          caption?: string
          channel?: string
          created_at?: string
          cta?: string | null
          emojis?: string[]
          format?: string | null
          hashtags?: string[]
          id?: string
          image_url?: string | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_variants_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          approved: boolean
          body: string
          category: string
          channel: string
          company_id: string | null
          created_at: string
          hashtags: string[]
          id: string
          image_url: string | null
          published_at: string | null
          scheduled_at: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          body?: string
          category?: string
          channel?: string
          company_id?: string | null
          created_at?: string
          hashtags?: string[]
          id?: string
          image_url?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean
          body?: string
          category?: string
          channel?: string
          company_id?: string | null
          created_at?: string
          hashtags?: string[]
          id?: string
          image_url?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approved: boolean
          approved_at: string | null
          approved_by: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          requested_plan: string | null
          updated_at: string
        }
        Insert: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          requested_plan?: string | null
          updated_at?: string
        }
        Update: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          requested_plan?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          channel: string | null
          company_id: string | null
          created_at: string
          id: string
          is_active: boolean
          time_of_day: string
          updated_at: string
          user_id: string
          weekday: number
        }
        Insert: {
          channel?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          time_of_day: string
          updated_at?: string
          user_id: string
          weekday: number
        }
        Update: {
          channel?: string | null
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          time_of_day?: string
          updated_at?: string
          user_id?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      social_accounts: {
        Row: {
          account_name: string | null
          avatar_url: string | null
          company_id: string | null
          connected: boolean
          created_at: string
          external_id: string | null
          id: string
          metadata: Json
          provider: string
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name?: string | null
          avatar_url?: string | null
          company_id?: string | null
          connected?: boolean
          created_at?: string
          external_id?: string | null
          id?: string
          metadata?: Json
          provider: string
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string | null
          avatar_url?: string | null
          company_id?: string | null
          connected?: boolean
          created_at?: string
          external_id?: string | null
          id?: string
          metadata?: Json
          provider?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string
          external_id: string | null
          id: string
          plan_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          external_id?: string | null
          id?: string
          plan_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          external_id?: string | null
          id?: string
          plan_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          balance: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_platform_stats: {
        Args: never
        Returns: {
          published_posts: number
          scheduled_posts: number
          total_comments: number
          total_companies: number
          total_posts: number
          total_users: number
        }[]
      }
      grant_user_credits: {
        Args: { _amount: number; _reason?: string; _user_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      owns_company: { Args: { _company_id: string }; Returns: boolean }
      owns_post: { Args: { _post_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
