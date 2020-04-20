import React,{useState} from 'react'
import firebase from '../firebaseConfig'
import { useHistory, Link } from "react-router-dom";
import { Form, Icon, Input, Button, Alert } from 'antd';
import { useCookies } from 'react-cookie';
//const functions = require('firebase-functions');

function NormalLoginForm (props) {

  const [Cookies, setCookie] = useCookies(['saveUid'])
  const [alertBool, setAlertBool] = useState(<div></div>)
  const [isconfirm, setIsconfirm] = useState(false)
  var history = useHistory();
  var db = firebase.firestore();
  var realTimeDb = firebase.database();
  const { getFieldDecorator } =props.form;

  const handleSubmit = e => {
    e.preventDefault();
    setIsconfirm(true)
    props.form.validateFields((err, values) => {
      if (!err) {
        firebase.auth().signInWithEmailAndPassword(values.email, values.password)
        .then(async(res) => {
          await setCookie('saveUid',{id:firebase.auth().currentUser.uid,name:firebase.auth().currentUser.displayName})
          await setStatus(firebase.auth().currentUser.uid)
          //await pushNotification(firebase.auth().currentUser.uid)
          history.push('dashboard')
        })
        .catch(function(error) {
          var errorMessage = error.message;
          console.log('Error in authentication ', errorMessage);
          setAlertBool(<Alert  
          message="Authentication Failed !"
          description="Your Authentication has been failed due to incorrect password or email."
          type="error"
          showIcon
          />)
        });
      }
    });
  };

  // const add = (x,y) {
  //   return x*y
  // }

  // function pushNotification (id) {
  //   console.log("push notifications fun called ....")
  //   const messaging = firebase.messaging();
  //   messaging.requestPermission().then(() => {
  //     console.log("inside first then ....")
  //     return messaging.getToken();
  //   }).then((token) => {
  //     console.log("inside second then ....")
  //     db.collection('fcmTokens').doc(id).set({
  //       token_id:token
  //     })
  //   }).catch(err => {
  //     console.log("err is : ",err)
  //   })
  // }

  async function setStatus(id) {
    var docId = ''
    await db.collection('users').where('userId','==',id).get().then((doc) => {
      doc.forEach((data) => {
        docId = data.id
      })
    })
    await db.collection('users').doc(docId).update({
      status: 'online'
    }).then((res) => {
      console.log("status updated.....")
    })
    await realTimeDb.ref('users/'+id).set({
      status:'online'
    }).then((res) => {
      console.log("status set in real time database")
    })
  }

  return (
    <div className="register-main">
      <div className="register-title"><h3><span style={{color:'#ff9c00'}}>Login</span></h3></div>
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input
              type="email"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item className="login-btn">
          <Button loading={isconfirm} type="primary" htmlType="submit" className="login-form-button">
            Login
          </Button>
          Or <Link to="/register"> Register Now ! </Link>
        </Form.Item>
      </Form>
      {alertBool}
    </div>
  )
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default WrappedNormalLoginForm;