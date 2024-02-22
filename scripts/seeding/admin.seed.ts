import mongoose from 'mongoose'
import { MONGODB_URI } from '../../config/database.config'
import { adminService } from '../../services/auth/admin.service'

// Connect to MongoDB
mongoose.connect(MONGODB_URI)

// Function to seed the database
const seedDatabase = async (): Promise<void> => {
  try {
    await adminService.createAdmin({
      fullname: 'superadmin',
      password: '123456',
      username: 'superadmin',
      gender: 1,
      email: 'superadmin@superadmin.com',
      phone: '123123123123',
      role: 0,
    })

    console.log('Database admin seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    // Close the MongoDB connection
    mongoose.disconnect()
  }
}

// Call the seedDatabase function to start seeding
seedDatabase()
