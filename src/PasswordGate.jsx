import { useState } from 'react'
import { Button, TextField, View, Text, FormControl, Card } from 'reshaped'
import { hashPassword, isUnlocked, setUnlocked, PASSWORD_HASH } from './auth.js'
import logoUrl from './assets/logo.svg'

export default function PasswordGate({ children }) {
  const [unlocked, setUnlockedState] = useState(isUnlocked())
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return children

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const hash = await hashPassword(value)
      if (hash === PASSWORD_HASH) {
        setUnlocked()
        setUnlockedState(true)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    }
  }

  return (
    <View
      height="100vh"
      align="center"
      justify="center"
      position="relative"
      attributes={{ style: { overflow: 'hidden' } }}
    >
      <div className="ambient-blob ambient-blob-primary" aria-hidden="true" />
      <div className="ambient-blob ambient-blob-accent" aria-hidden="true" />
      <View gap={6} align="center" width="340px" position="relative">
        <img src={logoUrl} width="56" height="56" alt="noirab" />
        <Card padding={8} className="glow-primary">
          <form onSubmit={handleSubmit}>
            <View gap={4}>
              <Text variant="featured-2" align="center">
                This page is private
              </Text>
              <FormControl hasError={error}>
                <FormControl.Label>Password</FormControl.Label>
                <TextField
                  name="password"
                  placeholder="Enter password"
                  value={value}
                  className="password-gate-field"
                  inputAttributes={{
                    type: 'password',
                    autoComplete: 'current-password',
                    autoFocus: true,
                    'aria-invalid': error,
                  }}
                  onChange={({ value }) => {
                    setValue(value)
                    setError(false)
                  }}
                />
                <FormControl.Error>Incorrect password</FormControl.Error>
              </FormControl>
              <Button color="primary" type="submit">
                Unlock
              </Button>
            </View>
          </form>
        </Card>
      </View>
    </View>
  )
}
