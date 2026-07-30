import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017'
const dbName = process.env.DB_NAME || 'mrcoco_bakery'

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(uri)
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}
