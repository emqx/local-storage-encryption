// Copyright 2022 EMQ Technologies Co., Ltd. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Reuse https://github.com/chaos-mesh/chaos-mesh/blob/master/ui/app/src/lib/localStorage.ts, cause I'm also the author of it. :)
export default class LocalStorage {
  static ls = window.localStorage

  static set backend(storage) {
    if (storage) {
      this.ls = storage
    }
  }

  static get(key) {
    return this.ls.getItem(key)
  }

  static getObj(key) {
    return JSON.parse(this.get(key) ?? '{}')
  }

  static set(key, val) {
    this.ls.setItem(key, val)
  }

  static setObj(key, obj) {
    this.set(key, JSON.stringify(obj))
  }

  static remove(key) {
    this.ls.removeItem(key)
  }
}
