export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      colleges: {
        Row: {
          accreditation: string | null
          additional_images: Json | null
          address: string | null
          admission_process: string | null
          awards: Json | null
          campus_area: string | null
          category: string
          college_type: string
          courses_offered: Json | null
          created_at: string
          cutoff_info: string | null
          description: string | null
          email: string | null
          established: number | null
          facilities: Json | null
          fees_range: string | null
          id: string
          image_url: string | null
          location: string
          name: string
          national_ranking: number | null
          phone: string | null
          placement_stats: Json | null
          rating: number | null
          scholarships: Json | null
          total_courses: number | null
          total_students: number | null
          updated_at: string
          website_url: string | null
          youtube_video_url: string | null
        }
        Insert: {
          accreditation?: string | null
          additional_images?: Json | null
          address?: string | null
          admission_process?: string | null
          awards?: Json | null
          campus_area?: string | null
          category: string
          college_type?: string
          courses_offered?: Json | null
          created_at?: string
          cutoff_info?: string | null
          description?: string | null
          email?: string | null
          established?: number | null
          facilities?: Json | null
          fees_range?: string | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          national_ranking?: number | null
          phone?: string | null
          placement_stats?: Json | null
          rating?: number | null
          scholarships?: Json | null
          total_courses?: number | null
          total_students?: number | null
          updated_at?: string
          website_url?: string | null
          youtube_video_url?: string | null
        }
        Update: {
          accreditation?: string | null
          additional_images?: Json | null
          address?: string | null
          admission_process?: string | null
          awards?: Json | null
          campus_area?: string | null
          category?: string
          college_type?: string
          courses_offered?: Json | null
          created_at?: string
          cutoff_info?: string | null
          description?: string | null
          email?: string | null
          established?: number | null
          facilities?: Json | null
          fees_range?: string | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          national_ranking?: number | null
          phone?: string | null
          placement_stats?: Json | null
          rating?: number | null
          scholarships?: Json | null
          total_courses?: number | null
          total_students?: number | null
          updated_at?: string
          website_url?: string | null
          youtube_video_url?: string | null
        }
        Relationships: []
      }
      contact_queries: {
        Row: {
          created_at: string
          description: string
          email: string
          id: string
          name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          email: string
          id?: string
          name: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_settings: {
        Row: {
          categories: Json | null
          created_at: string
          featured_colleges_ids: string[] | null
          features: Json | null
          hero_background_image: string | null
          hero_subtitle: string
          hero_title: string
          id: string
          logo_url: string | null
          quick_stats: Json | null
          updated_at: string
          website_name: string
        }
        Insert: {
          categories?: Json | null
          created_at?: string
          featured_colleges_ids?: string[] | null
          features?: Json | null
          hero_background_image?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: string
          logo_url?: string | null
          quick_stats?: Json | null
          updated_at?: string
          website_name?: string
        }
        Update: {
          categories?: Json | null
          created_at?: string
          featured_colleges_ids?: string[] | null
          features?: Json | null
          hero_background_image?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: string
          logo_url?: string | null
          quick_stats?: Json | null
          updated_at?: string
          website_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_type?: string | null
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
      wbjee_branches: {
        Row: {
          branch_name: string
          college_id: string | null
          created_at: string | null
          degree: string | null
          id: string
          intake: number | null
          is_core: boolean | null
        }
        Insert: {
          branch_name: string
          college_id?: string | null
          created_at?: string | null
          degree?: string | null
          id?: string
          intake?: number | null
          is_core?: boolean | null
        }
        Update: {
          branch_name?: string
          college_id?: string | null
          created_at?: string | null
          degree?: string | null
          id?: string
          intake?: number | null
          is_core?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "wbjee_branches_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "wbjee_colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      wbjee_colleges: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          district: string | null
          email: string | null
          established: number | null
          id: string
          location: string
          logo_url: string | null
          name: string
          phone: string | null
          type: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          email?: string | null
          established?: number | null
          id?: string
          location: string
          logo_url?: string | null
          name: string
          phone?: string | null
          type: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          email?: string | null
          established?: number | null
          id?: string
          location?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          type?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      wbjee_counselling_schedule: {
        Row: {
          event: string
          event_date: string
          id: string
          year: number
        }
        Insert: {
          event: string
          event_date: string
          id?: string
          year?: number
        }
        Update: {
          event?: string
          event_date?: string
          id?: string
          year?: number
        }
        Relationships: []
      }
      wbjee_cutoffs: {
        Row: {
          branch_id: string | null
          category: string
          closing_rank: number | null
          college_id: string | null
          created_at: string | null
          domicile: string | null
          id: string
          opening_rank: number | null
          quota: string | null
          round: number
          year: number
        }
        Insert: {
          branch_id?: string | null
          category: string
          closing_rank?: number | null
          college_id?: string | null
          created_at?: string | null
          domicile?: string | null
          id?: string
          opening_rank?: number | null
          quota?: string | null
          round: number
          year: number
        }
        Update: {
          branch_id?: string | null
          category?: string
          closing_rank?: number | null
          college_id?: string | null
          created_at?: string | null
          domicile?: string | null
          id?: string
          opening_rank?: number | null
          quota?: string | null
          round?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "wbjee_cutoffs_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "wbjee_branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wbjee_cutoffs_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "wbjee_colleges"
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
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
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
