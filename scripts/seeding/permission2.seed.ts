import mongoose from 'mongoose'
import { MONGODB_URI } from '../../config/database.config'
import PERMISSION_MODEL from '../../models/permission.model'
import { EPermissionOperation } from '../../shared/enums/roles.enum'

// Connect to MongoDB
mongoose.connect(MONGODB_URI)

// Sample data to seed the database
const permissionsData: any = [
  {
    root: {
      endpoint: '/cms/posts',
      name: 'Post permission',
      description: 'Post permission',
    },
    permissions: [
      {
        endpoint: '/cms/posts',
        name: 'View Post',
        description: 'Permission to view posts',
      },
      {
        endpoint: '/cms/posts',
        name: 'Create Post',
        description: 'Permission to create post',
      },
      {
        endpoint: '/cms/posts',
        name: 'Edit Post',
        description: 'Permission to edit post',
      },
      {
        endpoint: '/cms/posts',
        name: 'Delete Post',
        description: 'Permission to delete post',
      },
      {
        endpoint: '/cms/posts',
        name: 'Publish Post',
        description: 'Permission to publish post',
      },
    ],
  },
  {
    root: {
      endpoint: '/cms/post-categories',
      name: 'Post Category Permission',
      description: 'Post Category Permission',
    },
    permissions: [
      {
        endpoint: '/cms/post-categories',
        name: 'View Post Category',
        description: 'Permission to view post categories',
      },
      {
        endpoint: '/cms/post-categories',
        name: 'Create Post Category',
        description: 'Permission to create post category',
      },
      {
        endpoint: '/cms/post-categories',
        name: 'Edit Post Category',
        description: 'Permission to edit post categories',
      },
      {
        endpoint: '/cms/post-categories',
        name: 'Delete Post Category',
        description: 'Permission to delete post categories',
      },
      {
        endpoint: '/cms/post-categories',
        name: 'Publish Post Category',
        description: 'Permission to publish post categories',
      },
    ],
  },
]

// Function to seed the database
const seedDatabase = async (): Promise<void> => {
  try {
    // Remove existing data
    await PERMISSION_MODEL.deleteMany()
    for (const permission of permissionsData) {
      const root = await PERMISSION_MODEL.create(permission.root)

      for (const item of permission.permissions) {
        await PERMISSION_MODEL.create({
          ...item,
          root: root._id,
        })
      }
    }

    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    // Close the MongoDB connection
    mongoose.disconnect()
  }
}

// Call the seedDatabase function to start seeding
seedDatabase()
