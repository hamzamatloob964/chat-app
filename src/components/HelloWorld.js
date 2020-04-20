import React, {Component} from  'react'

// export default class HelloWorld extends Component{
//   constructor(props) {
//     super(props)
//     this.state = {
//       counter: 0,
//     }
//   }
//   addTwoNumbers = (x,y) => {
//     return x*y
//   }
//   render () {
//     return(
//       addTwoNumbers()
//     )

//   }
// }

export default function HelloWorld () {
  const  addTwoNumbers = (x,y) => {
    return x*y
  }
  return (
    addTwoNumbers()
  )
  
}
