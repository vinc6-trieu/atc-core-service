import CONTACT_REQUEST_MODEL, { ContactRequestDocument } from '../models/contact-request.model'
import { BaseService } from '../shared/base/service.base'

class ContactRequestService extends BaseService<ContactRequestDocument> {
  constructor() {
    super(CONTACT_REQUEST_MODEL)
  }
}

export const contactRequestService = new ContactRequestService()
