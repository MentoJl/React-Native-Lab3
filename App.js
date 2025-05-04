// App.tsx
import React from 'react'
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import Navigation from './navigation'
import { ScoreProvider } from './context/ScoreContext'

const App = () => (
  <ScoreProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  </ScoreProvider>
)

export default App
