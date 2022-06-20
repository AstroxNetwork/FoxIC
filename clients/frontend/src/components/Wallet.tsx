import { Principal } from "@dfinity/principal"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { _SERVICE as wallet_SERVICE } from "../candid/foxic_wallet"
import { _SERVICE as factory_SERVICE } from "../candid/foxic_factory"
import { CreateActorResult } from "../services/connection"
import QrCode from "qrcode.react"
import { CODE, COPY, DELETE, REFRESH, UPDATE } from "../utils/resCont"
import Copy from "./Copy"
import { balanceFromString, balanceToString } from "../utils/converter"
import { METAMASK_FLASK } from "../config"

type UpdateProps = {
  factoryConnect: CreateActorResult<factory_SERVICE>
  onClose: () => void
}
const Update: React.FC<UpdateProps> = (props) => {
  const [updateLoading, setUpdateLoading] = useState(false)
  const { factoryConnect } = props
  const updateWallet = async () => {
    setUpdateLoading(true)
    await factoryConnect?.actor.factory_wallet_upgrade()
    setUpdateLoading(false)
  }
  return (
    <>
      <h2 style={{ marginBottom: 16 }}>Canister update</h2>
      <p style={{ marginBottom: 90 }}>
        You are about to update your canister to the latest smart contracts.
      </p>
      <a
        className={`button-primary button-block ${
          updateLoading ? "button-disabled" : ""
        }`}
        onClick={updateWallet}
      >
        { updateLoading ? 'Update...': 'Update'}
      </a>
      <p
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#9C9CA4",
          marginTop: 25,
          cursor: "pointer",
        }}
        onClick={props.onClose}
      >
        Close
      </p>
    </>
  )
}

type DeleteProps = {
  factoryConnect: CreateActorResult<factory_SERVICE>
  onClose: () => void
}
const Delete: React.FC<DeleteProps> = (props) => {
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { factoryConnect } = props
  const uninstallWallet = async () => {
    setDeleteLoading(true)
    await factoryConnect?.actor.factory_wallet_uninstall()
    setDeleteLoading(false)
  }

  return (
    <>
      <h2 style={{ marginBottom: 16 }}>Delete wallet</h2>
      <p>
        You are about to delete your wallet and the canister will be deleted
        too.
      </p>
      <p style={{ marginBottom: 90 }}>
        {" "}
        * Please <span style={{ color: "red" }}>transfer out</span> all your
        assets before continue.
      </p>
      <a
        className={`button-primary button-block ${
          deleteLoading ? "button-disabled" : ""
        }`}
        onClick={uninstallWallet}
      >
        {deleteLoading ? 'Deleting...': 'Delete'}
      </a>
      <p
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#9C9CA4",
          marginTop: 25,
          cursor: "pointer",
        }}
        onClick={props.onClose}
      >
        Close
      </p>
    </>
  )
}

type SettingProps = {
  onClose: () => void
  walletDetailUrl: string
}
const Setting: React.FC<SettingProps> = (props) => {
  const { walletDetailUrl } = props
  return (
    <>
      <h2 className="mg_b_10">1.Set up MetaMask Flask</h2>
      <p className="mg_b_10">
        Notice: Please turn off your MetaMask<span>(Orange)</span> before you
        use MeataMask Flask<span style={{ color: "" }}>(Purple)</span>.
      </p>
      <a
        style={{ marginBottom: 30 }}
        href={METAMASK_FLASK}
        className="button-default"
        target="_blank"
      >
        Install
      </a>
      <h2 className="mg_b10">2. Add Network.</h2>
      <div className="flex mg_b_20">
        <div className="flex-2">
          <p style={{ color: "#9C9CA4" }}>Network Name:</p>
        </div>
        <div className="flex-3">
          <p>foxic_network</p>
        </div>
        <Copy
          text="foxic_network"
          content={<img src={COPY} style={{ width: 20, height: 20 }} />}
        />
      </div>
      <div className="flex mg_b_20">
        <div className="flex-2">
          <p style={{ color: "#9C9CA4" }}>New RPC URL:</p>
        </div>
        <div className="flex-3">
          <p>{walletDetailUrl}</p>
        </div>
        <Copy
          text={walletDetailUrl}
          content={<img src={COPY} style={{ width: 20, height: 20 }} />}
        />
      </div>
      <div className="flex mg_b_20">
        <div className="flex-2">
          <p style={{ color: "#9C9CA4" }}>Chain ID:</p>
        </div>
        <div className="flex-3">
          <p>10086</p>
        </div>
        <Copy
          text="10086"
          content={<img src={COPY} style={{ width: 20, height: 20 }} />}
        />
      </div>
      <div className="flex mg_b_20">
        <div className="flex-2">
          <p style={{ color: "#9C9CA4" }}>Currency Symbol:</p>
        </div>
        <div className="flex-3">
          <p>ICP</p>
        </div>
        <Copy
          text="ICP"
          content={<img src={COPY} style={{ width: 20, height: 20 }} />}
        />
      </div>
      <div className="flex mg_b_20">
        <div className="flex-2">
          <p style={{ color: "#9C9CA4" }}>Block Explorer URL: (Optional)</p>
        </div>
        <div className="flex-3">
          <p>FOXICNETWORK</p>
        </div>
        <Copy
          text="FOXICNETWORK"
          content={<img src={COPY} style={{ width: 20, height: 20 }} />}
        />
      </div>
      <a
        className={`button-primary button-block`}
        style={{ marginTop: 50 }}
        onClick={props.onClose}
      >
        Close
      </a>
    </>
  )
}

type WalletProps = {
  walletCanister: string
  walletController: [Principal] | []
  walletConnect: CreateActorResult<wallet_SERVICE>
  factoryConnect: CreateActorResult<factory_SERVICE>
}
const Wallet: React.FC<WalletProps> = (props) => {
  const { walletCanister, walletConnect, walletController, factoryConnect } =
    props
  const [address, setAddress] = useState<string | undefined>()
  const [toAddress, setToAddress] = useState<string | undefined>()
  const [amount, setAmount] = useState<string | undefined>()
  const [balance, setBalance] = useState<bigint | undefined>()
  const [walletDetailUrl, setWalletDetailUrl] = useState("")
  const [visibleCode, setVisibleCode] = useState(false)
  const [modalType, setModalType] = useState<
    "update" | "delete" | "code" | "setting"
  >("code")
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
    if (toAddress && amount) {
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
        {balance !== undefined ? (
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
          <div className="flex between" style={{ marginTop: 20 }}>
            <div className="flex-1">
              <p>Canister ID:</p>
              <p className="c_grey">{walletCanister}</p>
            </div>
            <a
              onClick={() => {
                setModalType("update")
                setVisibleCode(true)
              }}
            >
              <img src={UPDATE} style={{ width: 20, height: 20 }} />
            </a>
          </div>

          <p style={{ marginTop: 20 }}>Controller: </p>
          {walletController?.map((principal) => (
            <p
              className="c_grey"
              key={principal.toText()}
              // onClick={async () => {
              //   await uninstallWallet()
              // }}
            >
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
              onClick={() => {
                setModalType("code")
                setVisibleCode(true)
              }}
            />
            <Copy
              text={address!}
              content={
                <img
                  src={COPY}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                  alt=""
                />
              }
            />
            <a
              onClick={() => {
                setModalType("delete")
                setVisibleCode(true)
              }}
            >
              <img src={DELETE} style={{ width: 20, height: 20 }} />
            </a>
          </div>
          <a
            onClick={() => {
              setModalType("setting")
              setVisibleCode(true)
            }}
            className="mg_t_20"
          >
            <h2>Setting MetaMask</h2>
          </a>
          {/* <p style={{ marginTop: 50 }}>wallet detail url:</p>
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
          </div> */}
        </div>
      </div>
      <div className={`modal ${visibleCode ? "show" : ""}`}>
        <div
          className={`modal-content ${
            modalType === "setting" ? "modal-big" : ""
          }`}
        >
          {modalType === "code" ? (
            <>
              <QrCode
                value={address ?? ""}
                size={300}
                includeMargin
                // level={'L'}
                style={{ width: 300, height: 300 }}
              />
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#9C9CA4",
                  marginTop: 25,
                  cursor: "pointer",
                }}
                onClick={() => setVisibleCode(false)}
              >
                Close
              </p>
            </>
          ) : modalType === "delete" ? (
            <Delete
              factoryConnect={factoryConnect}
              onClose={() => setVisibleCode(false)}
            />
          ) : modalType === "update" ? (
            <Update
              factoryConnect={factoryConnect}
              onClose={() => setVisibleCode(false)}
            />
          ) : modalType === "setting" ? (
            <Setting
              walletDetailUrl={walletDetailUrl}
              onClose={() => setVisibleCode(false)}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default Wallet
