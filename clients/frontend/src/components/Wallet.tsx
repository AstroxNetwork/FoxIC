import { Principal } from "@dfinity/principal"
import React, { useCallback, useEffect, useState } from "react"
import { _SERVICE as wallet_SERVICE } from "../candid/foxic_wallet"
import { CreateActorResult } from "../services/connection"

type WalletProps = {
  walletCanister: string
  walletController: [Principal] | []
  walletConnect: CreateActorResult<wallet_SERVICE>
}
const Wallet: React.FC<WalletProps> = (props) => {
  const { walletCanister, walletConnect, walletController } = props
  const [address, setAddress] = useState<string | undefined>()
  const [toAddress, setToAddress] = useState<string | undefined>()
  const [amount, setAmount] = useState<string | undefined>()
  const [walletDetailUrl, setWalletDetailUrl] = useState("")
  useEffect(() => {
    getAddress()
  }, [])

  useEffect(() => {
    if(address) {
      getWalletUrl()
      getBalance()
    }
  }, [address])

  const send = async () => {
    if (address && amount) {
      const result = await walletConnect?.actor.wallet_icp_send({
        account_id: address!,
        amount: { e8s: BigInt(amount!) },
      })
      console.log(result)
    }
  }

  const getAddress = async () => {
    const result = await walletConnect?.actor.wallet_address_get([])
    console.log("address===", result)
    setAddress(result)
  }

  const getBalance = async () => {
    console.log('getBalance')
    const result = await walletConnect?.actor.wallet_balance_get([])
    console.log("balance===", result)
  }

  const getWalletUrl = async () => {
    console.log('getwalletUrl')
    if (address) {
      const result = await walletConnect?.actor.wallet_url_get(address)
      console.log("walletUrl", result)
      setWalletDetailUrl(result)
    }
  }

  console.log('walletController===', walletController)
  return (
    <>
      <div className="card">
        <h2 style={{ marginBottom: 50 }}>Send ICP</h2>
        <input
          aria-label="To Sign a message"
          style={{ padding: "1em" }}
          placeholder="Account ID(Wallet address)"
          onChange={(e) => {
            setToAddress(e.target.value)
          }}
        />
        <input
          style={{ padding: "1em" }}
          placeholder="Amount"
          onChange={(e) => {
            setAmount(e.target.value)
          }}
        />
        <a
          className="button-primary button-block"
          style={{ marginTop: 60 }}
          onClick={send}
        >
          Send
        </a>
      </div>
      <div className="card">
        <h2>Wallet details</h2>
        <div className="flex flex-column">
          <p style={{ marginTop: 20 }}>Canister Principal ID:</p>
          <p className="c_grey">{walletCanister}</p>
          <p style={{ marginTop: 20 }}>Controller: </p>
          {
            walletController?.map((principal) => (
              <p className="c_grey" key={principal.toText()}>{principal.toText()}</p>
            ))
          }
          <p style={{ marginTop: 20 }}>Wallet address:</p>
          <p className="c_grey">{address}</p>
          <p style={{ marginTop: 20 }}>Balance:</p>
          <h2 className="c_brand"></h2>
          <p style={{ marginTop: 50 }}>wallet detail url:</p>
          <p>
            <a href={walletDetailUrl}>{walletDetailUrl}</a>
          </p>
        </div>
      </div>
    </>
  )
}

export default Wallet
