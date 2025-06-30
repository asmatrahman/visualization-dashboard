import { connectToDatabase } from "./mongodb"
import type { DataPoint } from "@/types"

export interface DatabaseFilters {
  endYearRange?: [number, number]
  topics?: string[]
  sectors?: string[]
  regions?: string[]
  countries?: string[]
  cities?: string[]
  pestles?: string[]
  sources?: string[]
  publishedDateRange?: [Date | null, Date | null]
  limit?: number
  skip?: number
}

export class DatabaseService {
  static async getAllData(filters: DatabaseFilters = {}): Promise<DataPoint[]> {
    try {
      const { collection } = await connectToDatabase()

      const query: any = {}
      if (filters.endYearRange) {
        query.$or = [
          {
            end_year: {
              $gte: filters.endYearRange[0],
              $lte: filters.endYearRange[1],
            },
          },
          {
            start_year: {
              $gte: filters.endYearRange[0],
              $lte: filters.endYearRange[1],
            },
          },
          { end_year: null },
          { start_year: null },
        ]
      }

      if (filters.topics && filters.topics.length > 0) {
        query.topic = { $in: filters.topics }
      }

      if (filters.sectors && filters.sectors.length > 0) {
        query.sector = { $in: filters.sectors }
      }

      if (filters.regions && filters.regions.length > 0) {
        query.region = { $in: filters.regions }
      }

      if (filters.countries && filters.countries.length > 0) {
        query.country = { $in: filters.countries }
      }

      if (filters.cities && filters.cities.length > 0) {
        query.city = { $in: filters.cities }
      }

      if (filters.pestles && filters.pestles.length > 0) {
        query.pestle = { $in: filters.pestles }
      }

      if (filters.sources && filters.sources.length > 0) {
        query.source = { $in: filters.sources }
      }
      if (filters.publishedDateRange && (filters.publishedDateRange[0] || filters.publishedDateRange[1])) {
        query.published = {}
        if (filters.publishedDateRange[0]) {
          query.published.$gte = filters.publishedDateRange[0]
        }
        if (filters.publishedDateRange[1]) {
          query.published.$lte = filters.publishedDateRange[1]
        }
      }

      const cursor = collection.find(query)

      if (filters.skip) {
        cursor.skip(filters.skip)
      }

      if (filters.limit) {
        cursor.limit(filters.limit)
      }

      const data = await cursor.toArray()
      return data
    } catch (error) {
      console.error("Database query error:", error)
      throw new Error("Failed to fetch data from database")
    }
  }

  static async getUniqueValues(field: keyof DataPoint): Promise<string[]> {
    try {
      const { collection } = await connectToDatabase()
      const values = await collection.distinct(field as string, { [field]: { $nin: [null, ""] } })
      return values.filter(Boolean).sort()
    } catch (error) {
      console.error(`Error fetching unique values for ${field}:`, error)
      return []
    }
  }

  static async getDataCount(filters: DatabaseFilters = {}): Promise<number> {
    try {
      const { collection } = await connectToDatabase()
      const query: any = {}

      if (filters.endYearRange) {
        query.$or = [
          {
            end_year: {
              $gte: filters.endYearRange[0],
              $lte: filters.endYearRange[1],
            },
          },
          {
            start_year: {
              $gte: filters.endYearRange[0],
              $lte: filters.endYearRange[1],
            },
          },
          { end_year: null },
          { start_year: null },
        ]
      }

      if (filters.topics && filters.topics.length > 0) {
        query.topic = { $in: filters.topics }
      }

      return await collection.countDocuments(query)
    } catch (error) {
      console.error("Error counting documents:", error)
      return 0
    }
  }

  static async insertSampleData(): Promise<void> {
    try {
      const { collection } = await connectToDatabase()

      const count = await collection.countDocuments()
      if (count > 0) {
        console.log("Sample data already exists in database")
        return
      }

      const sampleData: DataPoint[] = [
        {
          end_year: 2027,
          intensity: 60,
          likelihood: 4,
          relevance: 5,
          start_year: 2022,
          country: "United States",
          region: "Northern America",
          city: "Washington",
          sector: "Government",
          topic: "market",
          pestle: "Political",
          source: "CleanTechnica",
          insight: "E-Boats, Anyone? Electric Boat Market To Reach $20 Billion By 2027",
          title:
            "The market for non-military electric watercraft and marine motors will balloon to over $20 billion worldwide by 2027.",
          url: "https://cleantechnica.com/2017/01/13/e-boats-anyone-electric-boat-market-reach-20-billion-2027/",
          published: "January, 13 2017 00:00:00",
          added: "January, 18 2017 02:23:13",
        },
        {
          end_year: 2025,
          intensity: 45,
          likelihood: 3,
          relevance: 4,
          start_year: 2020,
          country: "China",
          region: "Eastern Asia",
          city: "Beijing",
          sector: "Energy",
          topic: "renewable energy",
          pestle: "Environmental",
          source: "Reuters",
          insight: "China's renewable energy capacity expansion",
          title: "China leads global renewable energy capacity additions",
          url: "https://reuters.com/renewable-energy",
          published: "March, 15 2020 00:00:00",
          added: "March, 20 2020 10:15:30",
        },
        {
          end_year: 2030,
          intensity: 75,
          likelihood: 5,
          relevance: 5,
          start_year: 2023,
          country: "Germany",
          region: "Western Europe",
          city: "Berlin",
          sector: "Technology",
          topic: "artificial intelligence",
          pestle: "Technological",
          source: "TechCrunch",
          insight: "AI adoption in European manufacturing",
          title: "European AI market expected to grow significantly by 2030",
          url: "https://techcrunch.com/ai-europe",
          published: "June, 10 2023 00:00:00",
          added: "June, 12 2023 14:22:45",
        },
      ]

      await collection.insertMany(sampleData)
      console.log("Sample data inserted successfully")
    } catch (error) {
      console.error("Error inserting sample data:", error)
    }
  }
}
