import { TagDocument } from '../../../models/tag.model'
import { tagService } from '../../../services/tag.service'
import { BaseController } from '../../../shared/base/controller.base'

class TagController extends BaseController<TagDocument> {
  constructor() {
    super(tagService, TagController.name)
  }
}

export const tagController = new TagController()
