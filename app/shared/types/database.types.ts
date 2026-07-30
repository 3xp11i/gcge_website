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
        ]
      }
      consultations: {
        Row: {
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
          needsBtr: boolean
          package: string
          payment_id: string
          payment_provider: string
          payment_status: string
          phone: string
        }
        Insert: {
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
          needsBtr: boolean
          package: string
          payment_id: string
          payment_provider: string
          payment_status?: string
          phone: string
        }
        Update: {
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
          needsBtr?: boolean
          package?: string
          payment_id?: string
          payment_provider?: string
          payment_status?: string
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
          payment_provider: string
        }
        Insert: {
          created_at?: string
          email: string
          experience: string
          first_name: string
          id?: number
          last_name: string
          payment_id: string
          payment_provider: string
        }
        Update: {
          created_at?: string
          email?: string
          experience?: string
          first_name?: string
          id?: number
          last_name?: string
          payment_id?: string
          payment_provider?: string
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
    },
  },
} as const
