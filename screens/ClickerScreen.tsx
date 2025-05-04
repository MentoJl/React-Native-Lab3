import React, { useState, useContext, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  FlatList,
} from 'react-native'
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
  Directions,
} from 'react-native-gesture-handler'
import { tasks as TASKS } from '../data/tasks'
import { ScoreContext } from '../context/ScoreContext'
import { runOnJS } from 'react-native-reanimated'

const ClickerScreen: React.FC = () => {
  const { score, setScore, tasks, setTaskCompleted } = useContext(ScoreContext)
  const [doubleCount, setDoubleCount] = useState(0)
  const [panDone, setPanDone] = useState(false)
  const [pinchDone, setPinchDone] = useState(false)

  const pulseScale = useRef(new Animated.Value(1)).current
  const pinchScale = useRef(new Animated.Value(1)).current
  const lastTap = useRef<number>(0)

  const pulse = () => {
    Animated.sequence([ 
      Animated.timing(pulseScale, {
        toValue: 1.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleScoreUpdate = (points: number) => {
    setScore(prev => {
      const s = prev + points
      if (s >= 10 && !tasks['1']) setTaskCompleted('1')
      if (s >= 100 && !tasks['8']) setTaskCompleted('8')
      return s
    })
  }

  const handlePressIn = () => {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      setDoubleCount(prev => {
        const nc = prev + 1
        if (nc >= 5 && !tasks['2']) setTaskCompleted('2')
        return nc
      })
      handleScoreUpdate(2)
    } else {
      handleScoreUpdate(1)
    }
    lastTap.current = now
    pulse()
  }

  const handleLongPress = () => {
    if (!tasks['3']) setTaskCompleted('3')
    handleScoreUpdate(5)
    pulse()
  }

  const handlePan = () => {
    if (!panDone) {
      setTaskCompleted('4')
      setPanDone(true)
    }
  }

  const handlePinch = () => {
    if (!pinchDone) {
      setTaskCompleted('7')
      setPinchDone(true)
    }
  }

  const handleSwipeRight = () => {
    if (!tasks['5']) setTaskCompleted('5')
  }

  const handleSwipeLeft = () => {
    if (!tasks['6']) setTaskCompleted('6')
  }

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onEnd(() => runOnJS(handlePan)())

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      pinchScale.setValue(e.scale)
      if (Math.abs(e.scale - 1) > 0.2 && !pinchDone) {
        runOnJS(handlePinch)()
      }
    })
    .onEnd(() => {
      Animated.spring(pinchScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start()
    })

  const swipeRightGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => runOnJS(handleSwipeRight)())

  const swipeLeftGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => runOnJS(handleSwipeLeft)())

  const gesture = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    swipeRightGesture,
    swipeLeftGesture
  )

  const combinedScale = Animated.multiply(pulseScale, pinchScale)

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>
          <Pressable
            onPressIn={handlePressIn}
            onLongPress={handleLongPress}
            style={styles.pressable}
          >
            <Animated.View style={[styles.touchableArea, { transform: [{ scale: combinedScale }] }]}>
              <Text style={styles.score}>{score}</Text>
            </Animated.View>
          </Pressable>

          <View style={styles.tasksContainer}>
            <FlatList
              data={TASKS}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={[styles.taskCard, tasks[item.id] && styles.completedTask]}>
                  <Text style={styles.taskText}>{item.title}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

export default ClickerScreen

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f4f4f9' },
  pressable: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  touchableArea: {
    backgroundColor: '#2575FC',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  score: { fontSize: 48, color: '#fff', fontWeight: 'bold' },
  tasksContainer: { marginTop: 40, width: '100%', paddingHorizontal: 20 },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  taskText: { fontSize: 16, color: '#333' },
  completedTask: {
    backgroundColor: '#d3ffd3',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
})
