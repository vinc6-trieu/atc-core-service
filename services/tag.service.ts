import TAG_MODEL, { TagDocument } from '../models/tag.model'
import { BaseService } from '../shared/base/service.base'

class TagService extends BaseService<TagDocument> {
  constructor() {
    super(TAG_MODEL)
  }
}

export const tagService = new TagService()
