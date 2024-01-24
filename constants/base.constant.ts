export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTH_INFO: 203,
  REDIRECT: 301,
  FOUND: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNSUPPORTED_MEDIA_TYPE: 415,
  SERVER_ERROR: 500,
}

export const MESSAGES = {
  GET_SUCCEED: 'get_succeed',
  CREATED_SUCCEED: 'created_model_succeed',
  CREATED_SUCCEED_MANY: 'created_many_model_succeed',
  DELETE_SUCCEED: 'delete_succeed',
  UPDATE_SUCCEED: 'update_succeed',
  CANNOT_GET_DATA: 'cannot_get_data',
  CANNOT_CREATE: 'cannot_create_new_model',
  CANNOT_DELETE: 'cannot_deleted',
  INSERT_SUCCEED: 'insert_succeed',
  PERMISSION_DENIED: 'permission_denied',
  UNAUTHORIZED: 'unauthorized',
  INVALID_TOKEN: 'invalid_token',
  CANNOT_UPLOAD_IMAGE: 'cannot_upload_image',
  INVALID_QUERY: 'invalid_query',
  UNAUTHORIZED_ADMIN: 'unauthorized_admin',
  DATA_NOT_FOUND: 'data_not_found',
  FIELD_MANDATORY: 'field_mandatory',
}

export const LANGUAGES = { vi: 'vi', en: 'en' }
export const LANGUAGES_REVERSE = { vi: 'en', en: 'vi' }
export const LANGUAGES_REVERSE_STRING = { vi: '-en', en: '-vi' }
export const LANGUAGE_ENUM = [LANGUAGES.vi, LANGUAGES.en]

export const APP_PREFIX = process.env.APP_PREFIX
export const APP_ENV = process.env.APP_ENV ?? 'dev'
export const API_CMS_URL = process.env.API_CMS_URL ?? 'api-cms'
export const API_URL = process.env.API_URL ?? 'api'
export const CMS_URL = process.env.CMS_URL ?? 'cms'
export const CACHE_DB_PREFIX = 'cache_database'

export const IMAGES_STORAGE_ORIGINAL = 'public/uploads/images/original_images/'
export const IMAGES_STORAGE_LARGE = 'public/uploads/images/large_images'
export const IMAGES_STORAGE_MEDIUM = 'public/uploads/images/medium_images'
export const IMAGES_STORAGE_SMALL = 'public/uploads/images/small_images'

export const IMAGES_STORAGE_ORIGINAL_SRC = '/uploads/images/original_images/'
export const IMAGES_STORAGE_LARGE_SRC = '/uploads/images/large_images'
export const IMAGES_STORAGE_MEDIUM_SRC = '/uploads/images/medium_images'
export const IMAGES_STORAGE_SMALL_SRC = '/uploads/images/small_images'

export const PUBLIC_STORAGE_DIR = 'public'
export const VIDEOS_STORAGE_DIR = 'public/uploads/videos'
export const DOCS_STORAGE_DIR = 'public/uploads/documents'
export const IMAGES_STORAGE_DIR = 'public/uploads/images/'
export const IMAGES_STORAGE_DIR_SRC = '/uploads/images/'
export const VIDEOS_STORAGE_DIR_SRC = '/uploads/videos/'
export const DOCS_STORAGE_DIR_SRC = '/uploads/documents/'
export const MAX_VIDEO_SIZE_MB = 50
export const MAX_IMAGE_SIZE_MB = 500

export const IMAGES_STORAGE_USER_SRC = '/uploads/user_images/'
export const IMAGES_STORAGE_USER_DIR = 'public/user_images'

export const DEPARTMENTS = [
  {
    viName: 'Tất cả',
    enName: 'All',
    code: 'ALL',
  },
  {
    viName: 'Khoa Khoa học Máy tính',
    enName: 'Department of Computer Science',
    code: 'CS',
  },
  {
    viName: 'Khoa Vật lý',
    enName: 'Department of Physics',
    code: 'PHY',
  },
  {
    viName: 'Khoa Hóa học',
    enName: 'Department of Chemistry',
    code: 'CHE',
  },
  {
    viName: 'Khoa Ngôn ngữ học',
    enName: 'Department of Linguistics',
    code: 'LIN',
  },
  {
    viName: 'Khoa Kinh doanh',
    enName: 'Department of Business Administration',
    code: 'BUS',
  },
  {
    viName: 'Khoa Y học',
    enName: 'Department of Medicine',
    code: 'MED',
  },
  {
    viName: 'Khoa Nghệ thuật và Thiết kế',
    enName: 'Department of Arts and Design',
    code: 'ART',
  },
  {
    viName: 'Khoa Xã hội học',
    enName: 'Department of Sociology',
    code: 'SOC',
  },
  {
    viName: 'Khoa Toán học',
    enName: 'Department of Mathematics',
    code: 'MAT',
  },
  {
    viName: 'Khoa Kỹ thuật Điện tử',
    enName: 'Department of Electrical Engineering',
    code: 'EE',
  },
]
