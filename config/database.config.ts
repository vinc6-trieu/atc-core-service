import dotenv from 'dotenv'

dotenv.config()

export const DATABASE_CONFIGS = {
  mongodb: {
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    database_name: process.env.MONGODB_DB_NAME,
  },
}

// export const MONGODB_URI = `mongodb://${DATABASE_CONFIGS.mongodb.host}:${DATABASE_CONFIGS.mongodb.port}/${DATABASE_CONFIGS.mongodb.database_name}`
export const MONGODB_URI = `mongodb+srv://vlu:12345678x%40X@vlu-cms-cluster.38wklo8.mongodb.net/${DATABASE_CONFIGS.mongodb.database_name}`
