import { BaseController } from '../../shared/base/controller.base'
import { ImageDocument } from '../../models/image.model'
import { imageService } from '../../services/image.service'
import { NextFunction, Request, Response } from 'express'
import { ERROR_CODES } from '../../constants/response-message.constant'
import { STATUS_CODE } from '../../constants/base.constant'

interface MulterRequest extends Request {
  uploadError: boolean
  imageError: boolean
  file: any
  files: any
}

class ImageController extends BaseController<ImageDocument> {
  constructor() {
    super(imageService, ImageController.name)
  }

  getList = async (req: MulterRequest | Request, res: Response, _: NextFunction) => {
    const { skip = 0, limit = 10, search } = req.query

    const conditions = search ? { $text: { $search: `${search}` } } : {}

    const signalResponse = await imageService.getList({
      queryConditions: conditions,
      skip: +skip,
      limit: +limit,
      sort: {
        modifiedAt: -1,
        createdAt: -1,
        ...(search ? { score: { $meta: 'textScore' } } : {}),
      },
    })

    return res.status(signalResponse.error ? 400 : 200).json(signalResponse)
  }

  createImageCKEditor = async (req: MulterRequest | Request, res: Response, _: NextFunction) => {
    //@ts-ignore
    if (req.uploadError || req.imageError) {
      return res.status(400).json({ error: true, message: 'upload_error' })
    }
    const file = req.files?.upload?.[0]

    if (!file)
      return res.status(STATUS_CODE.BAD_REQUEST).json({ error: { message: 'Upload file failed' } })

    return res.json({
      fileName: file.name,
      uploaded: 1,
      url: file.src,
    })
  }

  createImage = async (req: MulterRequest | Request, res: Response, _: NextFunction) => {
    //@ts-ignore
    if (req.uploadError || req.imageError) {
      return res.status(400).json({ error: true, message: 'upload_error' })
    }

    return res.json({
      error: false,
      message: 'File uploaded successfully',
      data: req.files,
    })
  }

  updateImage = async (req: MulterRequest | Request, res: Response, _: NextFunction) => {
    const { id, ...dataUpdate } = req.body
    const signalResponse = await imageService.updateOne({
      queryConditions: { _id: id },
      data: dataUpdate,
    })
    return res.status(signalResponse.error ? 400 : 200).json(signalResponse)
  }
}

export const imageController = new ImageController()
