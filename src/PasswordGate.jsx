import { useState } from 'react'
import { Button, TextField, View, Text, FormControl } from 'reshaped'
import { hashPassword, isUnlocked, setUnlocked, PASSWORD_HASH } from './auth.js'

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
    <View height="100vh" align="center" justify="center">
      <form onSubmit={handleSubmit}>
        <View gap={4} width="280px">
          <Text variant="featured-2">This page is private</Text>
          <FormControl hasError={error}>
            <FormControl.Label>Password</FormControl.Label>
            <TextField
              name="password"
              placeholder="Enter password"
              value={value}
              inputAttributes={{ type: 'password' }}
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
    </View>
  )
}
