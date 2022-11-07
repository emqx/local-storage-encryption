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

Even though the localStorage can be [used carefully and correctly](https://snyk.io/blog/is-localstorage-safe-to-use/), the `username` and `password` are still exposed to the users.
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
```
