import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { COLORS } from '@/app/COLORS'
import {
  actuatedNormalize,
  actuatedNormalizeVertical
} from '@/components/Dimension'
import {
  router,
  useLocalSearchParams,
  useNavigation
} from 'expo-router'
import React, { useState } from 'react'
import {
  Image,
  ScrollView
} from 'react-native'

import { Asset, usePriceHistory } from '@/app/hooks/usePriceHistory'
import { formatDollar } from '@/app/utils'
import DrawerBackIcon from '@/components/DrawerBackIcon'
import displayToast from '@/components/Toast'
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts
} from '@expo-google-fonts/poppins'
import { StatusBar } from 'expo-status-bar'

const assetSummary = {
  ETH: `Ether (ETH) is the native cryptocurrency of the Ethereum blockchain. It serves as the fuel for the network, enabling users to pay for transactions and run decentralized applications (dApps).
  
  Launched in 2015 by co-founder Vitalik Buterin and the Ethereum Foundation, ETH was created to facilitate smart contracts and programmable money. 
  
  The name "Ether" refers to a concept from classical physics, representing the medium through which energy is transferred in the Ethereum ecosystem. Ethereum has a capacity of 120.2M ETH`,
  BNB: `BNB (BNB) is the native cryptocurrency of the Binance blockchain and serves as the fuel for transactions, fees, and participation within the Binance ecosystem. 
  
  It was created by Changpeng Zhao (CZ) in 2017 as part of Binance, one of the world's largest cryptocurrency exchanges. 
  
  BNB's name is derived from "Binance Coin," representing its connection to the platform. BNB has become popular due to its utility in various applications, such as paying for trading fees and accessing token sales on Binance Launchpad. Ethereum has a capacity of 120.2M ETH 153.86M BNB.`,
  WBGL: "WBGL is an ERC20 token WrappedBGL (WBGL) and deployed on Ethereum, BNB, Arbitrum L2 chains",
  BGL: `Bitgesell is a Bitcoin-derived digital currency.

  Bitgesell is a BTC derived coin but with some enhanced features.
  
  It is: -100% SegWit implemented -10x smaller block weight -A halving each year, so 4x faster in scarcity than BTC -Uses a more efficient Keccak hashing algorithm -Burns 90% of transaction fees -It aims to be faster, more efficient, and most of all more scarce than it's big brother bitcoin.
  
  Bitgesell has a circulating supply of 16,157,930 BGL coins and a max. supply of 21,000,000 BGL coins.
  
  Bitgesell has no company behind it and is mostly community-driven.`,

  USDT: `Tether USD (USDT) is a stablecoin pegged to the value of the US dollar. 
  
  It was founded in 2014 by Tether Limited, a company initially associated with the cryptocurrency exchange Bitfinex. Its purpose is to provide users with a digital asset that maintains a stable value, while also enabling seamless and fast transactions on the blockchain. 
  
  Tether's value is backed by reserves held by the company, though the transparency and auditability of these reserves have been subject to scrutiny.`
}

const assetMarketCaps = {
  ETH: "$390.37B",
  BNB: " $84.29B",
  WBGL: "",
  BGL: "$1.20M",
  USDT: "$114.28B"
}

const assetGithubProject = {
  ETH: '',
  BNB: '',
  WBGL: '',
  BGL: '',
  USDT: ''
}

const WBGL_DAO_PRICE_API = 'https://api.diadata.org/v1/assetQuotation/Ethereum/0x2bA64EFB7A4Ec8983E22A49c81fa216AC33f383A'
const USDT_DAO_PRICE = 1
const ETH_DAO_PRICE_API = 'https://api.diadata.org/v1/assetQuotation/Ethereum/0x0000000000000000000000000000000000000000'
const BNB_DAO_PRICE_API = 'https://api.diadata.org/v1/assetQuotation/BinanceSmartChain/0x0000000000000000000000000000000000000000'
const BGL_COINMARKET_CAP_API = `https://3rdparty-apis.coinmarketcap.com/v1/cryptocurrency/widget?id=5667&convert_id=1,2781,2781`

interface IGraphPoint {
  value: number
  date: Date
}

interface IHeaderLeft {
  handleClick: () => void
}

const HeaderLeft = ({ handleClick }: IHeaderLeft) => {
  const [clicked, setclicked] = useState(false)
  return (
    <Pressable
      onPress={() => setclicked(clicked => !clicked)}
      onPressOut={() => setclicked(clicked => !clicked)}
      style={{ marginLeft: actuatedNormalize(19), backgroundColor: clicked ? COLORS.ACCENT : COLORS.WHITE }}>
      <DrawerBackIcon onpress={handleClick} />
    </Pressable>
  )
}

const AssetInfo = () => {

  const {
    detail,
    network,
    asset,
    privateKey,
    address,
    balance,
    balanceUSD,
    percentageD
  } = useLocalSearchParams()
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_400Regular
  })
  const { priceHistory, min, max } = usePriceHistory(asset as Asset)
  // @ts-ignore

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
      volume: '~$15.0k',
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

  const [priceChangeDataSet, setPriceChangeDataSet] = React.useState({
    USDT: {
      dataset: null,
    },
    BNB: {
      dataset: null
    },
    ETH: {
      dataset: null
    },

    BGL: {
      dataset: null
    },
    WBGL: {
      dataset: null
    }

  })

  React.useEffect(() => {

    navigation.setOptions({
      headerTitle: asset,
      headerTitleAlign: 'center',
      headerLeft: () => <HeaderLeft handleClick={() => router.back()} />

    });

    async function fetchAssetDaoPrice() {
      try {
        switch (asset) {

          case 'WBGL':
            const priceInfo = await fetch(WBGL_DAO_PRICE_API)
            const info = await priceInfo.json()

            setDaoPrices((_daoPrices) => {
              return {
                ..._daoPrices,
                WBGL: { price: formatDollar.format(info.Price), volume: _daoPrices.WBGL.volume }
              }
            })
          case 'BNB':
            const bnbPriceInfo = await fetch(BNB_DAO_PRICE_API)
            const bnbinfo = await bnbPriceInfo.json()
            setDaoPrices((_daoPrices) => {
              return {
                ..._daoPrices,
                BNB: { price: formatDollar.format(bnbinfo.Price), volume: _daoPrices.BNB.volume }
              }
            })
          case 'ETH':
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
          case 'BGL':

            const bglPriceInfo = await fetch(BGL_COINMARKET_CAP_API)
            const bglInfo = await bglPriceInfo.json()
            setDaoPrices((_daoPrices) => {
              return {
                ..._daoPrices,
                BGL: {
                  price: `$${bglInfo.data['5667'].quote['2781'].price.toFixed(4)}`,
                  volume: _daoPrices.BGL.volume
                }
              }
            })
            break;
        }
      } catch (error) {
        displayToast({ message: 'Check internet connection', type: 'error' })
      }
    }
    fetchAssetDaoPrice()
  }, [asset, navigation])

  const graphColor = {
    ETH: '#50AF95',
    BNB: '#FFE2AC',
    USDT: '#50AF95'
  }


  return (
    <>
      <StatusBar backgroundColor={COLORS.ACCENT} style='light' />
      <ScrollView style={styles.assetInfoContainer}>
        <View style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: actuatedNormalize(13) }}>
            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', fontSize: actuatedNormalize(20) }}>{daoPrices[asset].price}</Text>
          </View>
          {percentageD ? (<View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: actuatedNormalize(13) }}>
            <View style={{ backgroundColor: '#F5F5F5', width: actuatedNormalize(80), height: actuatedNormalize(30), justifyContent: 'center', flexDirection: 'row', alignItems: 'center', borderRadius: actuatedNormalize(10) }}>
              <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', fontSize: actuatedNormalize(12), color: '#888888' }}>({percentageD})</Text>
            </View>
          </View>) : null}

          {asset === 'BGL' ? null : null
            // @TODO: neat graphs
          }
          <View>
            <View style={{ width: '100%', backgroundColor: '#F5F5F5', height: actuatedNormalizeVertical(40), marginTop: actuatedNormalizeVertical(14), borderRadius: actuatedNormalize(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Text style={{ color: '#888888', marginRight: actuatedNormalize(20) }}>Daily Vol</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }}>{daoPrices[asset].volume}</Text>
              </View>
              <Text>|</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#888888', marginRight: actuatedNormalize(20) }}>Market cap</Text>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_500Medium' : '' }}>~{assetMarketCaps[asset]}</Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: asset === 'BGL' ? actuatedNormalizeVertical(50) : actuatedNormalizeVertical(25) }}>

            <Pressable
              onPress={() => {
                router.push({
                  params: {
                    asset,
                    address,
                    privateKey,
                    balance,
                    network,
                    balanceUSD
                  },
                  pathname: '/(tabs)/send'
                })
              }}
              style={{
                height: actuatedNormalize(50),
                width: '100%',
                backgroundColor: COLORS.ACCENT,
                borderRadius: actuatedNormalize(11),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center'
              }}
            >
              <Text
                style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}
              >Send {asset}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                router.push({
                  params: {
                    asset,
                    address,
                    privateKey,
                    balance,
                    network
                  },
                  pathname: '/(tabs)/receive'
                })
              }}
              style={{
                marginTop: actuatedNormalize(15),
                height: actuatedNormalize(50),
                width: '100%',
                backgroundColor: COLORS.BLACK_ACCENT,
                borderRadius: actuatedNormalize(11),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center'
              }}
            >
              <Text
                style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '', color: COLORS.WHITE }}
              >Receive {asset}
              </Text>
            </Pressable>

          </View>

          <View style={{ marginTop: 50 }}>
            <Text style={{ fontFamily: fontsLoaded ? 'Poppins_600SemiBold' : '' }}>About {asset}</Text>
            <View>
              <Text style={{ fontFamily: fontsLoaded ? 'Poppins_400Regular' : '' }}>
                {assetSummary[asset]}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: actuatedNormalize(45), marginBottom: actuatedNormalizeVertical(142) }}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>

              <Text style={{ fontFamily: fontsLoaded ? 'Poppins_400Regular' : '', paddingRight: actuatedNormalize(4) }}>Github</Text>
              <Image style={{ height: actuatedNormalize(16), width: actuatedNormalize(16) }} source={require('@/assets/link.jpg')} />

            </Pressable>
            {asset == 'BGL' ?
              (<Pressable

                style={{ flexDirection: 'row', alignItems: 'center', marginTop: actuatedNormalizeVertical(25) }}>
                <Text style={{ fontFamily: fontsLoaded ? 'Poppins_400Regular' : '', paddingRight: actuatedNormalize(4) }}>Discord</Text>
                <Image style={{ height: actuatedNormalize(16), width: actuatedNormalize(16) }} source={require('@/assets/discord.png')} />

              </Pressable>
              ) : null}
          </View>

        </View>
      </ScrollView>
    </>
  )
}

export default AssetInfo

const styles = StyleSheet.create({
  assetInfoContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingLeft: actuatedNormalize(20),
    paddingRight: actuatedNormalize(20)
  },

  graphContainer: {
    // backgroundColor: '#AAAAAA',
    height: actuatedNormalize(335),
    borderRadius: actuatedNormalize(30)
  },
  graph: {
    alignSelf: 'center',
    width: '100%',
    aspectRatio: 1.4,
    marginVertical: 20,
  },
})