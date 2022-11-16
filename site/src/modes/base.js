export class BaseMode {
  log (method, ...args) {
    console.debug(this.constructor.name, method, args)
  }
}
