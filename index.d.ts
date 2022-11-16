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

declare class LocalStorage {
  static ls: Storage

  static set backend(storage: Storage)
  static get(key: string): string | null
  static getObj(key: string): unknown
  static set(key: string, value: string): void
  static setObj(key: string, value: any): void
  static remove(key: string): void
}

export const storage: LocalStorage

type ProviderFN = <T = unknown>() => Promise<[string, T]>

interface EncryptOptions {
  providers: ProviderFN[]
}

interface EncryptResult {
  key: string
  data: string
}

export function encrypt(options: EncryptOptions): Promise<EncryptResult[]>
export function decrypt<T = unknown>(key: string): Promise<T>
export function clear(key: string): void
