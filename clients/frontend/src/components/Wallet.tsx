import { Principal } from "@dfinity/principal"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { _SERVICE as wallet_SERVICE } from "../candid/foxic_wallet"
import { CreateActorResult } from "../services/connection"
import QrCode from "qrcode.react"
import { CODE, COPY, REFRESH } from "../utils/resCont"
import Copy from "./Copy"
import { balanceFromString, balanceToString } from "../utils/converter"

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
  const [balance, setBalance] = useState<bigint | undefined>()
  const [walletDetailUrl, setWalletDetailUrl] = useState("")
  const [visibleCode, setVisibleCode] = useState(false)
  const [sendLoading, setSendLoading] = useState(false)
  const [refreshLoading, setRefreshLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>()
  useEffect(() => {
    getAddress()
    modalRef.current?.addEventListener("click", () => {
      setVisibleCode(false)
    })
  }, [])

  useEffect(() => {
    if (address) {
      getWalletUrl()
      getBalance()
    }
  }, [address])

  const send = async () => {
    if (address && amount) {
      setSendLoading(true)
      const result = await walletConnect?.actor.wallet_icp_send({
        account_id: toAddress!,
        amount: { e8s: balanceFromString(amount) },
      })
      setSendLoading(false)
      getBalance()
    }
  }

  const getAddress = async () => {
    const result = await walletConnect?.actor.wallet_address_get([])
    setAddress(result)
  }

  const getBalance = async () => {
    setRefreshLoading(true)
    const result = await walletConnect?.actor.wallet_balance_get([])
    setBalance(result.e8s)
    setRefreshLoading(false)
  }

  const getWalletUrl = async () => {
    if (address) {
      const result = await walletConnect?.actor.wallet_url_get(address)
      setWalletDetailUrl(result)
    }
  }

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
          className={`button-primary button-block ${
            sendLoading ? "button-disabled" : ""
          }`}
          style={{ marginTop: 60 }}
          onClick={send}
        >
          {sendLoading ? "Send..." : "Send"}
        </a>
        <p style={{ marginTop: 20 }}>Balance:</p>
          {balance ? (
            <div className="flex align-items-center">
              <h2 className="c_brand">{balanceToString(balance).total}</h2>
              <img
                className={`refreshing ${refreshLoading ? "spinAnimate" : ""}`}
                src={REFRESH}
                style={{ width: 20, height: 20, marginLeft: 10 }}
                alt=""
                onClick={getBalance}
              />
            </div>
          ) : null}
      </div>
      <div className="card">
        <h2>Wallet details</h2>
        <div className="flex flex-column">
          <p style={{ marginTop: 20 }}>Canister Principal ID:</p>
          <p className="c_grey">{walletCanister}</p>
          <p style={{ marginTop: 20 }}>Controller: </p>
          {walletController?.map((principal) => (
            <p className="c_grey" key={principal.toText()}>
              {principal.toText()}
            </p>
          ))}
          <p style={{ marginTop: 20 }}>Wallet address:</p>
          <div className="flex">
            <div className="flex-1">
              <p className="c_grey">{address}</p>
            </div>
            <img
              src={CODE}
              alt=""
              style={{ width: 20, height: 20, marginRight: 10 }}
              onClick={() => setVisibleCode(true)}
            />
            <Copy
              text={address!}
              content={
                <img src={COPY} style={{ width: 20, height: 20 }} alt="" />
              }
            />
          </div>
          
          <p style={{ marginTop: 50 }}>wallet detail url:</p>
          <div className="flex">
            <div className="flex-1">
              <p>
                <a className="c_brand" href={walletDetailUrl}>
                  {walletDetailUrl}
                </a>
              </p>
            </div>
            <Copy
              text={walletDetailUrl!}
              content={
                <img src={COPY} style={{ width: 20, height: 20 }} alt="" />
              }
            />
          </div>
        </div>
      </div>
      <div className={`modal ${visibleCode ? "show" : ""}`} ref={modalRef}>
        <div className="modal-content">
          <QrCode
            value={address ?? ""}
            size={300}
            includeMargin
            // level={'L'}
            style={{ width: 300, height: 300 }}
          />
        </div>
      </div>
    </>
  )
}

export default Wallet
