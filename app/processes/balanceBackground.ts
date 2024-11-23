import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'

import { API, IBalance } from '../network/rpc'
import { getAccounts, IAccounts, IWallet, Networks, syncWalletBalanceInMemory } from '../utils'
import { useDispatch } from 'react-redux'
import { updateBalancesUSD, updateTotalBalance } from '@/features/wallet/walletSlice'
import { triggerBalanceNotification } from './Notifications'

export const SYNC_TEST = 'SYNC_TESTING'

/// 1. BGL
const api = new API()

export const SYNC_BGL_BALANCE_BACKGROUND = 'SYNC_BGL_BALANCE_BACKGROUND'
async function syncBGLBalance() {
  try {
    const bglAccounts = await getAccounts(Networks.Bitgesell) as IAccounts
    const wallet = bglAccounts.accounts[0]
    // @ts-ignore
    const oldBalance = wallet.balance.usd
    const balance = await api.getBGLBalance(wallet.privateKey)

    const _wallet: IWallet = {
      ...bglAccounts.accounts[0],
      balance: {
        usd: balance.balance.usd,
        balance: balance.balance.balance
      },
      assets: {
        usdt: 0,
        wbgl: 0
      }
    }

    syncWalletBalanceInMemory(_wallet, Networks.Bitgesell)
    const difference = balance.balance.usd - oldBalance

    if (balance.balance.usd > oldBalance && difference > 1) {
      triggerBalanceNotification('BGL', balance.balance.usd)
      return BackgroundFetch.BackgroundFetchResult.NewData
    }
    return BackgroundFetch.BackgroundFetchResult.NewData
  } catch (error) {
    return
  }
}

/// 2. ETH

export const SYNC_ETH_BALANCE_BACKGROUND = 'SYNC_ETH_BALANCE_BACKGROUND'
async function syncETHBalance() {
  try {

    const ethAccounts = await getAccounts(Networks.Ethereum) as IAccounts
    const ethWalletPrivKey = ethAccounts.accounts[0].privateKey as string
    const balance = await api.getETHBalance(ethWalletPrivKey)
    const oldBalance = ethAccounts.accounts[0].balance.usd

    const _wallet: IWallet = {
      ...ethAccounts.accounts[0],
      balance: {
        usd: balance.balance.usd,
        balance: balance.balance.balance
      },
      assets: {
        usdt: ethAccounts.accounts[0].assets.usdt,
        wbgl: ethAccounts.accounts[0].assets.wbgl
      }
    }

    syncWalletBalanceInMemory(_wallet, Networks.Ethereum)
    const difference = balance.balance.usd - oldBalance
    if (balance.balance.usd > oldBalance && difference > 1) {
      triggerBalanceNotification('ETH', balance.balance.usd)
      return BackgroundFetch.BackgroundFetchResult.NewData
    }
    return BackgroundFetch.BackgroundFetchResult.NewData
  } catch (error) {
    return
  }
}

/// 3. BNB

export const SYNC_BNB_BALANCE_BACKGROUND = 'SYNC_BNB_BALANCE_BACKGROUND'
async function syncBNBBalance() {
  try {
    const bnbAccounts = await getAccounts(Networks.BNBSmartChain) as IAccounts
    const bnbPrivKey = bnbAccounts.accounts[0].privateKey as string
    const balance = await api.getBNBBalance(bnbPrivKey)
    const oldBalance = bnbAccounts.accounts[0].balance.usd
    const _wallet: IWallet = {
      ...bnbAccounts.accounts[0],
      balance: {
        usd: balance.balance.usd,
        balance: balance.balance.balance
      },
      assets: {
        usdt: bnbAccounts.accounts[0].assets.usdt,
        wbgl: bnbAccounts.accounts[0].assets.wbgl
      }
    }
    syncWalletBalanceInMemory(_wallet, Networks.BNBSmartChain)
    const difference = balance.balance.usd - oldBalance

    if (balance.balance.usd > oldBalance && difference > 1) {
      triggerBalanceNotification('BNB', balance.balance.usd)
      return BackgroundFetch.BackgroundFetchResult.NewData
    }
    return BackgroundFetch.BackgroundFetchResult.NewData
  } catch (error) {
    return
  }
}

/// 4. USDT
export const SYNC_USDT_BALANCE_BACKGROUND = 'SYNC_USDT_BALANCE_BACKGROUND'
async function syncUSDTBalance() {
  try {
    const ethAccounts = await getAccounts(Networks.Ethereum) as IAccounts
    const address = ethAccounts.accounts[0].address as string
    const balance = await api.getUSDTBalance(address)
    const oldBalance = ethAccounts.accounts[0].assets.usdt
    const _wallet: IWallet = {
      ...ethAccounts.accounts[0],
      assets: {
        wbgl: ethAccounts.accounts[0].assets.wbgl,
        usdt: balance.balance.usd
      }
    }

    const difference = balance.balance.usd - oldBalance
    syncWalletBalanceInMemory(_wallet, Networks.Ethereum)
    if (balance.balance.usd > oldBalance && difference > 1) {
      triggerBalanceNotification('ETH', balance.balance.usd)
      return BackgroundFetch.BackgroundFetchResult.NewData
    }
    return BackgroundFetch.BackgroundFetchResult.NewData
  } catch (error) {
    return
  }
}

/// 5. 
export const SYNC_BUSDT_BALANCE_BACKGROUND = 'SYNC_BUSDT_BALANCE_BACKGROUND'
async function syncBUSDTBalance() {

  try {

    const bnbAccounts = await getAccounts(Networks.BNBSmartChain) as IAccounts
    const address = bnbAccounts.accounts[0].address as string
    const balance = await api.getBUSDTBalance(address)
    const oldBalance = bnbAccounts.accounts[0].assets.usdt

    const _wallet: IWallet = {
      ...bnbAccounts.accounts[0],
      assets: {
        usdt: balance.balance.usd,
        wbgl: bnbAccounts.accounts[0].assets.wbgl

      }
    }

    syncWalletBalanceInMemory(_wallet, Networks.BNBSmartChain)
    const difference = balance.balance.usd - oldBalance
    if (balance.balance.usd > oldBalance && difference > 1) {
      syncWalletBalanceInMemory(_wallet, Networks.Ethereum)
      triggerBalanceNotification('USDT', balance.balance.usd)
      return BackgroundFetch.BackgroundFetchResult.NewData
    }

    return BackgroundFetch.BackgroundFetchResult.NewData
  } catch (error) {
    return
  }
}

/// 6. Balances: sync to store
export const SYNC_TOTAL_BALANCE_BACKGROUND = 'SYNC_TOTAL_BALANCE_BACKGROUND'

async function syncAgreggateBalancesUSD() {
  const dispatch = useDispatch()
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

    dispatch(updateTotalBalance({ balance: totalBalanceUSD }))

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
    }

    dispatch(updateBalancesUSD(balance))
    return BackgroundFetch.BackgroundFetchResult.NewData

  } catch (error) {
    return
  }
}

TaskManager.defineTask(SYNC_ETH_BALANCE_BACKGROUND, syncETHBalance)
TaskManager.defineTask(SYNC_BGL_BALANCE_BACKGROUND, syncBGLBalance)
TaskManager.defineTask(SYNC_BNB_BALANCE_BACKGROUND, syncBNBBalance)
TaskManager.defineTask(SYNC_USDT_BALANCE_BACKGROUND, syncUSDTBalance)
TaskManager.defineTask(SYNC_BUSDT_BALANCE_BACKGROUND, syncBUSDTBalance)
TaskManager.defineTask(SYNC_TOTAL_BALANCE_BACKGROUND, syncAgreggateBalancesUSD)

type TaskName = 'SYNC_ETH_BALANCE_BACKGROUND' | 'SYNC_BGL_BALANCE_BACKGROUND' | 'SYNC_BNB_BALANCE_BACKGROUND' | 'SYNC_USDT_BALANCE_BACKGROUND' | 'SYNC_BUSDT_BALANCE_BACKGROUND' | 'SYNC_TOTAL_BALANCE_BACKGROUND'

export async function registerAsyncTask(task: TaskName, timeMinutes?: number) {
  const TIME_MINUTES = 60 * 15
  const time = timeMinutes || TIME_MINUTES
  const startOnBootAndroidOnly = true
  const stopOnTerminatAndroidOnly = true
  return BackgroundFetch.registerTaskAsync(task, {
    minimumInterval: time,
    stopOnTerminate: stopOnTerminatAndroidOnly,
    startOnBoot: startOnBootAndroidOnly,
  })
}

export async function unregisterAsyncTask(task: TaskName) {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(task)
  if (isRegistered) await BackgroundFetch.unregisterTaskAsync(task)
  else return
}

async function updateBGLBalance() {
  try {
    const bglAccounts = await getAccounts(Networks.Bitgesell) as IAccounts
    const wallet = bglAccounts.accounts[0]
    // @ts-ignore
    const oldBalance = wallet.balance.usd
    const balance = await api.getBGLBalance(wallet.privateKey)

    const _wallet: IWallet = {
      ...bglAccounts.accounts[0],
      balance: {
        usd: balance.balance.usd,
        balance: balance.balance.balance
      },
      assets: {
        usdt: 0,
        wbgl: 0
      }
    }

    syncWalletBalanceInMemory(_wallet, Networks.Bitgesell)

    return BackgroundFetch.BackgroundFetchResult.NewData
  } catch (error) {
    return
  }
}

/// 2. ETH

async function updateETHBalance() {
  try {

    const ethAccounts = await getAccounts(Networks.Ethereum) as IAccounts
    const ethWalletPrivKey = ethAccounts.accounts[0].privateKey as string
    const balance = await api.getETHBalance(ethWalletPrivKey)
    const oldBalance = ethAccounts.accounts[0].balance.usd
    const _wallet: IWallet = {
      ...ethAccounts.accounts[0],
      balance: {
        usd: balance.balance.usd,
        balance: balance.balance.balance
      },
      assets: {
        usdt: ethAccounts.accounts[0].assets.usdt,
        wbgl: ethAccounts.accounts[0].assets.wbgl
      }
    }

    syncWalletBalanceInMemory(_wallet, Networks.Ethereum)

    return BackgroundFetch.BackgroundFetchResult.NewData
  } catch (error) {
    return
  }
}

/// 3. BNB

async function updateBNBBalance() {
  try {
    const bnbAccounts = await getAccounts(Networks.BNBSmartChain) as IAccounts
    const bnbPrivKey = bnbAccounts.accounts[0].privateKey as string
    const balance = await api.getBNBBalance(bnbPrivKey)
    const oldBalance = bnbAccounts.accounts[0].balance.usd
    const _wallet: IWallet = {
      ...bnbAccounts.accounts[0],
      balance: {
        usd: balance.balance.usd,
        balance: balance.balance.balance
      },
      assets: {
        usdt: bnbAccounts.accounts[0].assets.usdt,
        wbgl: bnbAccounts.accounts[0].assets.wbgl
      }
    }
    syncWalletBalanceInMemory(_wallet, Networks.BNBSmartChain)

    return BackgroundFetch.BackgroundFetchResult.NewData
  } catch (error) {
    return
  }
}

/// 4. USDT
async function updateUSDTBalance() {
  try {
    const ethAccounts = await getAccounts(Networks.Ethereum) as IAccounts
    const address = ethAccounts.accounts[0].address as string
    const balance = await api.getUSDTBalance(address)
    const oldBalance = ethAccounts.accounts[0].assets.usdt
    const _wallet: IWallet = {
      ...ethAccounts.accounts[0],
      assets: {
        wbgl: ethAccounts.accounts[0].assets.wbgl,
        usdt: balance.balance.usd
      }
    }

    syncWalletBalanceInMemory(_wallet, Networks.Ethereum)
    return BackgroundFetch.BackgroundFetchResult.NewData
  } catch (error) {
    return
  }
}

/// 5. 
async function updateBUSDTBalance() {

  try {

    const bnbAccounts = await getAccounts(Networks.BNBSmartChain) as IAccounts
    const address = bnbAccounts.accounts[0].address as string
    const balance = await api.getBUSDTBalance(address)
    const oldBalance = bnbAccounts.accounts[0].assets.usdt
    const _wallet: IWallet = {
      ...bnbAccounts.accounts[0],
      assets: {
        usdt: balance.balance.usd,
        wbgl: bnbAccounts.accounts[0].assets.wbgl
      }
    }
    syncWalletBalanceInMemory(_wallet, Networks.BNBSmartChain)
    return BackgroundFetch.BackgroundFetchResult.NewData
  } catch (error) {
    return
  }
}

export const syncAllBalances = async () => {
  await updateETHBalance(),
    await updateBGLBalance()
  await updateBNBBalance()
  await updateUSDTBalance()
  await updateBUSDTBalance()
}