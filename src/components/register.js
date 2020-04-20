import React,{useState} from 'react'
import firebase from '../firebaseConfig'
import { Link } from "react-router-dom";
import { Form, Icon, Input, Button, Alert } from 'antd';

function NormalLoginForm (props) {
  const [alertBool, setAlertBool] = useState(<div></div>)
  //var history = useHistory();
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
        .then(() => {
          let user = firebase.auth().currentUser
          // store current user data in auth  
          user.updateProfile({
            displayName: values.username,
          }).then(function() {
            console.log("username updated successfully !")
          }).catch(function(error) {
            console.log("username updated error !")
          });
          // store all register users in db
          let db = firebase.firestore();
          db.collection("users").add({
            username: values.username,
            userId: firebase.auth().currentUser.uid,
            email: values.email
          })
          .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });

          setAlertBool(<Alert  
            message="Registeration succeded !"
            description="Your Registeration has been done go to Login page."
            type="success"
            showIcon
            />)
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorMessage = error.message;
          console.log('Error in registering in firebase: ', errorMessage);
          setAlertBool(<Alert  
            message="Registeration Failed !"
            description="Your Registeration has been failed due to server error try again later."
            type="error"
            showIcon
            />)
          // ...
        });
        console.log('Received values of form: ', values);
      }
    });
  };
  return (
    <div className="register-main">
      <div className="register-title"><h3>Register</h3></div>
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' },
            ],
          })(
            <Input
              type="email"
              prefix={<Icon type="email" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
          <Button type="primary" htmlType="submit" className="login-form-button">
            Register
          </Button>
          Or <Link to="/"> Back to Login </Link>
        </Form.Item>
      </Form>
      {alertBool}
    </div>
  )
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default WrappedNormalLoginForm;