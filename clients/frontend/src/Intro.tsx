import React, { useCallback, useEffect, useRef, useState } from "react"
import { initiateICPSnap } from "./services/metamask"
import { ICPSnapApi } from "@astrox/icsnap-types"
import Install from "./components/Install"
import Authorized from "./components/Authorized"
import Footer from "./components/Footer"
import {
  CreateActorResult,
  getActor,
  getFactoryConnect,
} from "./services/connection"
import { _SERVICE as factory_SERVICE } from "./candid/foxic_factory"
import { Secp256k1KeyIdentity } from "@dfinity/identity"
import { SnapIdentity } from "@astrox/icsnap-adapter"

export function Intro() {
  const [principal, setPrincipal] = useState<string | undefined>(undefined)
  const [installed, setInstalled] = useState<boolean>(false)
  const [factoryConnect, setFactoryConnect] =
    useState<CreateActorResult<factory_SERVICE>>()
  const [identity, setIdentity] = useState<SnapIdentity>()

  const installSnap = useCallback(async () => {
    const installResult = await initiateICPSnap()
    if (!installResult.isSnapInstalled) {
      setInstalled(false)
    } else {
      setInstalled(true)
      setIdentity(await installResult.snap?.createSnapIdentity())
    }
  }, [])

  useEffect(() => {
    if (!identity) {
      installSnap()
    } else {
      factoryActorInit()
    }
  }, [identity])

  const factoryActorInit = async () => {
    const res = await getFactoryConnect(identity!)
    setFactoryConnect(res)
    // const result = await res.actor.get_wallet()
    // console.log("get wallet", result)
  }
  console.log("factoryConnect", factoryConnect)
  return (
    <>
      {installed ? (
        <Authorized
          identity={identity!}
          factoryConnect={factoryConnect!}
        />
      ) : (
        <Install handleInstall={installSnap} />
      )}
      <Footer />
    </>
  )
}
