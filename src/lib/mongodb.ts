import { MongoClient, type Db, type Collection } from "mongodb"
import type { DataPoint } from "@/types"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase(): Promise<{ db: Db; collection: Collection<DataPoint> }> {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB || "analytics_dashboard")
  const collection = db.collection<DataPoint>(process.env.MONGODB_COLLECTION || "data_points")

  return { db, collection }
}

export default clientPromise
