export default class LocalStorage {
  static ls = window.localStorage

  static get(key) {
    return LocalStorage.ls.getItem(key)
  }

  static getObj(key) {
    return JSON.parse(LocalStorage.get(key) ?? '{}')
  }

  static set(key, val) {
    LocalStorage.ls.setItem(key, val)
  }

  static setObj(key, obj) {
    LocalStorage.set(key, JSON.stringify(obj))
  }

  static remove(key) {
    LocalStorage.ls.removeItem(key)
  }
}
