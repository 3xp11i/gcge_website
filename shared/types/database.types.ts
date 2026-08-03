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
      availability_exceptions: {
        Row: {
          date: string
          end_time: string | null
          id: string
          reason: string | null
          start_time: string | null
          type: string
        }
        Insert: {
          date: string
          end_time?: string | null
          id?: string
          reason?: string | null
          start_time?: string | null
          type: string
        }
        Update: {
          date?: string
          end_time?: string | null
          id?: string
          reason?: string | null
          start_time?: string | null
          type?: string
        }
        Relationships: []
      }
      availability_rules: {
        Row: {
          active: boolean | null
          created_at: string | null
          end_time: string
          id: string
          start_time: string
          weekday: number
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          end_time: string
          id?: string
          start_time: string
          weekday: number
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          end_time?: string
          id?: string
          start_time?: string
          weekday?: number
        }
        Relationships: []
      }
      bookings: {
        Row: {
          consultation_id: string
          created_at: string
          ends_at: string
          hold_expires_at: string | null
          id: string
          payment_id: string | null
          service_type_id: string
          starts_at: string
          status: string
        }
        Insert: {
          consultation_id: string
          created_at?: string
          ends_at: string
          hold_expires_at?: string | null
          id?: string
          payment_id?: string | null
          service_type_id: string
          starts_at: string
          status?: string
        }
        Update: {
          consultation_id?: string
          created_at?: string
          ends_at?: string
          hold_expires_at?: string | null
          id?: string
          payment_id?: string | null
          service_type_id?: string
          starts_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments_logs"
            referencedColumns: ["payment_id"]
          },
          {
            foreignKeyName: "bookings_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          accuracy: string
          birth_date: string
          birth_location: string
          birth_time: string
          birth_zipcode: string
          client_name: string
          consultationMethod: string
          created_at: string
          email: string
          id: string
          instagramUsername: string | null
          message: string | null
          package: string
          phone: string
        }
        Insert: {
          accuracy: string
          birth_date: string
          birth_location: string
          birth_time: string
          birth_zipcode: string
          client_name: string
          consultationMethod: string
          created_at?: string
          email: string
          id?: string
          instagramUsername?: string | null
          message?: string | null
          package: string
          phone: string
        }
        Update: {
          accuracy?: string
          birth_date?: string
          birth_location?: string
          birth_time?: string
          birth_zipcode?: string
          client_name?: string
          consultationMethod?: string
          created_at?: string
          email?: string
          id?: string
          instagramUsername?: string | null
          message?: string | null
          package?: string
          phone?: string
        }
        Relationships: []
      }
      course_purchases: {
        Row: {
          created_at: string
          email: string
          experience: string
          first_name: string
          id: number
          last_name: string
          payment_id: string
        }
        Insert: {
          created_at?: string
          email: string
          experience: string
          first_name: string
          id?: number
          last_name: string
          payment_id?: string
        }
        Update: {
          created_at?: string
          email?: string
          experience?: string
          first_name?: string
          id?: number
          last_name?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_purchases_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments_logs"
            referencedColumns: ["payment_id"]
          },
        ]
      }
      free_consultation_responses: {
        Row: {
          author: string
          consultation_id: string
          created_at: string
          id: string
          response_text: string
        }
        Insert: {
          author: string
          consultation_id: string
          created_at?: string
          id?: string
          response_text: string
        }
        Update: {
          author?: string
          consultation_id?: string
          created_at?: string
          id?: string
          response_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "free_consultation_responses_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "free_consultation_responses_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "free_consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      free_consultations: {
        Row: {
          accuracy: string
          birth_date: string
          birth_location: string
          birth_time: string
          birth_zipcode: string
          category: string
          client_name: string
          created_at: string
          gender: string
          id: string
          message: string | null
          profile_id: string
        }
        Insert: {
          accuracy: string
          birth_date: string
          birth_location: string
          birth_time: string
          birth_zipcode: string
          category: string
          client_name: string
          created_at?: string
          gender: string
          id?: string
          message?: string | null
          profile_id: string
        }
        Update: {
          accuracy?: string
          birth_date?: string
          birth_location?: string
          birth_time?: string
          birth_zipcode?: string
          category?: string
          client_name?: string
          created_at?: string
          gender?: string
          id?: string
          message?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "free_consultations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payments_logs: {
        Row: {
          amount: number
          created_at: string
          currency: string
          payment_id: string
          product_name: string
          product_type: string
          provider: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          payment_id?: string
          product_name: string
          product_type: string
          provider: string
          status: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          payment_id?: string
          product_name?: string
          product_type?: string
          provider?: string
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          last_name: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          last_name: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      service_types: {
        Row: {
          active: boolean
          duration_minutes: number
          id: string
          name: string
        }
        Insert: {
          active: boolean
          duration_minutes: number
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          duration_minutes?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      website_information: {
        Row: {
          created_at: string
          description: string | null
          expiry: string | null
          id: number
          title: string | null
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expiry?: string | null
          id?: number
          title?: string | null
          type?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expiry?: string | null
          id?: number
          title?: string | null
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      daily_open_windows: {
        Row: {
          date: string | null
          end_time: string | null
          start_time: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      "Slot Status": "available" | "pending" | "booked"
      user_type: "admin" | "user" | "consultant"
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
      "Slot Status": ["available", "pending", "booked"],
      user_type: ["admin", "user", "consultant"],
    },
  },
} as const
