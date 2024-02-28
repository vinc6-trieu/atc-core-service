import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { pageComponentController } from '../../../controllers/cms-api/v1/page-component.controller'
import { checkRole } from '../../../middlewares/check-role'
import { ERoles } from '../../../shared/enums/roles.enum'

export const pageComponentRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
pageComponentRoute.post(
  '/',
  uploadImage.none(),
  checkRole(ERoles.SUPER_ADMIN),
  pageComponentController.createID,
)
pageComponentRoute.put(
  '/:id',
  uploadImage.none(),
  checkRole(ERoles.SUPER_ADMIN),
  pageComponentController.createOrUpdate,
)

// -------------------- DELETE ----------------------------
pageComponentRoute.delete(
  '/:id',
  uploadImage.none(),
  checkRole(ERoles.SUPER_ADMIN),
  pageComponentController.removeOne,
)
