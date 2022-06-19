import React, { useEffect } from "react"
import { Auth } from "./Auth"
import { Intro } from "./Intro"
import { connection } from "./services/connection"

function App() {
  useEffect(() => {
    init()
  },[])
  const init = async () => {
    // await connection.actor.greeting('1')
  }
  return (
    <div className="container">
      <Intro />
    </div>
  )
}

export default App
