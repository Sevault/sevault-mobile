import * as BackgroundFetch from 'expo-background-fetch'
import { useFonts } from 'expo-font'
import * as Notifications from 'expo-notifications'
import React, { useState } from 'react'
import * as ScreenCapture from 'expo-screen-capture'

import { COLORS } from '@/app/COLORS'

import {
  Poppins_500Medium,
  Poppins_600SemiBold
} from '@expo-google-fonts/poppins'

import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'

import {
  useDispatch
} from 'react-redux'

import {
  formatDollar,
  getAccounts,
  IAccounts,
  Networks
} from '@/app/utils'
import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension'

import {
  SYNC_BGL_BALANCE_BACKGROUND,
  SYNC_BNB_BALANCE_BACKGROUND,
  SYNC_BUSDT_BALANCE_BACKGROUND,
  SYNC_ETH_BALANCE_BACKGROUND,
  SYNC_USDT_BALANCE_BACKGROUND,
  syncAllBalances
} from '@/app/processes/balanceBackground'
import displayToast from '@/components/Toast'
import { updateBalancesUSD } from '@/features/wallet/walletSlice'
import { router, Stack, useNavigation, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { requestPushNotificationPermissions } from '@/app/processes/Notifications'

const WBGL_DAO_PRICE_API = 'https://api.diadata.org/v1/assetQuotation/Ethereum/0x2bA64EFB7A4Ec8983E22A49c81fa216AC33f383A'
const USDT_DAO_PRICE = 1
const ETH_DAO_PRICE_API = 'https://api.diadata.org/v1/assetQuotation/Ethereum/0x0000000000000000000000000000000000000000'
const BNB_DAO_PRICE_API = 'https://api.diadata.org/v1/assetQuotation/BinanceSmartChain/0x0000000000000000000000000000000000000000'
const BGL_COINMARKET_CAP_API = `https://3rdparty-apis.coinmarketcap.com/v1/cryptocurrency/widget?id=5667&convert_id=1,2781,2781`

interface IBNBPriceData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
}

const Home = () => {
  ScreenCapture.usePreventScreenCapture()

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold
  })

  const [refreshing, setRefreshing] = React.useState(true)
  const segments = useSegments()
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [balances, setBalances] = React.useState({
    bgl: 0,
    eth: 0,
    bnb: 0,
    usdtEthereum: 0,
    usdtBNB: 0,
    wbglBNB: 0,
    wbglEthereum: 0,
    bglUSD: 0,
    ethUSD: 0,
    bnbUSD: 0,
    wbglBNBUSD: 0,
    wbglEthereumUSD: 0
  })

  const [accounts, setAccounts] = useState({
    BNB: null,
    ETH: null,
    BGL: null
  })

  const [isLoading, setisLoading] = useState(false)
  const [totalBalance, setTotalBalance] = useState(0)
  const [offSet, setCurrentOffset] = useState(0)


  const [daoPrices, setDaoPrices] = React.useState({
    USDT: {
      price: formatDollar.format(USDT_DAO_PRICE),
      volume: '~$56.63B'
    },
    ETH: {
      price: formatDollar.format(3293.58),
      volume: '~$11.79B '
    },
    BGL: {
      price: formatDollar.format(0.055460),
      volume: '~$1.25M',
    },
    BNB: {
      price: formatDollar.format(581.76),
      volume: '~$1.58B'
    },
    WBGL: {
      price: formatDollar.format(0.068),
      volume: '$11,700'
    }
  })

  const [percentageD, setPercentageD] = useState({
    eth: "-0.7%",
    bgl: "-0.11%",
    bnb: '-0.6%',
    usdt: "0.00%",
    wbgl: '+0.24',
  })

  BackgroundFetch.registerTaskAsync(SYNC_BGL_BALANCE_BACKGROUND, {
    minimumInterval: 60 * 10,
    stopOnTerminate: false,
    startOnBoot: true,
  })


  BackgroundFetch.registerTaskAsync(SYNC_BNB_BALANCE_BACKGROUND, {
    minimumInterval: 60 * 15,
    stopOnTerminate: false,
    startOnBoot: true,
  })

  BackgroundFetch.registerTaskAsync(SYNC_ETH_BALANCE_BACKGROUND, {
    minimumInterval: 60 * 15,
    stopOnTerminate: false,
    startOnBoot: true,
  })


  BackgroundFetch.registerTaskAsync(SYNC_BUSDT_BALANCE_BACKGROUND, {
    minimumInterval: 60 * 10,
    stopOnTerminate: false,
    startOnBoot: true,
  })

  BackgroundFetch.registerTaskAsync(SYNC_USDT_BALANCE_BACKGROUND, {
    minimumInterval: 60 * 10,
    stopOnTerminate: false,
    startOnBoot: true,
  });

  React.useEffect(() => {
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => { });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { tx_id } = response.notification.request.content.data;

      if (tx_id) {
        // @ts-ignore
        navigation.navigate('/(tabs)/transaction-summary', response.notification.request.content.data);
      }
    });

    requestPushNotificationPermissions()
    syncAllBalances()
    setRefreshing(true)
    agreggateBalancesUSD()
    async function syncAccounts() {
      const bglAccounts = await getAccounts(Networks.Bitgesell)
      const bnbAccounts = await getAccounts(Networks.BNBSmartChain);
      const ethAccounts = await getAccounts(Networks.Ethereum);

      setAccounts((_accounts) => ({
        // @ts-ignore
        ..._accounts,
        BNB: bnbAccounts.accounts[0],
        ETH: ethAccounts.accounts[0],
        BGL: bglAccounts.accounts[0],
      }));
    };

    syncAccounts()
    async function fetchAssetDaoPrice() {

      try {

        const priceInfo = await fetch(WBGL_DAO_PRICE_API)
        const info = await priceInfo.json()

        setDaoPrices((_daoPrices) => {
          return {
            ..._daoPrices,
            WBGL: { price: formatDollar.format(info.Price), volume: _daoPrices.WBGL.volume }
          }
        })

        const bnbPriceInfo = await fetch(BNB_DAO_PRICE_API)
        const bnbinfo = await bnbPriceInfo.json()
        setDaoPrices((_daoPrices) => {
          return {
            ..._daoPrices,
            BNB: { price: formatDollar.format(bnbinfo.Price), volume: _daoPrices.BNB.volume }
          }
        })

        const ethPriceInfo = await fetch(ETH_DAO_PRICE_API)
        const ethinfo = await ethPriceInfo.json()
        setDaoPrices((_daoPrices) => {
          return {
            ..._daoPrices,
            ETH: {
              price: formatDollar.format(ethinfo.Price),
              volume: _daoPrices.ETH.volume
            }
          }
        })

        const bglPriceInfo = await fetch(BGL_COINMARKET_CAP_API)
        const bglInfo = await bglPriceInfo.json()

        setDaoPrices((_daoPrices) => {
          return {
            ..._daoPrices,
            BGL: {
              price: `$${bglInfo.data['5667'].quote['2781'].price.toFixed(4)}`,
              volume: _daoPrices.ETH.volume
            }
          }
        })
        setPercentageD((_percentageD) => {
          return {
            ..._percentageD,
            bgl: bglInfo.data['5667'].quote["2781"].percent_change_24h.toFixed(2) > 0 ? "+" + bglInfo.data['5667'].quote["2781"].percent_change_24h.toFixed(2) + "%" : bglInfo.data['5667'].quote["2781"].percent_change_24h.toFixed(2) + "%"
          }
        })
      } catch (error) {
        displayToast({ message: 'Refresh failed, please check network', type: 'info' })
      }
    }

    async function fetchPercentageChange24() {
      try {
        const [bnb, eth] = await Promise.all([fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=binancecoin'),
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum')
        ])

        const data = await bnb.json() as Array<IBNBPriceData>
        const bnbPriceInfor = data[0]
        const ethData = await eth.json()
        const ethPriceInfor = ethData[0]

        setPercentageD((_percentages) => {
          return {
            ..._percentages,
            eth: _setPriceChangePercentage(ethPriceInfor, 'ETH'),
            bnb: _setPriceChangePercentage(bnbPriceInfor, 'BNB')
          }
        })
      } catch (error) {
        displayToast({ message: 'Failed to fetch price info' + error, type: 'info' })
      }
    }

    function _setPriceChangePercentage(priceInfo: IBNBPriceData, asset: string) {
      if (priceInfo) {
        const priceChange = Number(priceInfo.price_change_24h).toFixed(2)
        const priceChangePercentage = priceChange < 0 ? priceInfo.price_change_percentage_24h.toFixed(2) + "%" : "+" + priceInfo.price_change_percentage_24h.toFixed(2) + "%"
        return priceChangePercentage
      }

      if (asset === 'ETH') {
        return percentageD.eth
      }

      if (asset === 'BNB') {
        return percentageD.bnb
      }

    }

    fetchPercentageChange24()
    // syncNetworkBalances()
    async function agreggateBalancesUSD() {
      let bglBalanceUSD = 0
      let bglBalance = 0

      let ethBalanceUSD = 0
      let ethBalance = 0
      let usdtBalance = 0
      let wbglBalanceERC20 = 0
      let wbglBalanceERC20USD = 0

      let bnbBalanceUSD = 0
      let bnbBalance = 0
      let wbglBep20Balance = 0
      let usdtBalanceBep20 = 0
      let wbglBep20BalanceUSD = 0


      const bglAccounts = await getAccounts(Networks.Bitgesell) as IAccounts
      const bnbAccounts = await getAccounts(Networks.BNBSmartChain) as IAccounts
      const ethAccounts = await getAccounts(Networks.Ethereum) as IAccounts

      bglAccounts.accounts.forEach(wallet => {
        bglBalanceUSD += wallet.balance.usd
        bglBalance += wallet.balance.balance
      })

      ethAccounts.accounts.forEach(wallet => {
        ethBalanceUSD += wallet.balance.usd
        ethBalance += wallet.balance.balance
        usdtBalance += wallet.assets.usdt
      })

      bnbAccounts.accounts.forEach(wallet => {
        bnbBalanceUSD += wallet.balance.usd
        bnbBalance += wallet.balance.balance
        usdtBalanceBep20 += wallet.assets.usdt
      })

      // add WBGL dollar conversion
      const totalBalanceUSD = (bglBalanceUSD + ethBalanceUSD + usdtBalance + bnbBalanceUSD + usdtBalanceBep20 + wbglBep20BalanceUSD + wbglBalanceERC20USD)
      setTotalBalance(totalBalanceUSD)

      const balanceUSD = {
        bgl: bglBalance,
        eth: ethBalance,
        bnb: bnbBalance,
        usdtEthereum: usdtBalance,
        usdtBNB: usdtBalanceBep20,
        wbglBNB: wbglBep20Balance,
        wbglEthereum: wbglBalanceERC20,
        bglUSD: bglBalanceUSD,
        ethUSD: ethBalanceUSD,
        bnbUSD: bnbBalanceUSD,
        wbglBNBUSD: wbglBep20Balance,
        wbglEthereumUSD: wbglBalanceERC20USD
      }
      setBalances(balanceUSD)
      dispatch(updateBalancesUSD(balanceUSD))

    }

    fetchAssetDaoPrice()
    setRefreshing(false)
    syncAccounts()
  }, [segments, offSet])


  const onRefresh = async () => {
    setRefreshing(true)
    syncAllBalances()
    async function fetchAssetDaoPrice() {
      try {

        const priceInfo = await fetch(WBGL_DAO_PRICE_API)
        const info = await priceInfo.json()

        setDaoPrices((_daoPrices) => {
          return {
            ..._daoPrices,
            WBGL: { price: formatDollar.format(info.Price), volume: _daoPrices.WBGL.volume }
          }
        })

        const bnbPriceInfo = await fetch(BNB_DAO_PRICE_API)
        const bnbinfo = await bnbPriceInfo.json()
        setDaoPrices((_daoPrices) => {
          return {
            ..._daoPrices,
            BNB: { price: formatDollar.format(bnbinfo.Price), volume: _daoPrices.BNB.volume }
          }
        })

        const ethPriceInfo = await fetch(ETH_DAO_PRICE_API)
        const ethinfo = await ethPriceInfo.json()
        setDaoPrices((_daoPrices) => {
          return {
            ..._daoPrices,
            ETH: {
              price: formatDollar.format(ethinfo.Price),
              volume: _daoPrices.ETH.volume
            }
          }
        })

        const bglPriceInfo = await fetch(BGL_COINMARKET_CAP_API)
        const bglInfo = await bglPriceInfo.json()

        setDaoPrices((_daoPrices) => {
          return {
            ..._daoPrices,
            BGL: {
              price: `$${bglInfo.data['5667'].quote['2781'].price.toFixed(4)}`,
              volume: _daoPrices.ETH.volume
            }
          }
        })
        setPercentageD((_percentageD) => {
          return {
            ..._percentageD,
            bgl: bglInfo.data['5667'].quote["2781"].percent_change_24h.toFixed(2) > 0 ? `+ ${bglInfo.data['5667'].quote["2781"].percent_change_24h.toFixed(2)}` + "%" : `${bglInfo.data['5667'].quote["2781"].percent_change_24h.toFixed(2)}` + "%"
          }
        })

        // bitgesell: coinmarketcap

      } catch (error) {
        displayToast({ message: 'Failed to refresh, please check network', type: 'info' })
      }
    }


    async function agreggateBalancesUSD() {
      let bglBalanceUSD = 0
      let bglBalance = 0

      let ethBalanceUSD = 0
      let ethBalance = 0
      let usdtBalance = 0
      let wbglBalanceERC20 = 0
      let wbglBalanceERC20USD = 0

      let bnbBalanceUSD = 0
      let bnbBalance = 0
      let wbglBep20Balance = 0
      let usdtBalanceBep20 = 0
      let wbglBep20BalanceUSD = 0

      try {
        const bglAccounts = await getAccounts(Networks.Bitgesell) as IAccounts
        const bnbAccounts = await getAccounts(Networks.BNBSmartChain) as IAccounts
        const ethAccounts = await getAccounts(Networks.Ethereum) as IAccounts
        bglAccounts.accounts.forEach(wallet => {
          bglBalanceUSD += wallet.balance.usd
          bglBalance += wallet.balance.balance
        })

        ethAccounts.accounts.forEach(wallet => {
          ethBalanceUSD += wallet.balance.usd
          ethBalance += wallet.balance.balance
          usdtBalance += wallet.assets.usdt
        })

        bnbAccounts.accounts.forEach(wallet => {
          bnbBalanceUSD += wallet.balance.usd
          bnbBalance += wallet.balance.balance
          usdtBalanceBep20 += wallet.assets.usdt
        })

        const totalBalanceUSD = (bglBalanceUSD + ethBalanceUSD + usdtBalance + bnbBalanceUSD + usdtBalanceBep20 + wbglBep20BalanceUSD + wbglBalanceERC20USD)
        setTotalBalance(totalBalanceUSD)

        const balance = {
          bgl: bglBalance,
          eth: ethBalance,
          bnb: bnbBalance,
          usdtEthereum: usdtBalance,
          usdtBNB: usdtBalanceBep20,
          wbglBNB: wbglBep20Balance,
          wbglEthereum: wbglBalanceERC20,
          bglUSD: bglBalanceUSD,
          ethUSD: ethBalanceUSD,
          bnbUSD: bnbBalanceUSD,
          wbglBNBUSD: wbglBep20Balance,
          wbglEthereumUSD: wbglBalanceERC20USD
        }

        dispatch(updateBalancesUSD(balance))
        setBalances(balance)
      } catch (error) {
        displayToast({ message: 'Failed to refresh, please check network', type: 'info' })
      }
    }

    fetchAssetDaoPrice()
    agreggateBalancesUSD()

    setRefreshing(false)
  }

  return (
    <>
      <StatusBar backgroundColor={COLORS.ACCENT} style="light" />
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.homeContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Text style={{ fontSize: actuatedNormalize(18), fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>
            Total Balance
          </Text>
          <Text style={{ fontSize: actuatedNormalize(15), fontWeight: '600', fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>
            {formatDollar.format(totalBalance)}
          </Text>
        </View>

        {/* Tiles  2 seperate rows*/}
        <View style={{ marginTop: actuatedNormalizeVertical(17) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* 1. */}
            <Pressable
              onPress={() => {
                router.push({
                  params: {
                    detail: true,
                    network: Networks.BNBSmartChain,
                    asset: 'BNB',
                    privateKey: accounts.BNB.privateKey,
                    address: accounts.BNB.address,
                    balance: accounts.BNB.balance.balance,
                    balanceUSD: accounts.BNB.balance.usd,
                    percentageD: percentageD.bnb
                  },
                  pathname: '/(tabs)/asset-info'
                })
              }}
              style={{
                padding: actuatedNormalize(13),
                width: actuatedNormalize(160),
                height: actuatedNormalizeVertical(160),
                borderRadius: actuatedNormalize(20),
                backgroundColor: COLORS.ACCENT
              }}>

              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.WHITE }}>BNB</Text>
                    <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>{daoPrices.BNB.price}</Text>
                  </View>
                  <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>
                    {percentageD.bnb}
                  </Text>
                </View>
                <View style={{ marginTop: actuatedNormalizeVertical(20), flexDirection: 'row', paddingBottom: actuatedNormalizeVertical(20), alignItems: 'center', justifyContent: 'space-around' }}>
                  <Image style={{ height: actuatedNormalize(35), width: actuatedNormalize(35), borderRadius: 17.5 }} source={require('@/assets/bnb-chain.png')} />
                  <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE, fontSize: actuatedNormalize(13) }}>BSC Chain</Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                router.push({
                  params: {
                    detail: true,
                    network: Networks.Ethereum,
                    asset: 'ETH',
                    privateKey: accounts.ETH.privateKey,
                    address: accounts.ETH.address,
                    balance: accounts.ETH.balance.balance,
                    balanceUSD: accounts.ETH.balance.usd,
                    percentageD: percentageD.eth
                  },
                  pathname: '/(tabs)/asset-info'
                })
              }}
              style={{
                padding: actuatedNormalize(13),
                width: actuatedNormalize(160),
                height: actuatedNormalizeVertical(160),
                borderRadius: actuatedNormalize(20),
                backgroundColor: '#454A75'
              }}>
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.WHITE }}>ETH</Text>
                    <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>{daoPrices.ETH.price}</Text>
                  </View>
                  <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>
                    {percentageD.eth}
                  </Text>
                </View>
                <View style={{ marginTop: actuatedNormalizeVertical(20), flexDirection: 'row', paddingBottom: actuatedNormalizeVertical(20), alignItems: 'center', justifyContent: 'space-around' }}>
                  <Image style={{ height: actuatedNormalize(35), width: actuatedNormalize(35), borderRadius: 17.5 }} source={require('@/assets/ethereum-network.png')} />
                  <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE, fontSize: actuatedNormalize(13) }}>Ethereum</Text>
                </View>
              </View>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: actuatedNormalizeVertical(16) }}>
            {/* 1. */}
            <Pressable
              onPress={() => {
                router.push({
                  params: {
                    detail: true,
                    network: Networks.Bitgesell,
                    asset: 'BGL',
                    privateKey: accounts.BGL.privateKey,
                    address: accounts.BGL.address,
                    balance: accounts.BGL.balance.balance,
                    balanceUSD: accounts.BGL.balance.usd,
                    percentageD: percentageD.bgl
                  },
                  pathname: '/(tabs)/asset-info'
                })
              }}

              style={{
                padding: actuatedNormalize(13),
                width: actuatedNormalize(160),
                height: actuatedNormalizeVertical(160),
                borderRadius: actuatedNormalize(20),
                backgroundColor: '#824FF4'
              }}>
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.WHITE }}>BGL</Text>
                    <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>{daoPrices.BGL.price}</Text>
                  </View>
                  <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>
                    {percentageD.bgl}
                  </Text>
                </View>
                <View style={{ marginTop: actuatedNormalizeVertical(20), flexDirection: 'row', paddingBottom: actuatedNormalizeVertical(20), alignItems: 'center', justifyContent: 'space-around' }}>
                  <Image style={{ height: actuatedNormalize(35), width: actuatedNormalize(35), borderRadius: 17.5 }} source={require('@/assets/bgl-network.png')} />
                  <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE, fontSize: actuatedNormalize(13) }}>Bitgesell</Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                router.push({
                  params: {
                    detail: true,
                    network: Networks.Ethereum,
                    asset: `USDT`,
                    privateKey: accounts.ETH.privateKey,
                    address: accounts.ETH.address,
                    balance: accounts.ETH.assets.usdt,
                    balanceUSD: accounts.ETH.assets.usdt,
                    percentageD: percentageD.usdt
                  },
                  pathname: '/(tabs)/asset-info'
                })
              }}

              style={{
                padding: actuatedNormalize(13),
                width: actuatedNormalize(160),
                height: actuatedNormalizeVertical(160),
                borderRadius: actuatedNormalize(20),
                backgroundColor: '#50AF95'
              }}>
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.WHITE }}>Tether</Text>
                    <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>{formatDollar.format(USDT_DAO_PRICE)}</Text>
                  </View>
                  <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}>
                    0.00%
                  </Text>
                </View>
                <View style={{ marginTop: actuatedNormalizeVertical(20), flexDirection: 'row', paddingBottom: actuatedNormalizeVertical(20), alignItems: 'center', justifyContent: 'space-around' }}>
                  <Image style={{ height: actuatedNormalize(35), width: actuatedNormalize(35), borderRadius: 17.5 }} source={require('@/assets/tether-sm.png')} />
                  <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE, fontSize: actuatedNormalize(13) }}>USDT</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Assets */}

        <View style={{
          marginTop: actuatedNormalizeVertical(10), width: '100%', paddingBottom: actuatedNormalizeVertical(80)
        }}>
          <Text style={{ fontSize: actuatedNormalize(18), fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }}>Assets</Text>

          {/* Bitgesell */}
          <Pressable
            onPress={() => {
              router.push({
                params: {
                  network: Networks.Bitgesell,
                  asset: 'BGL',
                  privateKey: accounts.BGL.privateKey,
                  address: accounts.BGL.address,
                  balance: accounts.BGL.balance.balance,
                  balanceUSD: accounts.BGL.balance.usd,
                  percentageD: percentageD.bgl
                },
                pathname: 'asset-info'
              })
            }}
            style={{ width: '100%', backgroundColor: '#F5F5F5', height: actuatedNormalize(85), borderRadius: actuatedNormalize(15), paddingTop: actuatedNormalizeVertical(20), padding: actuatedNormalize(28), flexDirection: 'row', justifyContent: 'space-between', marginBottom: actuatedNormalize(15) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ height: actuatedNormalizeVertical(60), marginRight: actuatedNormalize(14), width: actuatedNormalize(60), borderRadius: actuatedNormalize(30) }} source={require('@/assets/bgl-network.png')} />
              <View>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>Bitgesell</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{balances.bgl.toFixed(4)}BGL</Text>
              </View>
            </View>
            <View>
              <View>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>{formatDollar.format(balances.bglUSD)}</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{percentageD.bgl}</Text>
              </View>
            </View>
          </Pressable>

          {/* Ethereum */}
          <Pressable
            onPress={() => {
              router.push({
                params: {
                  network: Networks.Ethereum,
                  asset: 'ETH',
                  privateKey: accounts.ETH.privateKey,
                  address: accounts.ETH.address,
                  balance: accounts.ETH.balance.balance,
                  balanceUSD: accounts.ETH.balance.usd,
                  percentageD: percentageD.eth
                },
                pathname: 'asset-info'
              })
            }}
            style={{ width: '100%', backgroundColor: '#F5F5F5', height: actuatedNormalize(85), borderRadius: actuatedNormalize(15), paddingTop: actuatedNormalizeVertical(20), padding: actuatedNormalize(28), flexDirection: 'row', justifyContent: 'space-between', marginBottom: actuatedNormalize(15) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ height: actuatedNormalizeVertical(60), width: actuatedNormalize(60), marginRight: actuatedNormalize(14), borderRadius: actuatedNormalize(30) }} source={require('@/assets/ethereum-network.png')} />
              <View>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>Ethereum</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{balances.eth.toFixed(4)}ETH</Text>
              </View>
            </View>
            <View>
              <View>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>{formatDollar.format(balances.ethUSD)}</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{percentageD.eth}</Text>
              </View>
            </View>

          </Pressable>

          {/* BNB */}
          <Pressable
            onPress={() => {
              router.push({
                params: {
                  network: Networks.BNBSmartChain,
                  asset: 'BNB',
                  privateKey: accounts.BNB.privateKey,
                  address: accounts.BNB.address,
                  balance: accounts.BNB.balance.balance,
                  balanceUSD: accounts.BNB.balance.usd,
                  percentageD: percentageD.bnb
                },
                pathname: 'asset-info'
              })
            }}
            style={{ width: '100%', backgroundColor: '#F5F5F5', height: actuatedNormalize(85), borderRadius: actuatedNormalize(15), paddingTop: actuatedNormalizeVertical(20), padding: actuatedNormalize(28), flexDirection: 'row', justifyContent: 'space-between', marginBottom: actuatedNormalize(15) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ height: actuatedNormalize(60), width: actuatedNormalize(60), borderRadius: actuatedNormalize(30), marginRight: actuatedNormalize(14), }} source={require('@/assets/bnb-chain.png')} />
              <View>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>BNB Smart Chain</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{balances.bnb.toFixed(4)}BNB</Text>
              </View>
            </View>
            <View>
              <View>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>{formatDollar.format(balances.bnbUSD)}</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{percentageD.bnb}</Text>
              </View>
            </View>
          </Pressable>

          {/* USDT */}
          <Pressable
            onPress={() => {
              router.push({
                params: {
                  network: Networks.Ethereum,
                  asset: 'USDT',
                  privateKey: accounts.ETH.privateKey,
                  address: accounts.ETH.address,
                  balance: accounts.ETH.assets.usdt,
                  balanceUSD: accounts.ETH.assets.usdt,
                  percentageD: percentageD.usdt
                },
                pathname: 'asset-info'
              })
            }}
            style={{ width: '100%', backgroundColor: '#F5F5F5', height: actuatedNormalize(85), borderRadius: actuatedNormalize(15), paddingTop: actuatedNormalizeVertical(20), padding: actuatedNormalize(28), flexDirection: 'row', justifyContent: 'space-between', marginBottom: actuatedNormalize(15) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ height: actuatedNormalizeVertical(60), width: actuatedNormalize(60), marginRight: actuatedNormalize(14), borderRadius: actuatedNormalize(30) }} source={require('@/assets/tether-sm.png')} />
              <View>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>Tether(Ethereum)</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{balances.usdtEthereum.toFixed(2)}USDT</Text>
              </View>
            </View>
            <View>
              <View>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>{formatDollar.format(balances.usdtEthereum)}</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{percentageD.usdt}</Text>
              </View>
            </View>
          </Pressable>

          {/* USDT BNB */}
          <Pressable
            onPress={() => {
              router.push({
                params: {
                  network: Networks.BNBSmartChain,
                  asset: 'USDT',
                  privateKey: accounts.BNB.privateKey,
                  address: accounts.BNB.address,
                  balance: accounts.BNB.assets.usdt,
                  balanceUSD: accounts.BNB.assets.usdt,
                  percentageD: percentageD.usdt
                },
                pathname: 'asset-info'
              })
            }}
            style={{ width: '100%', backgroundColor: '#F5F5F5', height: actuatedNormalize(85), borderRadius: actuatedNormalize(15), paddingTop: actuatedNormalizeVertical(20), padding: actuatedNormalize(28), flexDirection: 'row', justifyContent: 'space-between', marginBottom: actuatedNormalize(15) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ height: actuatedNormalizeVertical(60), width: actuatedNormalize(60), marginRight: actuatedNormalize(14), borderRadius: actuatedNormalize(30) }} source={require('@/assets/tether-sm.png')} />
              <View>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>Tether(BNBChain)</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{balances.usdtBNB.toFixed(2)}USDT</Text>
              </View>
            </View>
            <View>
              <View>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: COLORS.BLACK_ACCENT }}>{formatDollar.format(balances.usdtBNB.toFixed(2))}</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '', color: '#888888' }}>{percentageD.usdt}</Text>
              </View>
            </View>
          </Pressable>

        </View>

      </ScrollView>
    </>
  )

}

export default Home

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: COLORS.WHITE,
    padding: actuatedNormalize(20),
  }
})