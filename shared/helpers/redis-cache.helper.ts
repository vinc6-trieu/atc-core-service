import { APP_ENV, CACHE_DB_PREFIX } from '../../constants/base.constant'

export const cacheDbKeyBuilder = (modelName: string, key: string) => {
  return `${APP_ENV}:${CACHE_DB_PREFIX}:${modelName}:${key}`
}
