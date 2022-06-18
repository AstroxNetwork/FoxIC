import { SnapRpcMethodRequest } from "@astrox/icsnap-types"
import { MetamaskICPSnap, enableICPSnap } from "@astrox/icsnap-adapter"

export const defaultSnapId = "local:http://localhost:8081"

let isInstalled: boolean = false

export interface SnapInitializationResponse {
  isSnapInstalled: boolean
  snap?: MetamaskICPSnap
}

export async function initiateICPSnap(): Promise<SnapInitializationResponse> {
  // const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : defaultSnapId
  const snapId = defaultSnapId
  try {
    console.log("Attempting to connect to snap...")

    const metamaskICPSnap = await enableICPSnap({ network: "local" }, snapId, {
      version: "latest",
    })
    isInstalled = true
    console.log("Snap installed!")
    return { isSnapInstalled: true, snap: metamaskICPSnap }
  } catch (e) {
    console.error(e)
    isInstalled = false
    return { isSnapInstalled: false }
  }
}

export async function isICPSnapInstalled(): Promise<boolean> {
  return isInstalled
}
