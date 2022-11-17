# @emqx/local-storage-encryption

[![CI](https://github.com/emqx/local-storage-encryption/actions/workflows/ci.yaml/badge.svg)](https://github.com/emqx/local-storage-encryption/actions/workflows/ci.yaml)

Obfuscate key-value pairs in localStorage.

## installation

> Starting with `v1.0.0`, you will need to provide your own encryption methods to use this package.
>
> For example:
>
> `npm install crypto-js`
>
> For more details, please refer to:
>
> - [How to use](#how-to-use)
> - [encryption](#encryption)

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
import { encrypt, decrypt, encryption } from '@emqx/local-storage-encryption'
// Suppose you will use `crypto-js/aes` to encrypt data.
import AES from 'crypto-js/aes'
import encUtf8 from 'crypto-js/enc-utf8'

const encryptionMethods = {
  encrypt: (message, key) => AES.encrypt(message, key).toString(),
  decrypt: (data, key) => AES.decrypt(data, key).toString(encUtf8),
}

encryption.use = encryptionMethods

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

### storage

Although this package is used to obfuscate data in localStorage, it can also be used to obfuscate data in other backends
that implement the `Storage` interface of the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).
For example, you can use `sessionStorage` instead of `localStorage`:

```js
import { storage } from '@emqx/local-storage-encryption'

storage.backend = window.sessionStorage

// Then all other APIs will use sessionStorage instead of localStorage.
```

### encryption

Before `v1.0.0`, this package used `crypto-js/aes` to encrypt data. But now you need to provide your own encryption methods to use this package. Below is an example:

```js
import { encryption } from '@emqx/local-storage-encryption'
import AES from 'crypto-js/aes'
import encUtf8 from 'crypto-js/enc-utf8'

const encryptionMethods = {
  encrypt: (message, key) => AES.encrypt(message, key).toString(),
  decrypt: (data, key) => AES.decrypt(data, key).toString(encUtf8),
}

encryption.use = encryptionMethods

// Then encrypt.
```

The `encryption.use` receives an object with two fields: `encrypt` and `decrypt`.
The `encrypt` function is used to encrypt the `message` with the `key`. The `decrypt` function is used to decrypt the `data` with the `key`.
Both of them should return a string.

Please note that `encryption.use` is only compatible with the **Cipher Algorithms** format. For example, `crypto-js/aes` is a Cipher Algorithm, but `crypto-js/md5` is not.
Assuming you want to use `crypto-js/md5` as the encryption method, you need to be compatible with the API yourself.

You can refer to <https://cryptojs.gitbook.io/docs/#ciphers> to see how to define your encryption methods.

This change increases the flexibility of the package, facilitates its integration with existing systems and reduces the final package size.

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
