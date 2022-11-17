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

import LS from './localStorage'

export const storage = LS

function genRandomKey() {
  return (+new Date()).toString(36).slice(-5)
}

class Encryption {
  static encryption

  static set use(encryption) {
    this.encryption = encryption
  }

  static encrypt(message, key) {
    return this.encryption.encrypt(message, key)
  }

  static decrypt(data, key) {
    return this.encryption.decrypt(data, key)
  }
}

export const encryption = Encryption

function hasEncryption() {
  return encryption.encryption
}
const noEncryptionMessage = 'No encryption methods provided'

/**
 * A function that provides a fixed key and data.
 *
 * @callback providerFN
 * @return {Promise<[string, *]>}
 */

/**
 * EncryptResult represents the result of encryption, includes
 * the secret key and the encrypted data.
 *
 * @typedef {object} EncryptResult
 * @prop {string} key
 * @prop {string} data
 */

/**
 * Encrypts data and stores it in localStorage.
 *
 * @param {object} options
 * @param {providerFN[]} options.providers
 * @returns {Promise<EncryptResult[]>}
 */
export function encrypt(options) {
  if (!hasEncryption()) {
    throw new Error(noEncryptionMessage)
  }

  return Promise.all(
    options.providers.map(async (provider) => {
      try {
        const [key, data] = await provider()

        const item = genRandomKey()
        const secretKeyToDecryptData = genRandomKey()

        const encryptedKeys = Encryption.encrypt(
          JSON.stringify([item, secretKeyToDecryptData]),
          key
        )

        LS.set(key, encryptedKeys)

        const encryptedData = Encryption.encrypt(
          JSON.stringify(data),
          secretKeyToDecryptData
        )

        LS.set(item, encryptedData)

        return {
          key: secretKeyToDecryptData,
          data: encryptedData,
        }
      } catch (e) {
        throw e
      }
    })
  )
}

/**
 * Decrypts the data.
 *
 * @param {string} key
 */
export async function decrypt(key) {
  if (!hasEncryption()) {
    throw new Error(noEncryptionMessage)
  }

  const encryptedKeys = LS.get(key)

  if (!encryptedKeys) {
    throw new Error(`No data found by ${key}`)
  }

  const [item, secretKeyToDecryptData] = JSON.parse(
    Encryption.decrypt(encryptedKeys, key)
  )

  const encryptedData = LS.get(item)

  if (!encryptedData) {
    throw new Error(`No data found by ${item}`)
  }

  return JSON.parse(Encryption.decrypt(encryptedData, secretKeyToDecryptData))
}

/**
 * Clears the data.
 *
 * @param {string} key
 */
export function clear(key) {
  if (!hasEncryption()) {
    throw new Error(noEncryptionMessage)
  }

  const encryptedKeys = LS.get(key)

  if (!encryptedKeys) {
    throw new Error(`No data found by ${key}`)
  }

  const [item] = JSON.parse(Encryption.decrypt(encryptedKeys, key))

  LS.remove(key)
  LS.remove(item)
}
