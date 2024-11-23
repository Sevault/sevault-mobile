export interface TxOjbect {
  success: boolean
  tx: Array<Tx>
}

export interface Tx {
  id: number
  tx_id: string
  timestamp: number
  amount: number
  confirmations: number
  block_height: number
  rbf: boolean
  coinbase: boolean
  fee: number,
  // BSC + ETH
  from?: string,
  to?: string
}