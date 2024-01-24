import { PAGE_TYPE_KEYS } from "../../../constants/page-type.constant"
import { newsController } from "../../../controllers/api/news.controller"

const controllerConfig: { [key: string]: any } = {
  [PAGE_TYPE_KEYS.NEWS]: newsController,
}

export default controllerConfig
