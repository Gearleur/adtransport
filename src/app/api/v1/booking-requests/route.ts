import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("booking_requests")
    .insert({
      pickup_address: "10 Rue de Rivoli, Paris",
      dropoff_address: "20 Avenue des Champs-Élysées, Paris",
      customer_name: "Alexandre Test",
      customer_email: "alexandre.test@example.com",
      customer_phone: "+33600000000",
      estimated_distance_km: 7.5,
      base_price: 12,
      distance_price: 18,
      options_price: 5,
      total_estimated_price: 35,
      currency: "EUR",
      status: "pending",
      notes: "Test initial de réservation",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    data,
  });
}