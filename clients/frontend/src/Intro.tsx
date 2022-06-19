import React, { useCallback, useEffect, useState } from "react"
import { counter } from "canisters/counter"
import logo from "./assets/logo-dark.svg"
import { initiateICPSnap } from "./services/metamask"
import { MetamaskICPSnap } from "@astrox/icsnap-adapter"
import { ICPSnapApi, SignRawMessageResponse } from "@astrox/icsnap-types"
import { Signature } from "@dfinity/agent"
import Install from "./components/Install"
import Authorized from "./components/Authorized"

export function Intro() {
  const [principal, setPrincipal] = useState<string | undefined>(undefined)
  const [api, setApi] = useState<ICPSnapApi | undefined>(undefined)
  const [installed, setInstalled] = useState<boolean>(false)
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [signedMessage, setSignedMessage] = useState<
    SignRawMessageResponse | undefined
  >(undefined)

  const installSnap = useCallback(async () => {
    const installResult = await initiateICPSnap()
    if (!installResult.isSnapInstalled) {
      setInstalled(false)
    } else {
      setInstalled(true)
      setApi(await installResult.snap?.getICPSnapApi())
    }
  }, [])

  const getPrincipal = async () => {
    setPrincipal(await api?.getPrincipal())
  }

  const signMessage = async () => {
    const signed = await api?.signRawMessage(message!)
    console.log({ signed })
    setSignedMessage(signed)
  }

  useEffect(() => {
    if (!api) {
      installSnap()
    } else {
      getPrincipal()
    }
  }, [api])
  return (
    <>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p style={{ fontSize: "2em", marginBottom: "0.5em" }}>
          Ready. Lets use Snap
        </p>
        <div
          style={{
            display: "flex",
            fontSize: "0.7em",
            textAlign: "left",
            padding: "2em",
            borderRadius: "30px",
            flexDirection: "column",
            background: "rgb(220 218 224 / 25%)",
            flex: 1,
            width: "32em",
          }}
        >
          {installed ? (
            <div style={{ width: "100%", minWidth: "100%" }}>
              <code>Principal is:</code>
              <p>{principal ?? "...loading"}</p>
            </div>
          ) : (
            <button className="demo-button" onClick={installSnap}>
              Install Snap
            </button>
          )}
          {installed ? (
            <>
              <label style={{ marginBottom: 16 }}>Input Messsage To Sign</label>
              <input
                aria-label="To Sign a message"
                style={{ padding: "1em" }}
                onChange={(e) => {
                  setMessage(e.target.value)
                }}
              />
              <button className="demo-button" onClick={signMessage}>
                Sign Message
              </button>
            </>
          ) : null}
          {signedMessage?.signature !== undefined ? (
            <div
              style={{
                wordBreak: "break-all",
                maxWidth: "100%",
                margin: "1em 0",
              }}
            >
              <code>Signature is : </code>
              <p>{signedMessage?.signature}</p>
            </div>
          ) : null}
        </div>
      </header> */}
      {
        installed ? <Authorized />: <Install handleInstall={installSnap}/>
      }
    </>
  )
}
