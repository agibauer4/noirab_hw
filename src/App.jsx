import { View, Text } from 'reshaped'
import PasswordGate from './PasswordGate.jsx'
import ThemePreview from './ThemePreview.jsx'

function App() {
  return (
    <PasswordGate>
      {/* THROWAWAY: theme preview, swap back to the stub below when done looking */}
      <ThemePreview />
      {/* <View height="100vh" align="center" justify="center" gap={4}>
        <Text variant="featured-2">noirab_hw</Text>
      </View> */}
    </PasswordGate>
  )
}

export default App
