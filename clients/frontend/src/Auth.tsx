import React, { useCallback, useEffect, useState } from "react"
import { AuthClient } from "@dfinity/auth-client"
import dfinityLogo from "./assets/dfinity.svg"
import { initiateICPSnap } from "./services/metamask"
import { ICPSnapApi } from "@astrox/icsnap-types"
import { connection } from "./services/connection"
// import connection from ''

// Note: This is just a basic example to get you started
function Auth() {
  const [signedIn, setSignedIn] = useState<boolean>(false)
  const [principal, setPrincipal] = useState<string>("")
  const [client, setClient] = useState<any>()
  const [api, setApi] = useState<ICPSnapApi | undefined>(undefined)

  // const initAuth = async () => {
  //   const client = await AuthClient.create()
  //   const isAuthenticated = await client.isAuthenticated()

  //   setClient(client)

  //   if (isAuthenticated) {
  //     const identity = client.getIdentity()
  //     const principal = identity.getPrincipal().toString()
  //     setSignedIn(true)
  //     setPrincipal(principal)
  //   }
  // }

  // const signIn = async () => {
  //   const { identity, principal } = await new Promise((resolve, reject) => {
  //     client.login({
  //       identityProvider: "https://identity.ic0.app",
  //       onSuccess: () => {
  //         const identity = client.getIdentity()
  //         const principal = identity.getPrincipal().toString()
  //         resolve({ identity, principal })
  //       },
  //       onError: reject,
  //     })
  //   })
  //   setSignedIn(true)
  //   setPrincipal(principal)
  // }

  const signOut = async () => {
    await connection.actor.greeting('1')
    await client.logout()
    setSignedIn(false)
    setPrincipal("")
  }

  const installSnap = useCallback(async () => {
    const installResult = await initiateICPSnap()
    if (!installResult.isSnapInstalled) {
      console.log("no install aa")
    } else {
      console.log("installed")

      const principal = await (
        await installResult.snap?.getICPSnapApi()
      )?.getPrincipal()
      console.log({ principal })
    }
  }, [])

  useEffect(() => {
    // initAuth()
    installSnap()
  }, [])

  return (
    <div className="auth-section">
      {!signedIn && client ? (
        <button onClick={installSnap} className="auth-button">
          Sign in
          <img
            style={{ width: "33px", marginRight: "-1em", marginLeft: "0.7em" }}
            src={dfinityLogo}
          />
        </button>
      ) : null}

      {signedIn ? (
        <>
          <p>Signed in as: {principal}</p>
          <button onClick={signOut} className="auth-button">
            Sign out
          </button>
        </>
      ) : null}
    </div>
  )
}

export { Auth }
