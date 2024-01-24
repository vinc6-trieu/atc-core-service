import IMAGE_MODEL, { ImageDocument } from '../models/image.model'
import { BaseService } from '../shared/base/service.base'

class ImageService extends BaseService<ImageDocument> {
  constructor() {
    super(IMAGE_MODEL)
  }
}

export const imageService = new ImageService()
