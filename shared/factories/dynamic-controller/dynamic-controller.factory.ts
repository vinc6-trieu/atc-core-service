import controllerConfig from './controller.config'

export class ControllerFactory {
  static createController(pageType: string) {
    return controllerConfig[pageType]
  }
}
