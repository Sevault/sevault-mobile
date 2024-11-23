import { COLORS } from '@/app/COLORS'
import { actuatedNormalize } from '@/components/Dimension';
import DrawerIcon from '@/components/DrawerIcon';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import MoreIcon from '@/components/MoreIcon';
import { store } from '@/features/store';
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import { DrawerActions } from '@react-navigation/native';

import { router, Tabs, useGlobalSearchParams, useLocalSearchParams, useNavigation, useSegments } from 'expo-router';
import React, { useState } from 'react';
import { Share, View } from 'react-native';
import { Provider } from 'react-redux';
import { EXPLORERS, formatBlockExplorerLink } from './transaction-summary';
import displayToast from '@/components/Toast';
import SettingsIcon from '@/components/SettingsIcon';
import { copyToClipboard, Networks } from '@/app/utils';

interface IMoreMenuProps {
  visible: boolean
  hideMenu: () => void
}

function MoreMenu({
  visible,
  hideMenu
}: IMoreMenuProps) {

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Menu
        visible={visible}
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={() => {
          hideMenu()
          router.push('/(drawer)/about-us')
        }}>About Us</MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => {
          router.push('/(drawer)/help-and-support')
        }}>Help & Support</MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => {
          router.replace('/open-wallet')
        }}>Log Out</MenuItem>
        <MenuDivider />

      </Menu>
    </View>
  );
}


interface IOptionsMenuProps {
  visible: boolean
  hideMenu: () => void
  onShare?: () => void
  asset?: string
  tx_id?: string
  detail?: boolean
  network?: Networks
  privateKey?: string
  address?: string
  balance?: number
  balanceUSD?: number
  percentageD?: number
}

// home
function OptionsMenu({
  visible,
  hideMenu,
  onShare
}: IOptionsMenuProps) {

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Menu
        visible={visible}
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={() => {
          onShare()
          hideMenu()
        }}>Share</MenuItem>
        <MenuDivider />
        <MenuDivider />
      </Menu>
    </View>
  );
}

// receive
function ReceiveOptionsMenu({
  visible,
  hideMenu,
  address
}: IOptionsMenuProps) {

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Menu
        visible={visible}
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={() => {
          copyToClipboard(address).then(() => displayToast({ message: `Copied!`, type: 'info' }))
          hideMenu()
        }}>Copy Address</MenuItem>
        <MenuDivider />
        <MenuDivider />
      </Menu>
    </View>
  );
}

// wallet
function WalletOptionsMenu({
  visible,
  hideMenu,
  onShare
}: IOptionsMenuProps) {

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Menu
        visible={visible}
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={() => {
          router.push('/(tabs)/settings')
          hideMenu()
        }}>Settings</MenuItem>
        <MenuDivider />
        <MenuDivider />
      </Menu>
    </View>
  );
}

// asset-info
function SendOptionsMenu({
  visible,
  hideMenu,
  tx_id,
  detail,
  network,
  asset,
  privateKey,
  address,
  balance,
  balanceUSD,
  percentageD,
  onShare
}: IOptionsMenuProps) {

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Menu
        visible={visible}
        onRequestClose={hideMenu}
      >
        <MenuItem onPress={() => {
          router.push({
            params: {
              network,
              asset,
              privateKey,
              address,
              balance,
              balanceUSD,
              percentageD,
            },
            pathname: 'wallet'
          })
          hideMenu()
        }}>
          {`View in Wallet`}
        </MenuItem>
        <MenuDivider />

        <MenuItem onPress={() => {
          router.push({
            params: {
              network,
              asset,
              privateKey,
              address,
              balance,
              balanceUSD,
              percentageD,
            },
            pathname: 'transaction-history'
          })
          hideMenu()
        }}>
          {`View History`}
        </MenuItem>
        <MenuDivider />
      </Menu>
    </View>
  );
}

export default function TabLayout() {
  const navigation = useNavigation()
  const [contextMenuVisible, setcontextMenuVisible] = useState(false)
  const [optionsMenuVisible, setOptionsMenuVisible] = useState(false)
  const [walletMenuVisible, setWalletMenuVisible] = useState(false)
  const [sendOptionsMenuVisible, setsendOptionsMenuVisible] = useState(false)
  const [receieveOptons, setReceiveOptionsMenuVisible] = useState(false)

  const globalParams = useGlobalSearchParams()
  const segments = useSegments()
  const toHide = segments.includes('home') || segments.includes('wallet') || segments.includes('history') || segments.includes('settings') || segments.includes('transaction-history')

  const {
    tx_id,
    detail,
    network,
    asset,
    privateKey,
    address,
    balance,
    balanceUSD,
    percentageD
  } = globalParams

  const onShare = async () => {
    const url = formatBlockExplorerLink(network as Networks) + tx_id
    try {
      const result = await Share.share({
        message:
          `Successfully transacted ${asset}! Check on explorer: ${url}`,
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // displayToast({ message: `Sucesfully Shared transaction hash`, type: 'info' })
        } else {
          // displayToast({ message: `Sucesfully Shared transaction hash`, type: 'info' })
        }
      } else if (result.action === Share.dismissedAction) {
        // displayToast({ message: 'Canceled', type: 'info' })
      }
    } catch (error: any) {
      displayToast({ message: `Failed to share ${error}`, type: 'error' })
    }
  }

  return (
    <Provider store={store}>

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.ACCENT,
          tabBarInactiveTintColor: COLORS.BLACK_ACCENT,
          headerTitle: '',
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarStyle: {
            display: toHide ? "flex" : "none"
          }
        }}>

        <Tabs.Screen
          name="home"
          options={{
            headerShown: true,
            title: 'Home',
            tabBarIcon: ({ color }) => <AntDesign size={28} name="home" color={color} />,
            headerLeft: props => (<View style={{ marginLeft: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}><DrawerIcon onpress={() => navigation.dispatch(DrawerActions.openDrawer())} /></View>),
            headerRight: props => (<View style={{ marginRight: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}>
              <MoreIcon onpress={() => setcontextMenuVisible(_visible => !_visible)} />
              <MoreMenu
                hideMenu={() => {
                  setcontextMenuVisible((visible) => !visible)
                }}
                visible={contextMenuVisible} />
            </View>),

          }}
        />

        <Tabs.Screen
          name="wallet"
          options={{
            headerShown: true,
            headerLeft: props => (<View style={{ marginLeft: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}><DrawerIcon onpress={() => navigation.dispatch(DrawerActions.openDrawer())} /></View>),
            headerRight: props => (<View style={{ marginRight: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}>
              <SettingsIcon onpress={() => setWalletMenuVisible(v => !v)} />
              <WalletOptionsMenu
                onShare={onShare}
                hideMenu={() => {
                  setWalletMenuVisible((v) => !v)
                }}
                visible={walletMenuVisible} />
            </View>),
            headerTitle: 'Wallet',
            headerTitleAlign: 'center',
            title: 'Wallet',
            tabBarIcon: ({ color }) => <AntDesign size={28} name="wallet" color={color} />,
          }}
        />

        <Tabs.Screen
          name="report-a-problem"
          options={{
            href: null,
            headerShown: true,
            headerLeft: props => (<View style={{ marginLeft: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}><DrawerIcon onpress={() => navigation.dispatch(DrawerActions.openDrawer())} /></View>),
            headerTitle: 'Wallet',
            headerTitleAlign: 'center',
            title: 'Wallet',
          }}
        />

        <Tabs.Screen
          name="help-and-support"
          options={{
            href: null,
            headerShown: true,
          }}
        />

        <Tabs.Screen
          name="about-us"
          options={{
            href: null,
            headerShown: true,
          }}
        />

        <Tabs.Screen
          name="transaction-history"
          options={{
            headerShown: true,
            headerTitle: 'Transaction History',
            headerTitleAlign: 'center',
            title: 'History',
            headerLeft: props => (<View style={{ marginLeft: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}><DrawerIcon onpress={() => navigation.dispatch(DrawerActions.openDrawer())} /></View>),

            tabBarIcon: ({ color }) => <Feather size={28} name="list" color={color} />,
          }}
        />
        <Tabs.Screen
          name="transaction"
          options={{
            href: null,
            headerTitle: 'Transaction Summary',
            headerShown: true,
            title: 'Settings',
          }}
        />

        <Tabs.Screen
          name="transaction-summary"
          options={{
            href: null,
            headerShown: true,
            title: 'History',
            headerRight: props => (<View style={{ marginRight: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}>
              <MoreIcon onpress={() => setOptionsMenuVisible(_oVisible => !_oVisible)} />
              <OptionsMenu
                onShare={onShare}
                hideMenu={() => {
                  setOptionsMenuVisible((oVisible) => !oVisible)
                }}
                visible={optionsMenuVisible} />
            </View>),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            headerTitle: 'Settings',
            headerTitleAlign: 'center',
            tabBarHideOnKeyboard: true,
            headerShown: true,
            title: 'Settings',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="settings-outline" color={color} />,
            headerLeft: props => (<View style={{ marginLeft: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}><DrawerIcon onpress={() => navigation.dispatch(DrawerActions.openDrawer())} /></View>),
          }}
        />

        <Tabs.Screen
          name="asset-info"
          options={{
            href: null,
            headerShown: true,
            title: 'Settings',
            headerRight: props => (<View style={{ marginRight: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}>
              <MoreIcon onpress={() => setsendOptionsMenuVisible(open => !open)} />
              <SendOptionsMenu
                tx_id={tx_id}
                detail={detail}
                network={network}
                asset={asset}
                privateKey={privateKey}
                address={address}
                balance={balance}
                balanceUSD={balanceUSD}
                percentageD={percentageD}
                hideMenu={() => {
                  setsendOptionsMenuVisible((open) => !open)
                }}
                visible={sendOptionsMenuVisible} />
            </View>),
            tabBarIcon: ({ color }) => <Ionicons size={28} name="settings-outline" color={color} />,
          }}
        />
        {/* use modal/popup presentation for thes child routes for a cleaner flow */}
        <Tabs.Screen
          name="send"
          options={{
            href: null,
            tabBarHideOnKeyboard: true,
            headerShown: true,
            title: 'Settings',
          }}
        />

        <Tabs.Screen
          name="wallet-settings"
          options={{
            href: null,
            tabBarHideOnKeyboard: true,
            headerShown: true,
            title: 'Wallet-settings',
          }}
        />

        <Tabs.Screen
          name="security"
          options={{
            href: null,
            tabBarHideOnKeyboard: true,
            headerShown: true,
            title: 'Wallet-settings',
          }}
        />

        <Tabs.Screen
          name="privacy-policy"
          options={{
            href: null,
            tabBarHideOnKeyboard: true,
            headerShown: true,
            title: 'Wallet-settings',
          }}
        />

        <Tabs.Screen
          name="wbgl-bridge"
          options={{
            href: null,
            headerShown: false,
            title: 'Settings',
          }}
        />

        <Tabs.Screen
          name="receive"
          options={{
            href: null,
            headerShown: true,
            title: 'Settings',
            headerRight: props => (<View style={{ marginRight: actuatedNormalize(19), alignItems: 'center', justifyContent: 'center' }}>
              <MoreIcon onpress={() => setReceiveOptionsMenuVisible(ropen => !ropen)} />
              <ReceiveOptionsMenu
                address={address}
                hideMenu={() => {
                  setReceiveOptionsMenuVisible((ropen) => !ropen)
                }}
                visible={receieveOptons} />
            </View>),
          }}
        />

        <Tabs.Screen

          name="view-seed"

          options={{
            href: null,
            headerShown: true,
            title: 'View Seed/Private Key',
          }}
        />

      </Tabs>
    </Provider>
  );
}
