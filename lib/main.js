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

import AES from 'crypto-js/aes'
import encUtf8 from 'crypto-js/enc-utf8'
import LS from './localStorage'

function genRandomKey() {
  return (+new Date()).toString(36).slice(-5)
}

/**
 * A function that provides a fixed key and data.
 *
 * @callback providerFN
 * @return {Promise<[string, *]>}
 */

/**
 * Result represents the result of encryption, includes
 * the secret key and the encrypted data.
 *
 * @typedef {object} Result
 * @prop {string} key
 * @prop {string} data
 */

/**
 * Encrypts data and stores it in localStorage.
 *
 * @param {object} options
 * @param {providerFN[]} options.providers
 * @returns {Promise<Result[]>}
 */
export function encrypt(options) {
  return Promise.all(
    options.providers.map(async (provider) => {
      try {
        const [key, data] = await provider()

        const item = genRandomKey()
        const secretKeyToDecryptData = genRandomKey()

        const encryptedKeys = AES.encrypt(
          JSON.stringify([item, secretKeyToDecryptData]),
          key
        ).toString()

        LS.set(key, encryptedKeys)

        const encryptedData = AES.encrypt(
          JSON.stringify(data),
          secretKeyToDecryptData
        ).toString()

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
  const encryptedKeys = LS.get(key)

  if (!encryptedKeys) {
    throw new Error(`No data found by ${key}`)
  }

  const [item, secretKeyToDecryptData] = JSON.parse(
    AES.decrypt(encryptedKeys, key).toString(encUtf8)
  )

  const encryptedData = LS.get(item)

  if (!encryptedData) {
    throw new Error(`No data found by ${item}`)
  }

  return JSON.parse(
    AES.decrypt(encryptedData, secretKeyToDecryptData).toString(encUtf8)
  )
}

/**
 * Clears the data.
 *
 * @param {string} key
 */
export function clear(key) {
  const encryptedKeys = LS.get(key)

  if (!encryptedKeys) {
    throw new Error(`No data found by ${key}`)
  }

  const [item] = JSON.parse(AES.decrypt(encryptedKeys, key).toString(encUtf8))

  LS.remove(key)
  LS.remove(item)
}
