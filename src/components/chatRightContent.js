import React from 'react'
import '../App.css'

export default function chatRightContent (props) {
  const name = "hello my name is hamza and i am from lahore afadd afaf asfasfa afafa fwefwef fwefwe fwefwe fwefw"
  return (
      <div className="right-chat">
        <p id="p1" className="right-chat-para">
        {props.message}
        </p>
      </div>

  )
}