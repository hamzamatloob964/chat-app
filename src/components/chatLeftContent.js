import React from 'react'
import { Avatar } from 'antd'
import '../App.css'

export default function chatLeftContent (props) {
  //const name = "hello my name is hamza and i am from lahore afadd afaf asfasfa afafa fwefwef fwefwe fwefwe fwefw"
  return (
      <div className="left-chat">
        <Avatar 
          style={{backgroundColor:'#ff9c00', marginTop:5}}
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        <p id="p1" className="left-chat-para">
        {props.message}</p>
      </div>
  )
}