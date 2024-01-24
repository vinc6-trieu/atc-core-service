import { Request } from 'express'
import multer, { FileFilterCallback, Multer } from 'multer'
import { v4 as uuidv4 } from 'uuid'

import {
  DOCS_STORAGE_DIR,
  IMAGES_STORAGE_ORIGINAL,
  IMAGES_STORAGE_USER_DIR,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE_MB,
  PUBLIC_STORAGE_DIR,
  VIDEOS_STORAGE_DIR,
} from '../constants/base.constant'

interface MulterRequest extends Request {
  imageError: boolean
  docError: boolean
  videoError: boolean
  file: any
  files: any
}

function get_file_extension(fileOriginalName: string): string {
  return fileOriginalName.split('.').pop() ?? ''
}

function cleanString(input: string): string {
  let output = ''
  for (let i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127 || (input.charCodeAt(i) >= 160 && input.charCodeAt(i) <= 255)) {
      output += input.charAt(i)
    }
  }
  return output
}

function removeVietnameseTones(str: string): string {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
  str = str.replace(/\u02C6|\u0306|\u031B/g, '')
  str = str.replace(/ + /g, ' ')
  str = str.trim()
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  )
  str = cleanString(str.replace(/\x00/g, ''))
  str = str.replace(/\s+/g, '-')
  return str.toLocaleLowerCase()
}

// MEDIA FILTER FUNCTIONS
function image_file_filter(
  req: MulterRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  if (!/image/.exec(file.mimetype)) {
    req.imageError = true
    return cb(null, false)
  }
  cb(null, true)
}

function video_file_filter(
  req: MulterRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  if (!/video/.exec(file.mimetype)) {
    req.videoError = true
    return cb(null, false)
  }
  cb(null, true)
}

function document_file_filter(
  req: MulterRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  if (!RegExp(/msword|officedocument|pdf/).exec(file.mimetype)) {
    req.docError = true
    return cb(null, false)
  }
  cb(null, true)
}

function txt_file_filter(
  req: MulterRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  if (!RegExp(/text.plain/).exec(file.mimetype)) {
    req.docError = true
    return cb(null, false)
  }
  cb(null, true)
}

function randomString(len: number): string {
  const p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return [...Array(len)].reduce((a) => a + p[~~(Math.random() * p.length)], '')
}

// FILE FILTER FUNCTIONS

// Storages
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_STORAGE_ORIGINAL)
  },

  filename: (req, file, cb) => {
    const fileExtensions = get_file_extension(file.originalname)
    const fileRawName = file.originalname.split('.' + fileExtensions)[0]
    const cleanFileName = decodeURIComponent(removeVietnameseTones(fileRawName))
    const filename = `${cleanFileName}-${Math.round(Math.random() * 10000)}.${fileExtensions}`
    cb(null, filename)
  },
})

const imageStorageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_STORAGE_USER_DIR)
  },

  filename: (req, file, cb) => {
    const fileExtensions = get_file_extension(file.originalname)
    const fileRawName = file.originalname.split('.' + fileExtensions)[0]
    const cleanFileName = decodeURIComponent(removeVietnameseTones(fileRawName))
    const filename = `${cleanFileName}-${randomString(16)}.${fileExtensions}`
    cb(null, filename)
  },
})

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEOS_STORAGE_DIR)
  },

  filename: (req, file, cb) => {
    const fileExtensions = get_file_extension(file.originalname)
    cb(null, uuidv4() + '.' + fileExtensions)
  },
})

const documentStore = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DOCS_STORAGE_DIR)
  },

  filename: (req, file, cb) => {
    const fileExtensions = get_file_extension(file.originalname)
    const fileRawName = file.originalname.split('.' + fileExtensions)[0]
    const filename =
      removeVietnameseTones(fileRawName) +
      '-' +
      Math.round(Math.random() * 10000) +
      '.' +
      fileExtensions

    cb(null, `${filename}`)
  },
})

const sitemapStore = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PUBLIC_STORAGE_DIR)
  },

  filename: (req, file, cb) => {
    const filename = 'sitemap.xml'
    cb(null, `${filename}`)
  },
})

const robotTxtStore = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PUBLIC_STORAGE_DIR)
  },

  filename: (req, file, cb) => {
    const filename = 'robots.txt'
    cb(null, `${filename}`)
  },
})

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: image_file_filter,
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1000 * 1024 },
})

const uploadImageUser: Multer = multer({
  storage: imageStorageUser,
  fileFilter: image_file_filter,
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1000 * 1024 },
})

const uploadVideo: Multer = multer({
  storage: videoStorage,
  fileFilter: video_file_filter,
  limits: { fileSize: MAX_VIDEO_SIZE_MB * 1000 * 1024 },
})

const uploadDocument: Multer = multer({
  storage: documentStore,
  fileFilter: document_file_filter,
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1000 * 1024 },
})

const uploadSitemap: Multer = multer({
  storage: sitemapStore,
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1000 * 1024 },
})

const uploadRobotTxt: Multer = multer({
  storage: robotTxtStore,
  fileFilter: txt_file_filter,
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1000 * 1024 },
})

export { uploadImage, uploadImageUser, uploadVideo, uploadDocument, uploadSitemap, uploadRobotTxt }
