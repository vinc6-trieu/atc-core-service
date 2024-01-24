import { Request, Response, NextFunction } from 'express'
import IMAGE_MODEL from '../models/image.model'
import { DEVICE_IMAGE_SIZE, resizeImage } from '../shared/utils/image.util'
import {
  IMAGES_STORAGE_DIR_SRC,
  IMAGES_STORAGE_LARGE,
  IMAGES_STORAGE_MEDIUM,
  IMAGES_STORAGE_ORIGINAL_SRC,
  IMAGES_STORAGE_SMALL,
} from '../constants/base.constant'

interface MulterRequest extends Request {
  uploadError: boolean
  file: any
  files: any
}

export const saveImagesToDB = async (
  req: MulterRequest | Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (req.file) {
      const image = await new IMAGE_MODEL({
        name: req.file.filename,
        alt: req.file.filename,
        src: IMAGES_STORAGE_DIR_SRC + req.file.filename,
      }).save()

      req.file._id = image._id

      // generate 3 images with different sizes for thumbnail images
      await Promise.all([
        resizeImage('public' + image.src, IMAGES_STORAGE_LARGE, {
          device: DEVICE_IMAGE_SIZE.DESKTOP,
          quality: 90,
        }),
        resizeImage('public' + image.src, IMAGES_STORAGE_MEDIUM, {
          device: DEVICE_IMAGE_SIZE.TABLET,
          quality: 90,
        }),
        resizeImage('public' + image.src, IMAGES_STORAGE_SMALL, {
          device: DEVICE_IMAGE_SIZE.MOBILE,
          quality: 80,
        }),
      ])
    }

    if (req.files) {
      const fieldNames = Object.keys(req.files)
      for (const element of fieldNames) {
        const images = req.files[element]
          ? await Promise.all(
              req.files[element].map((e: any) =>
                new IMAGE_MODEL({
                  name: e.filename,
                  src: IMAGES_STORAGE_ORIGINAL_SRC + e.filename,
                  smallSrc: IMAGES_STORAGE_ORIGINAL_SRC + e.filename,
                  mediumSrc: IMAGES_STORAGE_MEDIUM + e.filename,
                  largeSrc: IMAGES_STORAGE_LARGE + e.filename,
                  alt: e.filename,
                  createdAt: new Date(),
                }).save(),
              ),
            )
          : []
        req.files[element] = images

        for (const element of images) {
          await Promise.all([
            resizeImage('public' + element.src, IMAGES_STORAGE_LARGE, {
              device: DEVICE_IMAGE_SIZE.DESKTOP,
              quality: 90,
            }),
            resizeImage('public' + element.src, IMAGES_STORAGE_MEDIUM, {
              device: DEVICE_IMAGE_SIZE.TABLET,
              quality: 90,
            }),
            resizeImage('public' + element.src, IMAGES_STORAGE_SMALL, {
              device: DEVICE_IMAGE_SIZE.MOBILE,
              quality: 80,
            }),
          ])
        }
      }
    }

    if (!req.files && !req.file) {
      //@ts-ignore
      req.uploadError = true
    }

    next()
  } catch (error) {
    console.log({ error })
    next(error) // Pass the error to the error handling middleware
  }
}
