export const UNLOCK_STORAGE_KEY = 'noirab_hw_unlocked'

export async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function isUnlocked() {
  return sessionStorage.getItem(UNLOCK_STORAGE_KEY) === 'true'
}

export function setUnlocked() {
  sessionStorage.setItem(UNLOCK_STORAGE_KEY, 'true')
}
