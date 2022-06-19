import React from "react"
import { FOX, LOGO } from "../utils/resCont"

const Authorized = () => {
  return (
    <div className="container">
      <div className="flex align-items-end" style={{ marginTop: 40, marginBottom: 60 }}>
        <img
          src={FOX}
          style={{ width: 100, height: 76, marginRight: 10 }}
          alt=""
        />
        <div>
          <img src={LOGO} style={{ width: 92, height: 26 }} alt="" />
          <p style={{ color: "#B0B0B0" }}>
            MetaMask Flask wallet that allows you to send ICP and sign messages.
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="card">
          <h2>Principal ID</h2>
          <div className="flex">
            <p>qmlku-aijyc-ats74-o4a7r-6bki5-7xog2-ibu4o-4xi5o…</p>
            <a href="">COPY</a>
          </div>
        </div>
        <div className="card">
          <h2>Signature</h2>
          <p>{}</p>
        </div>
      </div>
    </div>
  )
}

export default Authorized
