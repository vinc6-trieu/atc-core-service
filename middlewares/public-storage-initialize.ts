import fs from 'fs'
import {
  DOCS_STORAGE_DIR,
  IMAGES_STORAGE_DIR,
  IMAGES_STORAGE_LARGE,
  IMAGES_STORAGE_MEDIUM,
  IMAGES_STORAGE_ORIGINAL,
  IMAGES_STORAGE_SMALL,
  IMAGES_STORAGE_USER_DIR,
  PUBLIC_STORAGE_DIR,
  VIDEOS_STORAGE_DIR,
} from '../constants/base.constant'

export function createUploadDirectories() {
  console.log('CREATING DIRECTORY FOR FILES UPLOAD ....')
  const dirs = [
    './public/uploads',
    IMAGES_STORAGE_DIR,
    DOCS_STORAGE_DIR,
    PUBLIC_STORAGE_DIR,
    VIDEOS_STORAGE_DIR,
    IMAGES_STORAGE_USER_DIR,
    IMAGES_STORAGE_ORIGINAL,
    IMAGES_STORAGE_LARGE,
    IMAGES_STORAGE_LARGE,
    IMAGES_STORAGE_MEDIUM,
    IMAGES_STORAGE_SMALL,
  ]

  dirs.forEach((dir) => {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    } catch (err) {
      console.log(err)
    }
  })
}
