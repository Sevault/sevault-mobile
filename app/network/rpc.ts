import { API_URL } from "@/features/api/User"
import { IAccounts, IWallet, Networks } from "../utils"
import { Tx, TxOjbect } from "../types"

export interface WalletFromPrivKey {
  new_address: INewaddress
  success: boolean
  error?: string
}

interface INewaddress {
  privateKey: IPrivateKey
  publicKey: IPublicKey
  testnet: boolean
  type: string
  witnessVersion: number
  scriptHash: boolean
  hash: IKey
  hashHex: string
  address: string
}

interface IPublicKey {
  compressed: boolean
  testnet: boolean
  hex: string
  key: IKey
}

interface IPrivateKey {
  wif: string
  key: IKey
  hex: string
  compressed: boolean
  testnet: boolean
}

interface IKey {
  type: string
  data: number[]
}

interface IRawTxObject {
  to: string
  from: string
  amount: string
  privateKey: string
  fee: string
}

export interface ITxResult {
  txHash: string;
  rpc_result: IRpcresult;
  success: boolean;
  balance: number;
  balanceUSD: number
}

interface IRpcresult {
  result: string;
  error?: any;
  id: string;
}

interface IHelpAndSupport {
  message: string
  emailAddress: string
  subject: string
}

export interface IEVMTxObject {
  privateKey: string
  to: string
  amount: number
}

export interface IEVMTransactionResult {
  amount: string
  blockHash: string
  blockNumber: number
  success: boolean
  to: string
  from: string
  balance: string
  transactionHash: string
}


interface TransactionInput {
  sequence: number;
  addresses: string[];
}

interface TransactionOutput {
  value: number;
  addresses: string[];
}

interface IEThereumTransaction {
  block_hash: string;
  block_height: number;
  block_index: number;
  hash: string;
  addresses: string[];
  total: number;
  fees: number;
  size: number;
  gas_limit: number;
  gas_used: number;
  gas_price: number;
  gas_tip_cap: number;
  gas_fee_cap: number;
  confirmed: string;
  received: string;
  ver: number;
  double_spend: boolean;
  vin_sz: number;
  vout_sz: number;
  confirmations: number;
  confidence: number;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
}

interface IBSCTransaction {
  blockNumber: string;
  blockHash: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  methodId: string;
  functionName: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  txreceipt_status: string;
  gasUsed: string;
  confirmations: string;
  isError: string;
}

export interface IBalance {
  balance: {
    usd: number
    balance: number
  }
}


export type EthereumTransactions = Array<IEThereumTransaction>
export type BSCTransactions = Array<IBSCTransaction>

export class API {
  private readonly headers: Record<string, string>
  constructor() {
    this.headers = {
      'Content-Type': 'application/json'
    }
  }

  /**
   * createWallet creates new wallet
   */
  public async createBitgesellAccounts(): Promise<IAccounts> {

    try {
      const res = await fetch(`${API_URL}/create-bitgesell-Accounts`, {
        method: 'POST',
        headers: this.headers
      })

      const walletObject = await res.json()
      return walletObject as IAccounts

    } catch (err) {
      // @ts-ignore
      throw new Error('Failed to create wallet' + err);

    }
  }

  public async importWallet(seedPhraseOrPrivateKey: string) {
    try {
      const body = {
        seedOrPkey: seedPhraseOrPrivateKey
      }

      const res = await fetch(`${API_URL}/bgl/import-existing-wallet`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body)
      })

      const newWallet = await res.json()
      return newWallet as IAccounts

    } catch (error) {
      throw new Error(`Error ${error}`);
    }
  }

  public async sendRawTransaction(txObject: IRawTxObject): Promise<ITxResult> {

    try {
      const res = await fetch(`${API_URL}/send-bgl`, {
        headers: this.headers,
        method: 'POST',
        body: JSON.stringify(txObject)
      })
      const txResult = await res.json()
      return txResult as ITxResult
    } catch (error) {
      throw new Error("Failed" + error);
    }
  }

  public async getETHBalance(privateKey: string) {
    try {
      const payload = { privateKey }
      const res = await fetch('https://api.sevaultwallet.com/app/v1/eth/balance', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: this.headers
      })
      const data = await res.json()
      return data as IBalance
    } catch (error) {
      throw new Error("Failed" + error);
    }
  }

  public async getBNBBalance(privateKey: string) {
    try {
      const payload = { privateKey }
      const res = await fetch('https://api.sevaultwallet.com/bnb/balance', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: this.headers
      })
      const data = await res.json()
      return data as IBalance
    } catch (error) {
      throw new Error("Failed" + error);
    }

  }

  public async getBGLBalance(privateKey: string) {
    try {
      const payload = { privateKey }
      const res = await fetch('https://api.sevaultwallet.com/app/bgl/balance', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: this.headers
      })
      const data = await res.json()
      return data as IBalance
    } catch (error) {
      throw new Error("Failed" + error);
    }
  }

  public async getUSDTBalance(address: string) {
    try {
      const payload = { address }
      const res = await fetch('https://api.sevaultwallet.com/app/v1/eth/balance-usdt', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: this.headers
      })
      const data = await res.json()
      return data as IBalance
    } catch (error) {
      throw new Error("Failed" + error);
    }

  }

  public async getBUSDTBalance(address: string) {
    try {
      const payload = { address }
      const res = await fetch('https://api.sevaultwallet.com/bnb/balance-usdt', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: this.headers
      })
      const data = await res.json()
      return data as IBalance
    } catch (error) {
      throw new Error("Failed" + error);
    }

  }


  public async getTransactionHistory(address: string, network: Networks): Promise<TxOjbect | EthereumTransactions | BSCTransactions | undefined> {
    switch (network) {
      case Networks.Bitgesell:

        try {
          const res = await fetch(`https://api.sevaultwallet.com/app/bgl/tx-history/${address}`)
          const txHistoryObject = await res.json()
          const transactions = txHistoryObject.tx
          return transactions
          // @ts-ignore
        } catch (error) {
          throw new Error(`${error}`)
        }

      case Networks.Ethereum:
        try {
          const res = await fetch('https://api.sevaultwallet.com/app/v1/eth/history', { body: JSON.stringify({ address: address }), method: 'POST', headers: this.headers })
          const data = await res.json()
          return data.tx as Promise<EthereumTransactions>
        } catch (error) {
          throw new Error(`${error}`)
        }

      case Networks.BNBSmartChain:
        try {
          const res = await fetch('https://api.sevaultwallet.com/bnb/history', { body: JSON.stringify({ address: address }), method: 'POST', headers: this.headers })
          const data = await res.json()
          return data.tx as Promise<TxOjbect>
        } catch (error) {
          throw new Error(`${error}`)
        }
      default:
        break;
    }
  }

  public async getUSDTTxHistory(address: string, network: Networks) {
    switch (network) {
      case Networks.BNBSmartChain:
        try {
          const res = await fetch('https://api.sevaultwallet.com/bnb/history-usdt', { body: JSON.stringify({ address: address }), method: 'POST', headers: this.headers })
          const data = await res.json()
          return data.tx as Promise<TxOjbect>
        } catch (error) {
          throw new Error(`${error}`)
        }
      case Networks.Ethereum:
        try {
          const res = await fetch('https://api.sevaultwallet.com/app/v1/eth/history-usdt', { body: JSON.stringify({ address: address }), method: 'POST', headers: this.headers })
          const data = await res.json()
          return data.tx as Promise<EthereumTransactions>
        } catch (error) {
          throw new Error(`${error}`)
        }
      default:
        break;
    }
  }

  public async getUnconfirmedBGLTransactions(address: string) {
    try {
      const res = await fetch('https://api.sevaultwallet.com/app/bgl/unconfirmed', { body: JSON.stringify({ address: address }), method: 'POST', headers: this.headers })
      const data = await res.json()
      return data.tx
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  public postHelpAndSuport({ emailAddress, subject, message, }: IHelpAndSupport) {
    // post message to api, email the user via newsletter(create newsletter)
  }

  public async createEthereumWallet() {
    try {
      const res = await fetch('https://api.sevaultwallet.com/app/v1/eth/create-eth-wallet', {
        method: 'POST'
      })
      const ethereumAccount = await res.json()
      return ethereumAccount
    } catch (error) {
      throw new Error(`${error}`)
    }
  }
  // 2.
  public async sendETH({ privateKey, amount, to, }: IEVMTxObject) {
    try {
      const res = await fetch('https://api.sevaultwallet.com/app/v1/eth/send', {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ privateKey, amount, to })
      })
      const receipt = await res.json()
      return receipt as IEVMTransactionResult
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  // 3.
  public async sendBNB({ privateKey, amount, to }: IEVMTxObject) {
    try {
      const res = await fetch('https://api.sevaultwallet.com/bnb/send', {
        headers: this.headers,
        method: 'POST',
        body: JSON.stringify({ privateKey: privateKey, amount: amount, to: to })
      })

      const receipt = await res.json()
      return receipt as IEVMTransactionResult
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  // 4.
  public async sendUSDT({ privateKey, amount, to, }: IEVMTxObject, network: Networks) {
    const url = network === Networks.Ethereum ? 'https://api.sevaultwallet.com/app/v1/eth/send-usdt' : 'https://api.sevaultwallet.com/bnb/send-usdt'
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ privateKey, amount, to })
      })
      const receipt = await res.json()
      return receipt
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  public async sendWBGL({ privateKey, amount, to, }: IEVMTxObject) {
    try {
      const res = await fetch('https://api.sevaultwallet.com/app/v1/eth/send-wbgl', {
        method: 'POST',
        body: JSON.stringify({ privateKey, amount, to, })
      })
      const receipt = await res.json()
      return receipt
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  public async createBNBSmartChainWallet() {
    try {
      const res = await fetch('https://api.sevaultwallet.com/bnb/create-bnb-wallet', {
        method: 'POST'
      })
      const ethereumAccount = await res.json()
      return ethereumAccount
    } catch (error) {
      throw new Error(`${error}`)

    }
  }

  // 5.
  // wind up with tesnet BUSDT
  public async sendBUSDT({ privateKey, amount, to }: IEVMTxObject) {
    try {
      const res = await fetch('https://api.sevaultwallet.com/bnb/send-usdt', {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ privateKey, amount, to })
      })
      const receipt = await res.json() as IEVMTransactionResult
      return receipt
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  // omit as it is not availbe in initial release
  public async sendWBGLBEP20({ privateKey, amount, to, }: IEVMTxObject) {
    try {
      const res = await fetch('https://api.sevaultwallet.com/bnb/send-wbgl', {
        method: 'POST',
        body: JSON.stringify({ privateKey, amount, to })
      })
      const receipt = await res.json()
      return receipt
    } catch (error) {
      throw new Error(`${error}`)
    }
  }
} 