const mongoose = require("mongoose")
require("dotenv").config({ path: ".env.local" })

const MONGODB_URI = process.env.MONGODB_URI

async function fixLikeIndexes() {
  try {
    console.log("🔌 Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    const db = mongoose.connection.db
    const collection = db.collection("likes")

    // List all indexes
    const indexes = await collection.indexes()
    console.log("📋 Current indexes:", indexes.map((idx) => idx.name))

    // Drop old/incorrect indexes
    const indexesToDrop = indexes
      .filter((idx) => idx.name !== "_id_")
      .map((idx) => idx.name)

    if (indexesToDrop.length > 0) {
      console.log(`🗑️ Dropping old indexes: ${indexesToDrop.join(", ")}`)
      for (const indexName of indexesToDrop) {
        try {
          await collection.dropIndex(indexName)
          console.log(`✅ Dropped index: ${indexName}`)
        } catch (err) {
          console.log(`⚠️ Could not drop ${indexName}:`, err.message)
        }
      }
    }

    // Create the correct index
    console.log("🔨 Creating correct index...")
    try {
      await collection.createIndex(
        { user: 1, itemType: 1, itemId: 1 },
        { unique: true, name: "user_itemType_itemId_unique" }
      )
      console.log("✅ Created index: user_itemType_itemId_unique")
    } catch (err) {
      if (err.code === 85) {
        console.log("✅ Index already exists")
      } else {
        throw err
      }
    }

    // Verify the index
    const finalIndexes = await collection.indexes()
    console.log("📋 Final indexes:", finalIndexes.map((idx) => idx.name))

    console.log("✅ Index fix complete!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error fixing indexes:", error)
    process.exit(1)
  }
}

fixLikeIndexes()

