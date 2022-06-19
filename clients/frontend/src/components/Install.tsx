
import React from 'react';
import LOGO from "../assets/logo.png"
import FOX from '../assets/fox.png';
import { METAMASK_FLASK } from "../config"
import Footer from './Footer';


const Install = (props) => {
  return (
    <div className="container">
      <div className="header">
        <img src={LOGO} alt="" />
        <div className='flex flex-1 justify-end align-items-center'>
          <p>
            Please ensure you have Metamask Flask<br></br> Installed for this
            example.Click here to install.
          </p>
          <a href={METAMASK_FLASK} className="button-default" target="_blank">
            Install
          </a>
        </div>
      </div>
      <div className="flex" style={{marginTop: '20vh'}}>
        <img src={FOX} alt="" style={{ padding: '0 70px'}}/>
        <div className="">
          <h1><span className='c_brand'>MetaMask</span> Flask wallet that allows you to send ICP and sign messages.</h1>
          <a className="button-primary" onClick={props.handleInstall}>Connect to FoxIC</a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Install
