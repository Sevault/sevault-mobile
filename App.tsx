import WelcomeSplash from '@/app/WelcomeSplash';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function initApp() {
      try {
        new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.warn(error)
      } finally {
        setAppIsReady(true)
      }
    }

    initApp()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }

  }, [appIsReady])

  if (!appIsReady) return null


  return (
    <WelcomeSplash onLayout={onLayoutRootView} />
  )
  // <WelcomeWalkThrough/>
  // <OnboardingStepTwo/>
  // <OnboardingStepThree/>
  // <CreateNewWallet/>
  // <ImportExistingWallet/>
  // <Home/>
  // );

}
