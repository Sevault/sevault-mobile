import * as Clipboard from 'expo-clipboard'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { getItem } from './storage/getItem';
import {
  BITGESELL_ACCOUNTS,
  CURRENT_ACCOUNT,
  INSTALL_STATE,
  PASSWORD,
  WALLET
} from './storage/keys';

// @TODO: move to types file
export interface IWallet {
  mnemonic?: string
  address: string
  index: number
  balance: {
    usd: number
    balance: number,
  },
  assets: {
    usdt: number,
    wbgl: number
  },
  imported: boolean // toggle on import
  active: boolean // toggle value on select
  privateKey?: string
}

export interface IAccounts {
  accounts: Array<IWallet>
  mnemonic: string
}

export enum Networks {
  Bitgesell = 'Bitgesell',
  BNBSmartChain = 'BNBSmartChain',
  Ethereum = 'Ethereum'
}

export interface BGLAccount {
  network: Networks
  index: number
  balance: number,
  privateKey: string,
  address: string
}

type Address = string


/// START PASSWORD LOGIC
const encryptPassword = async (
  password: string
): Promise<string | undefined> => {
  try {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    )

    return digest
  } catch (error) {
    return
  }
}

export const savePassword = async (
  password: string
): Promise<void> => {
  try {
    const digest = await encryptPassword(password)
    await AsyncStorage.setItem(PASSWORD, digest as string, () => {
      return digest
    })

  } catch (error) {
    // @ts-ignore
    throw new Error(error?.message);
  }
}

export const verifyPassword = async (
  password: string
): Promise<boolean | undefined> => {
  try {
    const digest = await encryptPassword(password)
    const storedDigest = await AsyncStorage.getItem(PASSWORD)
    return digest === storedDigest
  } catch (error) {
    // @ts-ignore
    throw new Error(error?.message);
  }
} /// END PASSWORD LOGIC

/// START WALLET LOGIC
export const saveWallet = async (
  wallet: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(WALLET, wallet)
  } catch (error) {
    // @ts-ignore
    throw new Error(error?.message);
  }
}

export const loadWalletObject = async (): Promise<IWallet | null | undefined> => {
  try {
    const wallet = await getItem(WALLET)
    if (wallet) return wallet as IWallet
    else return null
  } catch (error) {
    return
  }
}

export const setCurrentAccountInStorage = async (
  account: IWallet
) => {
  const accountStr = JSON.stringify(account)
  try {
    await AsyncStorage.setItem(CURRENT_ACCOUNT, accountStr)
  } catch (error) {
    // @ts-ignore
    throw new Error(error?.message);
  }
}

export const saveAccounts = async (
  network: Networks | string,
  accounts: IAccounts
) => {
  const accountsStr = JSON.stringify(accounts)
  try {
    await AsyncStorage.setItem(network, accountsStr)
  } catch (error) {
    // @ts-ignore
    throw new Error(error?.message);
  }
}

export const getAccounts = async (
  network: Networks,
) => {

  try {
    const accounts = await getItem(network)
    if (accounts) return accounts
    else return null
  } catch (error) {
    // @ts-ignore
    throw new Error(error?.message);
  }
}

export const getCurrentAccount = async (): Promise<BGLAccount | null | undefined> => {
  try {
    const currentAccount = await getItem(CURRENT_ACCOUNT)
    if (currentAccount) return currentAccount as BGLAccount
    else return null
  } catch (error) {
    return
  }
}
/// END OF WALLET LOGIC

/// START APP STATE LOGIC
export const APP_INSTALL_STATE = {
  onboarding: 'onboarding',
  installed: 'installed'
}

export const saveAppInstallState = async (
  installState: string
): Promise<void> => {


  switch (installState) {
    case APP_INSTALL_STATE.installed:
      const installed = {
        key: INSTALL_STATE,
      }
      await AsyncStorage.setItem(INSTALL_STATE, installState)
      break;
    case APP_INSTALL_STATE.onboarding:
      await AsyncStorage.setItem(INSTALL_STATE, installState)
    default:
      break;
  }
}

export const retrieveAppInstallState = async () => {
  try {
    const appInstallState = await AsyncStorage.getItem(INSTALL_STATE)
    return appInstallState
  } catch (err) {
    // @ts-ignore
    throw new Error(err?.message);
  }
} /// END OF APP INSTALL STATE LOGIC

/// ACCOUNTS LOGIC
export const getBGLAccounts = async (): Promise<IAccounts | null> => {
  try {
    const acounts = await getItem(BITGESELL_ACCOUNTS)
    if (acounts) return acounts as IAccounts
    else return null

  } catch (error) {
    // @ts-ignore
    throw new Error(err?.message);

  }
}

export const getBGLAccount = async (
  index: number
): Promise<BGLAccount | null> => {
  const accounts = await getBGLAccounts()
  // @ts-ignore
  if (accounts) return accounts[index]
  else return null
}

export const formatDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export function formatTimeStampToDateString(timestamp: number) {
  // const timestampInSecondsMs = timestamp * 1000;
  const date = new Date(timestamp);
  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  return dateString
}

export function formatAddressForDisplay(address: string) {
  return address.length <= 8 ? address : address.substring(0, 5) + "..." + address.slice(-15);
}

export async function copyToClipboard(content: string) {
  await Clipboard.setStringAsync(content)
}

type ERC20Labels = 'WBGL' | 'USDT'


type NetworkNames = 'Bitgesell' | 'BNB Chain' | 'Ethereum'

export function formatCoinLabel(network: NetworkNames) {
  switch (network) {
    case 'BNB Chain':
      return 'BNB'
    case 'Bitgesell':
      return 'BGL'
    case 'Ethereum':
      return 'ETH'
    case 'BNB Chain':
    default:
      break;
  }
}

export { getItem };

export const supportedNetworks = {
  Bitgesell: {
    id: '1',
    icon: require('@/assets/bgl-sm.png'),
    name: Networks.Bitgesell
  },
  Ethereum: {
    id: '2',
    icon: require('@/assets/ethereum-sm.png'),
    name: Networks.Ethereum,
  },
  BNBSmartChain: {
    id: '3',
    icon: require('@/assets/bsc-sm.png'),
    name: Networks.BNBSmartChain
  }
}

export async function computeAgreggateBalancesUSD() {
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
    wbglBalanceERC20 += wallet.assets.wbgl
    wbglBalanceERC20USD += wallet.assets.wbgl * 0.067 // use dao values
  })

  bnbAccounts.accounts.forEach(wallet => {
    bnbBalanceUSD += wallet.balance.usd
    bnbBalance += wallet.balance.balance
    usdtBalanceBep20 += wallet.assets.usdt
    wbglBep20Balance += wallet.assets.wbgl
    wbglBep20BalanceUSD += wallet.assets.wbgl * 0.067 // use BGL price as it is a wrapped version of the same
  })

  // add WBGL dollar conversion
  const totalBalanceUSD = (bglBalanceUSD + ethBalanceUSD + usdtBalance + bnbBalanceUSD + usdtBalanceBep20 + wbglBep20BalanceUSD + wbglBalanceERC20USD)

  return {
    totalBalanceUSD,
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

}


export async function syncWalletBalanceInMemory(snapshot: IWallet, network: Networks) {
  const _newAccountState: IWallet = {
    address: snapshot.address,
    privateKey: snapshot.privateKey,
    index: snapshot.index,
    balance: {
      balance: snapshot.balance.balance,
      usd: snapshot.balance.usd
    },
    active: true,
    imported: true,
    assets: {
      usdt: snapshot.assets.usdt, // update accordingly for ethereum/bnb
      wbgl: snapshot.assets.wbgl
    }
  }
  // @ts-ignore
  if (network === Networks.Bitgesell) delete _newAccountState.assets
  const accounts = await getAccounts(network) as IAccounts
  // merge and replace
  const oldAccountState = accounts.accounts.at(snapshot.index)
  const accountIndex = accounts.accounts.findIndex((_account) => _account.address === snapshot.address)

  const merge: IWallet = {
    ..._newAccountState,
  }

  if (accountIndex !== -1) {
    accounts.accounts.splice(accountIndex, 1, merge)
  }
  await saveAccounts(network, accounts)
}

export async function getAllAccounts() {

  const bglAccounts = await getAccounts(Networks.Bitgesell) as IAccounts
  const bnbAccounts = await getAccounts(Networks.BNBSmartChain) as IAccounts
  const ethAccounts = await getAccounts(Networks.Ethereum) as IAccounts

  return {
    BNB: bnbAccounts.accounts[0],
    ETH: ethAccounts.accounts[0],
    BGL: bglAccounts.accounts[0]
  }
}

/// Settings:
export async function changePassword(newPassword: string, oldPassword: string) {
  const isValidPassword = await verifyPassword(oldPassword)
  if (!isValidPassword) throw new Error('Wrong Password. Provide a valid old password')
  await savePassword(newPassword).then((res) => { return res })
}

export async function resetWallet(password: string) {

}

export async function showPrivateKeyOrSeed(network: Networks) {

}
/// End of settings

export const validatePassword = (password: string) => password.length > 5