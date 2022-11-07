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
