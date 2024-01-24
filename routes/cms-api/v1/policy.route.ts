import express from 'express'
import { uploadImage } from '../../../middlewares/upload-file'
import { policyController } from '../../../controllers/cms-api/policy.controller'

export const policyRoute = express.Router()

// -------------------- CREATE OR UPDATE ----------------------------
policyRoute.post('/', uploadImage.none(), policyController.createID)
policyRoute.put('/:id', uploadImage.none(), policyController.createOrUpdate)

// -------------------- DELETE ----------------------------
policyRoute.delete('/:id', uploadImage.none(), policyController.removeOne)
