// all wallet stuff here:
import { APP_INSTALL_STATE, getItem } from '@/app/utils';
import { createSlice } from '@reduxjs/toolkit';
import { RootStateTree } from '../store';
import { useSelector } from 'react-redux';

// 1. add a persistence middleware for some portions of the state
const initialState = {
  state: 'idle',
  walletObject: {
    address: null,
    privateKey: null,
    mnemonic: null
  },
  user: null,
  installState: APP_INSTALL_STATE.onboarding,
  dashboard: {
    balanceBGL: null,
    balanceUSD: null,
    balanceSatoshi: null,
    bglInfo: null,
    bglPriceUSD: null,
    percentage_7d: null,
    accountTransactions: null
  },

  currentAccount: {
    index: 0,
    address: null,
    privateKey: null,
    balance: 0,
    balanceUSD: 0,
  },
  accountTxHistory: {
    tx: null
  },
  // NB: inmemory state: reflect along with sync with storage to have a realtime display on the app as the only mechanism 
  currentBGLBalance: {
    balance: 0,
    balanceUSDT: 0,
  },
  currentBNBBalance: {
    balance: 0,
    balanceUSDT: 0,
  },
  currentETHBalance: {
    balance: 0,
    balanceUSDT: 0,
  },
  currentUSDTBEP20Balance: {
    balance: 0,
  },
  currentUSDTERC20Balance: {
    balance: 0,
  },
  currentWBGLBEP20Balance: {
    balance: 0,
    balanceUSD: 0,
  },
  totalUSDBalance: {
    balance: 0
  },
  accounts: {
    BNB: null,
    ETH: null,
    BGL: null
  },
  balancesUSD: {
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
  },
  walletBackup: {
    bnb: {
      address: '',
      privateKey: ''
    },
    bgl: {
      seedphrase: '',
      address: '',
      privateKey: ''
    },
    eth: {
      address: '',
      privateKey: ''
    }
  }
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {

    createWallet: (state, action) => {
      state.walletObject = action.payload
    },
    importWallet: (state, action) => {
      state.walletObject = action.payload
    },
    installState: (state, action) => {
      // would be ideal to have this in the local storage to keep track of install state
      state.installState = action.payload
    },
    loadDashboard: (state, action) => {
      state.dashboard = action.payload
    },
    loadAccounts: (state, action) => {
      state.accounts = action.payload
    },
    loadCurrentAccount: (state, action) => {
      state.currentAccount = action.payload
    },
    loadAccountTxHisory: (state, action) => {
      state.accountTxHistory = action.payload
    },

    // Ideal for syncing balances - recompute $ balance homepage
    updateBGLBalance: (state, action) => {
      state.currentBGLBalance = action.payload
    },
    updateBNBalance: (state, action) => {
      state.currentBNBBalance = action.payload
    },
    updateETHBalance: (state, action) => {
      state.currentETHBalance = action.payload
    },
    updateUSDTERC20Balance: (state, action) => {
      state.currentUSDTERC20Balance = action.payload
    },
    updateUSDTBEP20Balance: (state, action) => {
      state.currentUSDTBEP20Balance = action.payload
    },
    updateWBGLERC20Balance: (state, action) => {
      state.currentWBGLBEP20Balance = action.payload
    },

    updateWBGLBEP20Balance: (state, action) => {
      state.currentUSDTBEP20Balance = action.payload
    },
    updateTotalBalance: (state, action) => {
      state.totalUSDBalance = action.payload
    },
    updateAccounts: (state, action) => {
      state.accounts = action.payload
    },
    updateBalancesUSD: (state, action) => {
      state.balancesUSD = action.payload
    },
    setWalletBackup: (state, action) => {
      state.walletBackup = action.payload
    }
  }

})

// actions
export const {
  createWallet,
  importWallet,
  installState,
  loadDashboard,
  loadCurrentAccount,
  loadAccountTxHisory,
  updateBGLBalance,
  updateBNBalance,
  updateETHBalance,
  updateTotalBalance,
  updateUSDTBEP20Balance,
  updateUSDTERC20Balance,
  updateWBGLBEP20Balance,
  updateWBGLERC20Balance,
  updateAccounts,
  updateBalancesUSD,
  setWalletBackup
} = walletSlice.actions

// selectors to go here:

// reducer
export default walletSlice.reducer

