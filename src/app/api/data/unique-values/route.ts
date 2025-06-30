import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"
import type { DataPoint } from "@/types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const field = searchParams.get("field") as keyof DataPoint

    if (!field) {
      return NextResponse.json({ success: false, error: "Field parameter is required" }, { status: 400 })
    }

    const values = await DatabaseService.getUniqueValues(field)

    return NextResponse.json({
      success: true,
      field,
      values,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch unique values",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
