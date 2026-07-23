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
      automation_runs: {
        Row: {
          created_at: string
          duration_seconds: number | null
          error_message: string | null
          id: string
          post_id: string | null
          status: Database["public"]["Enums"]["automation_run_status"]
          topic_id: string | null
          topic_title: string | null
          trigger_type: Database["public"]["Enums"]["automation_trigger_type"]
          word_count: number | null
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          post_id?: string | null
          status: Database["public"]["Enums"]["automation_run_status"]
          topic_id?: string | null
          topic_title?: string | null
          trigger_type?: Database["public"]["Enums"]["automation_trigger_type"]
          word_count?: number | null
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          post_id?: string | null
          status?: Database["public"]["Enums"]["automation_run_status"]
          topic_id?: string | null
          topic_title?: string | null
          trigger_type?: Database["public"]["Enums"]["automation_trigger_type"]
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_runs_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_runs_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      global_schema: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_postal_code: string | null
          address_region: string | null
          address_street: string | null
          business_name: string
          business_type: string
          created_at: string
          email: string | null
          hours: Json
          id: string
          logo_url: string | null
          organization_description: string | null
          phone: string | null
          practice_areas: string[]
          service_area: string[]
          social_links: Json
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_region?: string | null
          address_street?: string | null
          business_name?: string
          business_type?: string
          created_at?: string
          email?: string | null
          hours?: Json
          id?: string
          logo_url?: string | null
          organization_description?: string | null
          phone?: string | null
          practice_areas?: string[]
          service_area?: string[]
          social_links?: Json
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_region?: string | null
          address_street?: string | null
          business_name?: string
          business_type?: string
          created_at?: string
          email?: string | null
          hours?: Json
          id?: string
          logo_url?: string | null
          organization_description?: string | null
          phone?: string | null
          practice_areas?: string[]
          service_area?: string[]
          social_links?: Json
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          best_time_to_reach: string | null
          case_type: string | null
          created_at: string
          email: string
          email_sent: boolean
          id: string
          message: string | null
          name: string
          phone: string | null
          source: string
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          best_time_to_reach?: string | null
          case_type?: string | null
          created_at?: string
          email: string
          email_sent?: boolean
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          best_time_to_reach?: string | null
          case_type?: string | null
          created_at?: string
          email?: string
          email_sent?: boolean
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          source?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          body: string
          canonical_url: string | null
          category_id: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          featured_image_url: string | null
          focus_keyword: string | null
          id: string
          meta_description: string | null
          og_image_url: string | null
          published_at: string | null
          read_time_minutes: number
          scheduled_at: string | null
          schema_generated: boolean
          schema_jsonld: Json | null
          seo_score: number
          seo_tags: string[]
          seo_title: string | null
          slug: string
          source: Database["public"]["Enums"]["post_source"]
          status: Database["public"]["Enums"]["post_status"]
          tags: string[]
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          body?: string
          canonical_url?: string | null
          category_id?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image_url?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          og_image_url?: string | null
          published_at?: string | null
          read_time_minutes?: number
          scheduled_at?: string | null
          schema_generated?: boolean
          schema_jsonld?: Json | null
          seo_score?: number
          seo_tags?: string[]
          seo_title?: string | null
          slug: string
          source?: Database["public"]["Enums"]["post_source"]
          status?: Database["public"]["Enums"]["post_status"]
          tags?: string[]
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          body?: string
          canonical_url?: string | null
          category_id?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image_url?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          og_image_url?: string | null
          published_at?: string | null
          read_time_minutes?: number
          scheduled_at?: string | null
          schema_generated?: boolean
          schema_jsonld?: Json | null
          seo_score?: number
          seo_tags?: string[]
          seo_title?: string | null
          slug?: string
          source?: Database["public"]["Enums"]["post_source"]
          status?: Database["public"]["Enums"]["post_status"]
          tags?: string[]
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_area_seo: {
        Row: {
          created_at: string
          id: string
          meta_description: string | null
          og_tags_complete: boolean
          page_name: string
          schema_active: boolean
          title_tag: string | null
          updated_at: string
          url_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_description?: string | null
          og_tags_complete?: boolean
          page_name: string
          schema_active?: boolean
          title_tag?: string | null
          updated_at?: string
          url_path: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_description?: string | null
          og_tags_complete?: boolean
          page_name?: string
          schema_active?: boolean
          title_tag?: string | null
          updated_at?: string
          url_path?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          last_login: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["user_status"]
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string
          id: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Relationships: []
      }
      topics: {
        Row: {
          category_id: string | null
          created_at: string
          generated_post_id: string | null
          id: string
          notes: string | null
          priority: number
          scheduled_at: string
          status: Database["public"]["Enums"]["topic_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          generated_post_id?: string | null
          id?: string
          notes?: string | null
          priority?: number
          scheduled_at: string
          status?: Database["public"]["Enums"]["topic_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          generated_post_id?: string | null
          id?: string
          notes?: string | null
          priority?: number
          scheduled_at?: string
          status?: Database["public"]["Enums"]["topic_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topics_generated_post_id_fkey"
            columns: ["generated_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin"
      automation_run_status: "success" | "failed"
      automation_trigger_type: "manual" | "scheduled"
      lead_status: "new" | "read" | "replied" | "archived"
      post_source: "manual" | "auto_generated"
      post_status: "draft" | "published" | "scheduled"
      topic_status: "pending" | "generated"
      user_status: "active" | "inactive"
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
      app_role: ["super_admin", "admin"],
      automation_run_status: ["success", "failed"],
      automation_trigger_type: ["manual", "scheduled"],
      lead_status: ["new", "read", "replied", "archived"],
      post_source: ["manual", "auto_generated"],
      post_status: ["draft", "published", "scheduled"],
      topic_status: ["pending", "generated"],
      user_status: ["active", "inactive"],
    },
  },
} as const
