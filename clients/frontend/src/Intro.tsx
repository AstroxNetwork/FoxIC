import React, { useCallback, useEffect, useRef, useState } from "react"
import { initiateICPSnap } from "./services/metamask"

import Install from "./components/Install"
import Authorized from "./components/Authorized"
import Footer from "./components/Footer"
import { CreateActorResult, getFactoryConnect } from "./services/connection"
import { _SERVICE as factory_SERVICE } from "./candid/foxic_factory"
import { SnapIdentity } from "@astrox/icsnap-adapter"

export function Intro() {
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
      setIdentity(installResult.identity!)
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
  }
  return (
    <>
      {installed ? (
        <Authorized identity={identity!} factoryConnect={factoryConnect!} />
      ) : (
        <Install handleInstall={installSnap} />
      )}
      <Footer />
    </>
  )
}
