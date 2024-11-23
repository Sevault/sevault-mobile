import AboutUsSN from '@/components/AboutUsSN';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import { actuatedNormalize, actuatedNormalizeVertical } from '@/components/Dimension';
import DrawerIcon from '@/components/DrawerIcon';
import HelpAndSupportSN from '@/components/HelpAndSupportSN';
import { store } from '@/features/store';
import { Poppins_500Medium, useFonts } from '@expo-google-fonts/poppins';
import { DrawerActions } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { COLORS } from '@/app/COLORS';
import BugIconSN from '@/components/BugIconSN';
import DrawerBackIcon from '@/components/DrawerBackIcon';
import HomeIcon from '@/components/HomeIconSN';
import {
  StyleSheet,
  View
} from 'react-native';
import { Provider } from 'react-redux';

export default function Layout() {
  // Todo: style this to the figma style by overriding the default design: (follow with the video)
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
  })

  const navigation = useNavigation()
  return (
    <Provider store={store}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          title: '',
          headerLeft: props => (<View style={{ marginLeft: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}><DrawerIcon onpress={() => navigation.dispatch(DrawerActions.openDrawer())} /></View>),
          drawerHideStatusBarOnOpen: false,
          drawerActiveBackgroundColor: 'rgba(204, 204, 204, 0.5)',
          drawerInactiveBackgroundColor: COLORS.WHITEOO1,
          drawerActiveTintColor: COLORS.BLACK,
          drawerLabelStyle: {
            marginLeft: -20,
            fontSize: 14,
            fontFamily: fontsLoaded ? 'Poppins_500Medium' : ''
          },
          drawerItemStyle: {
            height: actuatedNormalizeVertical(65),
            margin: actuatedNormalize(11),
            justifyContent: 'center',
            borderRadius: actuatedNormalize(7),
            paddingStart: actuatedNormalize(15),
            marginBottom: actuatedNormalizeVertical(15)
          },
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
          },

        }}
      >
        <Drawer.Screen
          name="(tabs)"

          options={{
            headerTitleAlign: 'center',
            headerShown: false,
            drawerLabel: 'Home',
            title: '',
            drawerIcon: ({ size, color }) => (
              <IconContainer>
                <HomeIcon />
              </IconContainer>
            )
          }}
        />

        <Drawer.Screen
          name="help-and-support"

          options={{
            // // override to provide a back functionality with headerleft- navigate appropriately
            // header: (props) => <View><Text>Hello</Text></View>,
            headerLeft: props => (<View style={{ marginLeft: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}>
              <DrawerBackIcon onpress={() => router.back()} />
            </View>),

            headerTitleAlign: 'center',
            drawerLabel: 'Help and Support',
            title: 'Help and Support',
            drawerIcon: ({ size, color }) => (
              <IconContainer>
                <HelpAndSupportSN />
              </IconContainer>
            )
          }}
        />

        <Drawer.Screen
          name="report-a-problem"
          options={{
            headerLeft: props => (<View style={{ marginLeft: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}>
              <DrawerBackIcon onpress={() => router.back()} />
            </View>),
            headerTitleAlign: 'center',
            drawerLabel: 'Report A Problem',
            title: 'Report A Problem',
            drawerIcon: ({ size, color }) => (
              <IconContainer>
                <BugIconSN />
              </IconContainer>
            )
          }}
        />

        <Drawer.Screen
          name="about-us"
          options={{
            headerLeft: props => (<View style={{ marginLeft: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}>
              <DrawerBackIcon onpress={() => router.back()} />
            </View>),
            headerTitleAlign: 'center',
            drawerLabel: 'About Us',
            title: 'About Us',
            drawerIcon: ({ size, color }) => (
              <IconContainer>
                <AboutUsSN />
              </IconContainer>
            )
          }}
        />

      </Drawer>
    </Provider >
  );
}

function IconContainer({ children }: any) {
  return (
    <View style={{ backgroundColor: COLORS.WHITE, height: 40, width: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  customHeader: {
    backgroundColor: '#9A6DFF',
    minHeight: actuatedNormalizeVertical(55),
    minWidth: actuatedNormalize(355)
  },
  menuButton: {
    marginTop: actuatedNormalizeVertical(16),
    marginLeft: actuatedNormalize(27),
    marginBottom: actuatedNormalize(7)
  }
})