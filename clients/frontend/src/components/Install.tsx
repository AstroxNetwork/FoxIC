import React, { useState } from "react"
import LOGO from "../assets/logo.png"
import FOX from "../assets/fox.png"
import FOX_ANIMATE from "../assets/FOXIC.json"
import Lottie from "react-lottie"
import { METAMASK_FLASK } from "../config"
import {
  ICON_CLOSE,
  ICON_METAMASK_FLASH,
  ICON_OPEN,
  METAMASK,
} from "../utils/resCont"

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: FOX_ANIMATE,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
}

type InstallModalProps = {
  onClose: () => void
}

const InstallModal = (props) => {
  return (
    <div className="install-modal">
      <h1 className="c_grey" style={{ fontSize: 30 }}>
        1.
      </h1>
      <h2 className="mg_b_30">
        Install{" "}
        <a
          href={METAMASK_FLASK}
          target="_blank"
          className="c_brand"
          style={{ textDecoration: "underline" }}
        >
          MetaMask Flask
        </a>
      </h2>
      <h1 className="c_grey" style={{ fontSize: 30 }}>
        2.
      </h1>
      <h2>Create a new account</h2>
      <p className="c_grey mg_b_30">
        Follow the instructions in MetaMask Flask to create a new account and
        save your recovery phrase{" "}
        <strong className="c_brand">(IMPORTANT!)</strong>.
      </p>
      <h1 className="c_grey" style={{ fontSize: 30 }}>
        3.
      </h1>
      <h2>Plugin settings</h2>
      <div className="flex mg_b_30">
        <div className="flex-1">
          <div className="flex align-items-end">
            <div>
              <img src={METAMASK} alt="" style={{ width: 32, height: 30 }} />
              <p>Turn off your</p>
            </div>
            <div>
              <img src={ICON_CLOSE} alt="" style={{ width: 24, height: 14 }} />
              <p>
                <span style={{ color: "orange" }}>&nbsp;MetaMask</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex align-items-end">
            <div>
              <img
                src={ICON_METAMASK_FLASH}
                alt=""
                style={{ width: 32, height: 30 }}
              />
              <p>Turn off your </p>
            </div>
            <div>
              <p style={{ textAlign: "left" }}>
                <img src={ICON_OPEN} alt="" style={{ width: 24, height: 14 }} />
              </p>
              <p>
                <span style={{ color: "#A167FF" }}>&nbsp;MetaMask FLASH</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <h1 className="c_grey" style={{ fontSize: 30 }}>
        4.
      </h1>
      <h2>Connect MetaMask Flask</h2>
      <p className="c_grey">
        Refresh the website and click the "Connect" button.
      </p>
      <a
        className={`button-primary button-block`}
        style={{ marginTop: 50 }}
        onClick={props.onClose}
      >
        Close
      </a>
    </div>
  )
}

const Install = (props) => {
  const [visible, setVisible] = useState(false)
  return (
    <div className="container">
      <div className="header">
        <img src={LOGO} alt="" />
        <div className="flex flex-1 justify-end align-items-center">
          <div>
            <p className="">
              Please ensure MetaMask Flask{" "}
              <img
                src={ICON_METAMASK_FLASH}
                style={{ margin: "0 5px", width: 20, height: 20 }}
              />{" "}
              is installed.
            </p>
            <p className="">
              Please turn off your MetaMask{" "}
              <img
                src={METAMASK}
                style={{ margin: "0 5px", width: 20, height: 20 }}
              />{" "}
              before run.
            </p>
          </div>

          <a href={METAMASK_FLASK} className="button-default" target="_blank">
            Install
          </a>
        </div>
      </div>
      <div className="flex" style={{ marginTop: "20vh" }}>
        {/* <img src={FOX} alt="" style={{ padding: '0 70px'}}/> */}
        <div style={{ padding: "0 70px" }}>
          <Lottie width={300} height={230} options={defaultOptions} />
        </div>
        <div className="">
          <h1>
            <span className="c_brand">MetaMask</span> Flask allows you to sign
            messages and interact with IC.
          </h1>
          <a
            className="button-primary"
            style={{ marginTop: 25 }}
            onClick={props.handleInstall}
          >
            Connect to FoxIC
          </a>
          <a
            className="button-default"
            style={{ marginTop: 25, width: 198 }}
            onClick={() => setVisible(true)}
          >
            How to connect ?
          </a>
        </div>
      </div>
      <div className={`modal ${visible ? "show" : ""}`}>
        <div className={`modal-content modal-big`}>
          <InstallModal onClose={() => setVisible(false)} />
        </div>
      </div>
    </div>
  )
}

export default Install
