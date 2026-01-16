import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PLANT_CONFIGS } from "@/lib/constants";

/**
 * 케어 기록 추가
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: plantId } = await params;
    const { type } = await request.json();

    if (!type || !["water", "fertilizer", "sunlight", "wind"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "유효한 케어 타입이 필요합니다." },
        { status: 400 }
      );
    }

    // 식물 존재 확인 및 타입 조회
    const { data: plant, error: plantError } = await supabase
      .from("plants")
      .select("id, type, is_mature")
      .eq("id", plantId)
      .single();

    if (plantError || !plant) {
      return NextResponse.json(
        { success: false, error: "식물을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 케어 기록 추가
    const now = new Date().toISOString();
    const { data: careRecord, error } = await supabase
      .from("care_records")
      .insert({
        plant_id: plantId,
        type,
        timestamp: now,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase 케어 기록 생성 오류:", error);
      return NextResponse.json(
        { success: false, error: "케어 기록 추가에 실패했습니다." },
        { status: 500 }
      );
    }

    // 케어 기록 추가 후 현재 케어 기록 조회 (성체 상태 체크용)
    const { data: allCareRecords } = await supabase
      .from("care_records")
      .select("type")
      .eq("plant_id", plantId);

    // 성체 상태 체크: 이미 성체가 아니고, 모든 케어가 완료되었는지 확인
    if (!plant.is_mature) {
      const plantConfig = PLANT_CONFIGS.find((config) => config.type === plant.type);
      
      if (plantConfig) {
        // 각 케어 타입별 완료 횟수 계산
        const careCounts: Record<string, number> = {
          water: 0,
          fertilizer: 0,
          sunlight: 0,
          wind: 0,
        };

        (allCareRecords || []).forEach((record) => {
          careCounts[record.type] = (careCounts[record.type] || 0) + 1;
        });

        // 모든 케어 요구사항 완료 확인
        const allCaresCompleted =
          careCounts.water >= plantConfig.requiredCares.water &&
          careCounts.fertilizer >= plantConfig.requiredCares.fertilizer &&
          careCounts.sunlight >= plantConfig.requiredCares.sunlight &&
          careCounts.wind >= plantConfig.requiredCares.wind;

        // 모든 케어가 완료되었으면 성체 상태로 변경
        if (allCaresCompleted) {
          await supabase
            .from("plants")
            .update({ is_mature: true, last_cared_at: now })
            .eq("id", plantId);
        } else {
          // 케어 완료 안됨: last_cared_at만 업데이트
          await supabase
            .from("plants")
            .update({ last_cared_at: now })
            .eq("id", plantId);
        }
      } else {
        // 식물 설정을 찾을 수 없으면 last_cared_at만 업데이트
        await supabase
          .from("plants")
          .update({ last_cared_at: now })
          .eq("id", plantId);
      }
    } else {
      // 이미 성체면 last_cared_at만 업데이트
      await supabase
        .from("plants")
        .update({ last_cared_at: now })
        .eq("id", plantId);
    }

    // 성체 상태 변경 여부 확인
    const { data: updatedPlant } = await supabase
      .from("plants")
      .select("is_mature")
      .eq("id", plantId)
      .single();

    return NextResponse.json({
      success: true,
      careRecord: {
        type: careRecord.type,
        timestamp: careRecord.timestamp,
      },
      becameMature: updatedPlant?.is_mature && !plant.is_mature,
    });
  } catch (error) {
    console.error("케어 기록 추가 오류:", error);
    return NextResponse.json(
      { success: false, error: "케어 기록 추가에 실패했습니다." },
      { status: 500 }
    );
  }
}

