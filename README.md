# @emqx/local-storage-encryption

Obfuscate key-value pairs in localStorage.

## installation

```bash
npm install @emqx/local-storage-encryption
```

### yarn

```bash
yarn add @emqx/local-storage-encryption
```

### pnpm

```bash
pnpm add @emqx/local-storage-encryption
```

## Motivation

This package is used to obfuscate key-value pairs in localStorage. **The purpose is
to avoid directly displaying sensitive information, not real encryption.** For example,
you have below key-value pairs in localStorage:

```js
{
  "username": "admin",
  "password": "123456"
}
```

Even though the localStorage can be [used carefully and correctly](https://snyk.io/blog/is-localstorage-safe-to-use/), the `username` and `password` are still exposed to the people.
This package can be used to obfuscate data like this.

## How to use

Below is an example to encrypt the username and password:

```js
import { encrypt, decrypt } from '@emqx/local-storage-encryption'

const keyToGetUserInfo = 'l4v1n'

// You need to provide a `provider` function that returns a `Promise<[string, any]>`.
// The first element of the tuple is the key to get the value from localStorage.
// The second element of the tuple is the value to be encrypted.
function userInfoProvider() {
  return Promise.resolve([
    keyToGetUserInfo,
    { username: 'admin', password: '123456' },
  ])
}

// Encrypt and set the encrypted data to localStorage.
encrypt({
  providers: [userInfoProvider],
})

// Decrypt the data when you need to use it.
decrypt(keyToGetUserInfo).then((userInfo) => {
  // { username: 'admin', password: '123456' }
  console.log(userInfo)
})

// Clear the encrypted data from localStorage.
clear(keyToGetUserInfo)
```

## API

### encrypt

`encrypt` is used to encrypt the data and set the encrypted data to localStorage.

It will return a `Promise` that resolves to the encrypted data.

The principle it uses is to encrypt two keys first with the `key` in the provider (provided key), one for the key to get the encrypted data from localStorage, and the other for the data to be encrypted.

Then it will set the encrypted keys and the encrypted value to localStorage.

Below is a table to show the relationship between the provided key, the encrypted keys, and the encrypted data in localStorage:

| Key          | Value                                          |
| ------------ | ---------------------------------------------- |
| provided key | encrypted keys: [item, secretKeyToDecryptData] |
| item         | encrypted data                                 |

```js
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
```

### decrypt

`decrypt` helps you easily decrypt the data you encrypted before. You can also decrypt
manually if you understand the encryption principle described in [#encrypt](#encrypt).

It will also return a `Promise` that resolves to the decrypted data.

```js
/**
 * Decrypts the data.
 *
 * @param {string} key
 * @returns {Promise<any>}
 */
```

### clear

`clear` is used to clear the encrypted data from localStorage.

## License

Under the Apache License, Version 2.0.
