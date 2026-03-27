// ============================================================================
// Types Supabase — basés sur le schéma réel (001_init + 002_add_missing_fields)
// Remplacer plus tard par `npm run db:gen-types` pour auto-génération
// ============================================================================

export type Database = {
  public: {
    Tables: {
      ride_options: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          icon: string | null;
          price_type: "fixed" | "per_km" | "percentage";
          price_value: number;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          price_type: "fixed" | "per_km" | "percentage";
          price_value?: number;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          price_type?: "fixed" | "per_km" | "percentage";
          price_value?: number;
          is_active?: boolean;
          display_order?: number;
          updated_at?: string;
        };
      };
      booking_requests: {
        Row: {
          id: string;
          pickup_address: string;
          dropoff_address: string;
          customer_email: string;
          customer_name: string | null;
          customer_phone: string | null;
          pickup_lat: number | null;
          pickup_lng: number | null;
          dropoff_lat: number | null;
          dropoff_lng: number | null;
          estimated_distance_km: number;
          base_price: number;
          distance_price: number;
          options_price: number;
          total_estimated_price: number;
          currency: string;
          status: "pending" | "confirmed" | "completed" | "cancelled";
          requested_at: string | null;
          notes: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pickup_address: string;
          dropoff_address: string;
          customer_email: string;
          customer_name?: string | null;
          customer_phone?: string | null;
          pickup_lat?: number | null;
          pickup_lng?: number | null;
          dropoff_lat?: number | null;
          dropoff_lng?: number | null;
          estimated_distance_km?: number;
          base_price?: number;
          distance_price?: number;
          options_price?: number;
          total_estimated_price?: number;
          currency?: string;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          requested_at?: string | null;
          notes?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pickup_address?: string;
          dropoff_address?: string;
          customer_email?: string;
          customer_name?: string | null;
          customer_phone?: string | null;
          pickup_lat?: number | null;
          pickup_lng?: number | null;
          dropoff_lat?: number | null;
          dropoff_lng?: number | null;
          estimated_distance_km?: number;
          base_price?: number;
          distance_price?: number;
          options_price?: number;
          total_estimated_price?: number;
          currency?: string;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          requested_at?: string | null;
          notes?: string | null;
          reviewed_at?: string | null;
          updated_at?: string;
        };
      };
      booking_request_options: {
        Row: {
          id: string;
          booking_request_id: string;
          ride_option_id: string;
          option_code_snapshot: string;
          option_name_snapshot: string;
          price_type_snapshot: string;
          price_value_snapshot: number;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_request_id: string;
          ride_option_id: string;
          option_code_snapshot: string;
          option_name_snapshot: string;
          price_type_snapshot: string;
          price_value_snapshot?: number;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_request_id?: string;
          ride_option_id?: string;
          option_code_snapshot?: string;
          option_name_snapshot?: string;
          price_type_snapshot?: string;
          price_value_snapshot?: number;
          quantity?: number;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// ─── Helpers ───

export type TableRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TableInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TableUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];