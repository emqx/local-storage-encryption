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
  static set backend(storage: Storage)
}

export const storage: LocalStorage

interface EncryptionMethods {
  encrypt: (message: string, key: string) => string
  decrypt: (data: string, key: string) => string
}

declare class Encryption {
  static set use(encryption: EncryptionMethods)
}

export const encryption: Encryption

type ProviderFN = () => Promise<[string, unknown]>

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
