import mongoose from "mongoose"

// Connection URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://srijitd248:srijit12345678@cluster0.hsy1s.mongodb.net/secondhome?retryWrites=true&w=majority&appName=Cluster0"

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

// Connection options
const options: mongoose.ConnectOptions = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
}

// Global variable to cache connection promise
declare global {
  var mongooseConnectionPromise: Promise<typeof mongoose> | null
}

let connectionPromise = global.mongooseConnectionPromise

export async function connectToDatabase() {
  // If connection is already established, return immediately
  if (mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection")
    return mongoose
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    console.log("Waiting for existing connection attempt...")
    return await connectionPromise
  }

  console.log("Creating new MongoDB connection...")

  // Create new connection promise and cache it
  connectionPromise = mongoose.connect(MONGODB_URI, options)
    .then((m) => {
      console.log("Connected to MongoDB successfully")
      return m
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error)
      // Clear the promise on error so we can retry
      connectionPromise = null
      global.mongooseConnectionPromise = null
      throw error
    })

  global.mongooseConnectionPromise = connectionPromise

  return await connectionPromise
}
