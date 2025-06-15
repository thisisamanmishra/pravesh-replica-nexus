export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
