export default class LocalStorage {
  static ls = {}

  static get(key) {
    return LocalStorage.ls[key]
  }

  static getObj(key) {
    return JSON.parse(LocalStorage.get(key) ?? '{}')
  }

  static set(key, val) {
    LocalStorage.ls[key] = val
  }

  static setObj(key, obj) {
    LocalStorage.set(key, JSON.stringify(obj))
  }

  static remove(key) {
    delete ls[key]
  }
}
