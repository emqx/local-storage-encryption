import { expect } from 'vitest'
import { vi } from 'vitest'
import { describe, it } from 'vitest'
import { encrypt, decrypt } from './main'

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
})
