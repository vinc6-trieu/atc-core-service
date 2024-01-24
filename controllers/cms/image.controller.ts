import { NextFunction, Request, Response } from 'express'
import { imageService } from '../../services/image.service'

class ImageViewController {
  renderGallery = async (req: Request, res: Response, next: NextFunction) => {
    const { skip = 0, limit = 20, search } = req.query

    const conditions = search ? { $text: { $search: `${search}` } } : {}

    const listImages = await imageService.getList({
      queryConditions: conditions,
      skip: +skip,
      limit: +limit,
      sort: {
        modifiedAt: -1,
        createdAt: -1,
        ...(search ? { score: { $meta: 'textScore' } } : {}),
      },
    })

    // const mediaLibrary = [
    //   { icon: 'path/to/folder1.png', title: 'Folder 1', size: 20 },
    //   { icon: 'path/to/folder2.png', title: 'Folder 2', size: 15 },
    // ];

    return res.render('gallery', { images: listImages.data, search, /* mediaLibrary */ })
  }

  renderGalleryCkeditor = async (req: Request, res: Response, next: NextFunction) => {
    console.log('-------------- renderGalleryCkeditor  -----------------')
    const {
      skip = 0,
      limit = 20,
      search,
      CKEditor = '',
      CKEditorFuncNum = '',
      langCode = '',
    } = req.query
    const conditions = search ? { $text: { $search: `${search}` } } : {}

    const listImages = await imageService.getList({
      queryConditions: conditions,
      skip: +skip,
      limit: +limit,
      sort: {
        modifiedAt: -1,
        createdAt: -1,
        ...(search ? { score: { $meta: 'textScore' } } : {}),
      },
    })

    return res.render('ckeditor_browser', {
      images: listImages.data,
      search,
      CKEditor,
      CKEditorFuncNum,
      langCode,
      skip: +skip + (listImages.data?.length ?? 0),
    })
  }
}

export const imageViewController = new ImageViewController()
