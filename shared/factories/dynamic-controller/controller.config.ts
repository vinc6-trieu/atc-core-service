import { PAGE_TYPE_KEYS } from '../../../constants/page-type.constant'
import { newsEventsController } from '../../../controllers/api/news-events.controller'

const controllerConfig: { [key: string]: any } = {
  [PAGE_TYPE_KEYS.NEWS_EVENTS]: newsEventsController,
}

export default controllerConfig
