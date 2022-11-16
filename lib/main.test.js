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

import { expect } from 'vitest'
import { describe, it, vi } from 'vitest'
import { storage, encryption, encrypt, decrypt, clear } from './main'
import LS from './localStorage'
import AES from 'crypto-js/aes'
import encUtf8 from 'crypto-js/enc-utf8'

encryption.use = {
  encrypt: (message, key) => AES.encrypt(message, key).toString(),
  decrypt: (data, key) => AES.decrypt(data, key).toString(encUtf8),
}

vi.mock('./localStorage')

describe('Encrypt and decrypt', () => {
  it('should encrypt and decrypt data correctly', async () => {
    function testProvider() {
      return Promise.resolve(['abc', 'def'])
    }

    await encrypt({
      providers: [testProvider],
    })

    expect(await decrypt('abc')).toBe('def')
  })

  it('should encrypt and decrypt sample user info correctly', async () => {
    const keyToGetUserInfo = 'l4v1n'
    const userInfo = { username: 'admin', password: '123456' }

    function userInfoProvider() {
      return Promise.resolve([keyToGetUserInfo, userInfo])
    }

    await encrypt({
      providers: [userInfoProvider],
    })

    expect(await decrypt(keyToGetUserInfo)).toEqual(userInfo)
  })

  it('when error occurs', async () => {
    function errorProvider() {
      return Promise.reject(new Error('error'))
    }

    try {
      await encrypt({
        providers: [errorProvider],
      })
    } catch (e) {
      expect(e.toString()).toMatch('error')
    }
  })
})

describe('Clear', () => {
  it('should clear all data', async () => {
    function testProvider() {
      return Promise.resolve(['abc', 'def'])
    }

    await encrypt({
      providers: [testProvider],
    })

    expect(LS.get('abc')).not.toBeNull()

    clear('abc')

    expect(LS.get('abc')).toBeUndefined()
  })
})

describe('With sessionStorage', () => {
  it('should encrypt and decrypt data correctly', async () => {
    storage.backend = {
      name: 'session',
    }

    expect(LS.name).toBe('session')

    function testProvider() {
      return Promise.resolve(['abc', 'def'])
    }

    await encrypt({
      providers: [testProvider],
    })

    expect(await decrypt('abc')).toBe('def')
  })
})
