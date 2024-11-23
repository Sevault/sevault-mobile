import { configureStore } from "@reduxjs/toolkit";
import walletReducer from './wallet/walletSlice'

export const store = configureStore({
  reducer: {
    wallet: walletReducer
  }
})

export type RootStateTree = ReturnType<typeof store.getState>
// 1. Dashboard
// 2. Transactions(wallet account transaction history)
// 3. Settings- Device storage
// 4. How to handle permissions
// 5. Persist on device- segments that do not require frequent updates- auth state(should expire after 30 minutes)
// 6. Ship mvp asap- core functions: send transaction, view history, balance, auth

// version 2: - add ethereum USDT support + ERC20 tokens next release