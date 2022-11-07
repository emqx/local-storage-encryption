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
})
