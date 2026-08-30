import { describe, it, expect, beforeEach } from 'vitest'
import { hashPassword, isUnlocked, setUnlocked, UNLOCK_STORAGE_KEY } from './auth.js'

describe('hashPassword', () => {
  it('returns a deterministic 64-character hex SHA-256 digest', async () => {
    const hash = await hashPassword('correct horse battery staple')
    expect(hash).toBe(
      'c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a'
    )
  })

  it('produces different hashes for different input', async () => {
    const a = await hashPassword('alpha')
    const b = await hashPassword('beta')
    expect(a).not.toBe(b)
  })
})

describe('unlock state', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('is not unlocked by default', () => {
    expect(isUnlocked()).toBe(false)
  })

  it('reports unlocked after setUnlocked is called', () => {
    setUnlocked()
    expect(isUnlocked()).toBe(true)
    expect(sessionStorage.getItem(UNLOCK_STORAGE_KEY)).toBe('true')
  })
})
