import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"
import type { DatabaseFilters } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters: DatabaseFilters = {}
    const minYear = searchParams.get("minYear")
    const maxYear = searchParams.get("maxYear")
    if (minYear && maxYear) {
      filters.endYearRange = [Number.parseInt(minYear), Number.parseInt(maxYear)]
    }
    const topics = searchParams.get("topics")
    if (topics) {
      filters.topics = topics.split(",").filter(Boolean)
    }

    const sectors = searchParams.get("sectors")
    if (sectors) {
      filters.sectors = sectors.split(",").filter(Boolean)
    }

    const regions = searchParams.get("regions")
    if (regions) {
      filters.regions = regions.split(",").filter(Boolean)
    }

    const countries = searchParams.get("countries")
    if (countries) {
      filters.countries = countries.split(",").filter(Boolean)
    }

    const cities = searchParams.get("cities")
    if (cities) {
      filters.cities = cities.split(",").filter(Boolean)
    }

    const pestles = searchParams.get("pestles")
    if (pestles) {
      filters.pestles = pestles.split(",").filter(Boolean)
    }

    const sources = searchParams.get("sources")
    if (sources) {
      filters.sources = sources.split(",").filter(Boolean)
    }
    const limit = searchParams.get("limit")
    const skip = searchParams.get("skip")
    if (limit) filters.limit = Number.parseInt(limit)
    if (skip) filters.skip = Number.parseInt(skip)

    const data = await DatabaseService.getAllData(filters)

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await DatabaseService.insertSampleData()

    return NextResponse.json({
      success: true,
      message: "Sample data initialized successfully",
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
