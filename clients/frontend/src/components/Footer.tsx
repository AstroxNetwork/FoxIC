import React, { useEffect } from "react"
import twitter from "../assets/twitter.png"
import telegram from "../assets/telegram.png"
import discord from "../assets/discord.png"
import github from "../assets/github.png"
import mediu from "../assets/mediu.png"

type FooterProps = {
  location?: any
}

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <div className="footer">
      <p style={{ lineHeight: "30px" }}>AstroX© 2022</p>
      <div className="flex-1">
        <div className="flex justify-end">
          <a href="https://discord.com/invite/HpP5mvwJT2" target="_blank">
            <img src={discord} alt="" />
          </a>
          <a href="https://twitter.com/Astrox_Network" target="_blank">
            <img src={twitter} alt="" />
          </a>
          <a href="https://t.me/astrox_network" target="_blank">
            <img src={telegram} alt="" />
          </a>
          <a href="https://astrox.medium.com/" target="_blank">
            <img src={mediu} alt="" />
          </a>
          <a href="https://github.com/AstroxNetwork" target="_blank">
            <img src={github} alt="" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Footer
