import { ICPSnapApi, SnapRpcMethodRequest } from "@astrox/icsnap-types"
import {
  MetamaskICPSnap,
  enableICPSnap,
  SnapIdentity,
} from "@astrox/icsnap-adapter"
import { Secp256k1KeyIdentity } from "@dfinity/identity"

// export const defaultSnapId = "local:http://localhost:8082"
export const defaultSnapId = "npm:@astrox/icsnap"

let isInstalled: boolean = false

export interface SnapInitializationResponse {
  isSnapInstalled: boolean
  api?: ICPSnapApi
  identity?: SnapIdentity
  // snap?: MetamaskICPSnap
  // delegationChainString?: string
  // sessionKey?: Secp256k1KeyIdentity
}

export async function initiateICPSnap(): Promise<SnapInitializationResponse> {
  const snapId = process.env.SNAP_ID
  // const snapId = defaultSnapId
  try {
    console.log("Attempting to connect to snap...")
    const sessionKey = Secp256k1KeyIdentity.generate()
    const metamaskICPSnap = await enableICPSnap({
      config: { network: "local" },
      snapOrigin: snapId,
      snapInstallationParams: {
        version: "latest",
      },
      sessionPublicKey: sessionKey.getPublicKey(),
    })
    isInstalled = true
    console.log("Snap installed!")
    const api = await metamaskICPSnap.snap.getICPSnapApi()
    return {
      isSnapInstalled: true,
      api,
      identity: new SnapIdentity(
        api,
        metamaskICPSnap.delegationChainString,
        sessionKey,
      ),
    }
  } catch (e) {
    console.error(e)
    isInstalled = false
    return { isSnapInstalled: false }
  }
}

export async function isICPSnapInstalled(): Promise<boolean> {
  return isInstalled
}
