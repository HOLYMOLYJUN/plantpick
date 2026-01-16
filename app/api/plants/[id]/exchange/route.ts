import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * 식물 교환 처리
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: plantId } = await params;

    // 식물 존재 확인 및 상태 확인
    const { data: plant, error: plantError } = await supabase
      .from("plants")
      .select("id, is_mature, is_exchanged")
      .eq("id", plantId)
      .single();

    if (plantError || !plant) {
      return NextResponse.json(
        { success: false, error: "식물을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 이미 교환된 식물인지 확인
    if (plant.is_exchanged) {
      return NextResponse.json(
        { success: false, error: "이미 교환된 식물입니다." },
        { status: 400 }
      );
    }

    // 성체가 아니면 교환 불가
    if (!plant.is_mature) {
      return NextResponse.json(
        { success: false, error: "성체 상태가 아니면 교환할 수 없습니다." },
        { status: 400 }
      );
    }

    // 교환 처리
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("plants")
      .update({
        is_exchanged: true,
        exchanged_at: now,
      })
      .eq("id", plantId);

    if (updateError) {
      console.error("Supabase 교환 처리 오류:", updateError);
      return NextResponse.json(
        { success: false, error: "교환 처리에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      exchangedAt: now,
    });
  } catch (error) {
    console.error("교환 처리 오류:", error);
    return NextResponse.json(
      { success: false, error: "교환 처리에 실패했습니다." },
      { status: 500 }
    );
  }
}

