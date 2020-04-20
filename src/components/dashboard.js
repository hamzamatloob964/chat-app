import React, {useState, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import '../App.css'
import firebase from '../firebaseConfig'
import { Button, Modal, Badge,Icon, Tabs, Input, Card, Avatar, AutoComplete, Layout } from  'antd';
import ChatLeftContent from './chatLeftContent'
import { useCookies } from 'react-cookie';
import {CloseCircleOutlined,AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import Firebase from '../firebaseConfig';
//import Emoji from '../components/emoji'
const axios = require('axios');
const { Search } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Header, Content, Footer, Sider } = Layout;

export default function Dashboard (props) {
  
  var history = useHistory()
  const [Cookies, setCookie, removeCookie] = useCookies(['saveUid'])
  const [usersList, setUsersList] = useState([])
  const [activeChatName, setActiveChatName] = useState('empty chat')
  const [activeStatus,setActiveStatus] = useState('')
  //const [rightChat, setRightChat] = useState([])
  var [chatMsgs, setChatMsgs] = useState([])
  const [msg, setMsg] = useState('')
  const [contactId, setContactId] = useState('')
  const [showChats, setShowChats] = useState([])
  const [FilemodalVisible, setFilemodalVisible] = useState(false)
  const [isTrue,setIsTrue] = useState(false)
  const [media, setMedia] = useState([])
  const [delMsg, setDelMsg] = useState('')
  const [delId, setDelId] = useState('')
  var [emoji, setEmoji] = useState('')
  const [isconfirm, setIsconfirm] = useState(false)
  var db = Firebase.firestore();
  var realTimeDb = firebase.database();
  var storage = firebase.storage();

  useEffect(() => {

    setStatus()
    contactList()

  },[])

  function setStatus () {

    realTimeDb.ref('.info/connected').on('value',async(snapshot) => {
  
      if(snapshot.val() === false){
        return;
      }
      realTimeDb.ref('users/'+Cookies.saveUid.id).onDisconnect().set({status:'offline'}).then(() => {

        realTimeDb.ref('users/'+Cookies.saveUid.id).set({status:'online'})

        db.collection('users').where('userId','==',Cookies.saveUid.id).get().then((data) => {
          data.forEach((item) => {
            db.collection('users').doc(item.id).update({
              status:'online'
            })
          })
        })
      })
    })
  }

  async function getUsers (value) {

    if(value){
      await db.collection("users").where('username','>=',value).where('username','<=',value+'\uf8ff').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let key = Math.random()
          let ele = ''
          ele = <Card key={key} onClick={() => openChat({name:doc.data().username,id:doc.data().userId})} hoverable={true} bordered={false} size="small" 
            style={{ height:80, width: AutoComplete, marginTop: 0 }} >
            <Meta
              className="white--text"
              avatar={
                <Avatar size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={doc.data().username}
              description={doc.data().email}
            />
          </Card>
  
          usersList.push(ele)
          setUsersList(usersList => [...usersList])
        });
      })
    }
  }

  async function sendMsg(url) {

    let checkUpdated = false;
    if(contactId){

      if (msg){
        //console.log("insude......")
  
        await db.collection("messages")
        .get().then(async(docu) => {
          docu.forEach(async(item) => {
  
            if(item.data().participants[0] === Cookies.saveUid.id && item.data().participants[1] === contactId){
              checkUpdated = true
              var arry = []
              arry = [...item.data().msgs]
              arry.push({text:msg, senderId:Cookies.saveUid.id, sendAt: new Date()})
              await db.collection("messages").doc(item.id).update({
                msgs: arry,
              })
              .then(async(docRef) => {

                await apiCallPushNOtification()

              })
              .catch(function(error) {
              });  
            }
  
            if(item.data().participants[1] === Cookies.saveUid.id && item.data().participants[0] === contactId){
  
              checkUpdated = true
              var arry1 = []
              arry1 = [...item.data().msgs]
              arry1.push({text:msg, senderId:Cookies.saveUid.id, sendAt: new Date()})
              await db.collection("messages").doc(item.id).update({
                msgs: arry1,
              })
              .then(async function(docRef) {
                await apiCallPushNOtification()
              })
              .catch(function(error) {
              });  
            }
          })
        })
        
        if(!checkUpdated){
  
          await db.collection("messages").doc().set({
            msgs: [{text:msg,senderId:Cookies.saveUid.id,sendAt: new Date()}],
            participants: [Cookies.saveUid.id,contactId],
          })
          .then(async function(docRef) {
            await apiCallPushNOtification()
          })
          .catch(function(error) {
          });
          createChatRoom(contactId)
        }
        // Alow messaging permission for push notifications
        alowNotifications()
        setMsg("");
      } 
      
      else if (url){
        //console.log("inside else if ...",url)
        await db.collection("messages")
        .get().then(async(docu) => {
          docu.forEach(async(item) => {
  
            if(item.data().participants[0] === Cookies.saveUid.id && item.data().participants[1] === contactId){
              checkUpdated = true
              var arry = []
              arry = [...item.data().msgs]
              arry.push({text:'', senderId:Cookies.saveUid.id, sendAt: new Date(),media:url})
              await db.collection("messages").doc(item.id).update({
                msgs: arry,
              })
              .then(async function(docRef) {
                await apiCallPushNOtification()
              })
              .catch(function(error) {
              });  
            }
  
            if(item.data().participants[1] === Cookies.saveUid.id && item.data().participants[0] === contactId){
              checkUpdated = true
              var arry1 = []
              arry1 = [...item.data().msgs]
              arry1.push({text:'', senderId:Cookies.saveUid.id, sendAt: new Date(),media:url})
              await db.collection("messages").doc(item.id).update({
                msgs: arry1,
              })
              .then(async function(docRef) {
                await apiCallPushNOtification()
              })
              .catch(function(error) {
              });  
            }
          })
        })
        
        if(!checkUpdated){
  
          await db.collection("messages").doc().set({
            msgs: [{text:'',senderId:Cookies.saveUid.id,sendAt: new Date(),media:url}],
            participants: [Cookies.saveUid.id,contactId],
          })
          .then(async function(docRef) {
            await apiCallPushNOtification()
          })
          .catch(function(error) {
          });
          createChatRoom(contactId)
        }
        alowNotifications()
      }
  
      contactList()
    }
  }

  function alowNotifications () {
    // Alow messaging permission for push notifications
    const messaging = firebase.messaging();
    messaging.requestPermission().then(() => {
      //console.log("inside first then ....")
      return messaging.getToken();
    }).then((token) => {
        db.collection('fcmTokens').doc(Cookies.saveUid.id).set({
          token_id:token
        })
        //console.log("inside second then ....",token)
    }).catch(err => {
        //console.log("err is : ",err)
    })
  }

  async function apiCallPushNOtification () {

    await db.collection('fcmTokens').doc(contactId).get().then(async(doc) => {
      if(doc.exists){
        //console.log("above notification......")
        let apiUrl = 'https://fcm.googleapis.com/fcm/send'
        let header =  {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer AAAAaqWhRgw:APA91bF9neUhhmXZqNHtPnloWvnZ9hiCX6guSyM2R-NwjpiSMnnGvaP-t_v0qESQMl6Xp261_IrDajJsKtu6J_bN98UzRekUqAVGJ3nMD3eCHP-DFYyerKf3oHYjFRf5lU8RUEHKY8Ge',
        }
        let data = {
          "to": doc.data().token_id,
          "data":{
            "message":msg.substring(0,30)+'...'
          },
          "webpush": {
            "headers": {
              "Urgency": "high"
            },
            "notification": {
              "body": "This is a message from FCM to web",
              "requireInteraction": "true",
              "badge": "/badge-icon.png"
            }
          }
        }

        await axios.post(apiUrl,data,{headers:header}).then((res) => {
          //console.log("api res : ",res)
        }).catch((err) => {
          //console.log("error is :",err)
        })
        
      }
    })
  }

  async function contactList () {

    var participantArray = []
    var uniqueArry = []
    var checkArry = []
    await db.collection("messages").where('participants','array-contains',Cookies.saveUid.id).get().then((doc) => {
      doc.forEach((item) => {
        if(item.data().participants[0] === Cookies.saveUid.id){
          participantArray.push(item.data().participants[1])
        } else {
          participantArray.push(item.data().participants[0])
        }
      })
    })
    for(let item of participantArray){
      if(uniqueArry.indexOf(item) === -1){
        uniqueArry.push(item)
      }
    }
    for(let item of uniqueArry){
      await db.collection("users").where('userId','==',item).get().then((doc1) => {
        doc1.forEach((data1) => {
          var list = <Card key={data1.id} onClick={() => openChat({name:data1.data().username,id:data1.data().userId})} hoverable={true} bordered={false} size="small" 
            style={{ height:80, width: AutoComplete, marginTop: 0 }} >
            <Meta
              className="white--text"
              avatar={
                <Avatar size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={data1.data().username}
              description={data1.data().email}
            />
          </Card>;
          checkArry.push(list);
        })
      })
    }
    setShowChats(checkArry)
  }

  async function openChat(obj){

    setContactId(obj.id)
    //setRightChat([])
    setActiveChatName(obj.name)

    await db.collection('users').where('userId','==',Cookies.saveUid.id).get().then((doc) => {
      doc.forEach((item) => {
      })
    })

    await db.collection("messages").where('participants','array-contains',obj.id).onSnapshot((doc) => {
      doc.forEach((item) => {
        if (item.data().participants[0] === Cookies.saveUid.id && item.data().participants[1] === obj.id){
          displayChatMsgs({data:item.data().msgs,id:obj.id})
        } 
        if (item.data().participants[0] === obj.id && item.data().participants[1] === Cookies.saveUid.id) {
          displayChatMsgs({data:item.data().msgs,id:obj.id})
        }
      })
    })
    getStatus(obj.id)
    history.push('/dashboard/adasdasdasda')
  }

  function getStatus (id) {
    realTimeDb.ref('users/'+id).on('value',(snapshot) => {
      setActiveStatus(snapshot.val().status)
    })
  }

  function displayChatMsgs (obj) {

    let arry = []
    for(let data of obj.data){
      if(data.senderId === Cookies.saveUid.id){
        if(!data.text && data.media){
          let splt = data.media[0].includes('.pdf')
          let key1 = Math.random()
          if(splt){
            arry.push( <div key={key1} style={{width:'300px',height:'30px',marginLeft:'auto',marginBottom:'10px',cursor:'pointer',position:'relative'}}>
            <CloseCircleOutlined onClick={() => deleteMsg({value:data.media[0],id:obj.id})} twoToneColor="blue" style={{position:'absolute',top:'5px',right:'10px',color:'red',fontSize:'20px'}} />
            <div onClick={() => window.open(data.media[0])} style={{backgroundColor:'#DCDCDC',color:'#008ECC',width:'100%', height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <b>PDF file</b></div>
            </div> )
            setChatMsgs([...arry])     
          } else{
              arry.push(<div key={key1} style={{width:'300px',height:'150px',marginLeft:'auto',marginBottom:'10px',cursor:'pointer',position:'relative'}}>
              <CloseCircleOutlined onClick={() => deleteMsg({value:data.media[0],id:obj.id})} twoToneColor="blue" style={{position:'absolute',top:'10px',right:'10px',color:'red',fontSize:'20px'}} />
              <img onClick={() => window.open(data.media[0])} style={{width:'100%',height:'100%'}} src={data.media[0]} alt=""></img>
              </div>)
              setChatMsgs([...arry])     
          }
        } else{
            let key1 = Math.random()
            arry.push( <div className="right-chat" key={key1} onClick={() => showDelDialog({value:data.text,id:obj.id})}>
              <p id="p1" className="right-chat-para">
                {data.text}
              </p>
              </div> )
            setChatMsgs([...arry])   
        }
      }
      if(data.senderId === obj.id){
        if(!data.text && data.media){
          let splt2 = data.media[0].includes('.pdf')
          let key2 = Math.random()
          if(splt2){
            arry.push(<div onClick={() => window.open(data.media[0])} key={key2} style={{width:'300px',height:'30px',marginRight:'auto',marginBottom:'10px',cursor:'pointer'}}>
            <Button style={{backgroundColor:'#DCDCDC',border:'none',color:'#008ECC',width:'100%', height:'100%'}} onClick={() => window.open(data.media[0])}><b>PDF file</b></Button>
            </div>)
            setChatMsgs([...arry])     
          } else{
              arry.push(<div onClick={() => window.open(data.media[0])} key={key2} style={{width:'300px',height:'150px',marginRight:'auto',marginBottom:'10px',cursor:'pointer'}}>
              <img style={{width:'100%',height:'100%'}} src={data.media[0]} alt=""></img>
            </div>)
              setChatMsgs([...arry])     
          }
        } else{
            let key3 = Math.random()
            arry.push(<ChatLeftContent key={key3} message={data.text}/>)
            setChatMsgs([...arry])
        }
      }
    }
  }
  function showDelDialog (obj) {
    //console.log("del text message .....")
    setDelMsg(obj.value)
    setDelId(obj.id)
    setIsTrue(true)
  }
  async function deleteMsgSubFunc (obj){
  
    var docId = obj.docID
    var arry = []
    var finalArr = []
    for(let data of obj.msgArry ){
      if(data.text === obj.value){
        arry = [...obj.msgArry]
        for(let item of arry){
          if(item.text !== obj.value || !item.text){
            finalArr.push(item)
          }
        }
        await db.collection("messages").doc(docId).update({
          msgs: [...finalArr]
        })
      }

      if(data.media && data.media[0] === obj.value){
        arry = [...obj.msgArry]
        for(let item of arry){
          if(item.media[0] !== obj.value || !item.media){
            finalArr.push(item)
          }
        }
        await db.collection("messages").doc(docId).update({
          msgs: [...finalArr]
        })
        await storage.refFromURL(obj.value).delete()
      }
    }
  }
  function deleteMsg (obj) {
    setIsTrue(false)
    var value = obj.value
    var id = obj.id
    db.collection("messages").where('participants','array-contains',id).get().then((doc) => {
      doc.forEach((item) => {
        if (item.data().participants[0] === Cookies.saveUid.id && item.data().participants[1] === id){
          deleteMsgSubFunc({value:value,docID:item.id,msgArry:item.data().msgs})
        } 
        if (item.data().participants[0] === id && item.data().participants[1] === Cookies.saveUid.id) {
          deleteMsgSubFunc({value:value,docID:item.id,msgArry:item.data().msgs})
        }
      })
    })
  }
  async function createChatRoom (contactId) {
    var userDocId = ''
    let contactDocId = ''
    var arry = []
    var arry2 = []

    await db.collection("users")
    .where('userId','==',Cookies.saveUid.id)
    .get().then((doc1) => {
      doc1.forEach((data) => {
        arry = data.data().chatRoom
        userDocId = data.id
      })
    })
    arry.push(contactId)

    await db.collection("users")
    .where('userId','==',contactId)
    .get().then((doc1) => {
      doc1.forEach((data) => {
        arry2 = data.data().chatRoom
        contactDocId = data.id
      })
    })
    arry2.push(Cookies.saveUid.id)

    await db.collection("users")
    .doc(userDocId)
    .update({
      chatRoom : arry
    }).then(() => {
    })

    await db.collection("users")
    .doc(contactDocId)
    .update({
      chatRoom : arry2
    }).then(() => {
    })
  }
  function handleChange (e) {
    if(e.target.files[0]){
      setMedia([...e.target.files])
    }
  }

  function showEmoji () {

    let smilie = ''
    for(let i=128512; i<=128567; i++){
      smilie+=`<a>${String.fromCodePoint(i)}</a>`
    }
    //smilie = `<a>${String.fromCodePoint(128512)}</a>`
    //console.log("smilie out is : ....",smilie)
    //let val2 = String.fromCodePoint(128512)
    //let val = `<p>${val2}</p>`

    (emoji) ? setEmoji(''): setEmoji(
      <div className="emoji">
        <Tabs defaultActiveKey="2">
          <TabPane
            tab={
              <span>
                <AppleOutlined />
                Tab 1
              </span>
            }
            key="1"
          >
            <div style={{display:'flex'}}>{smilie}<p>hello</p></div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <AndroidOutlined />
                Tab 2
              </span>
            }
            key="2"
          >
            Tab 2
          </TabPane>
        </Tabs>,
      </div>)
  }

  async function handleUpload () {

    if(media){
      setIsconfirm(true)

      for(let item of media){
        await storage.ref(`media/${item.name}`).put(item).on('state_changed',
        (snapshot) =>{
          //progress function
        },
        (err) => {
          console.log(err)
        },
        async () => {
          await storage.ref('media').child(item.name).getDownloadURL().then( url => {
            let mediaUrl = []
            mediaUrl.push(url)
            sendMsg(mediaUrl)
            setFilemodalVisible(false)
          })
        })
      }
    }

  }

  async function logout(){
    await db.collection('users').where('userId','==',Cookies.saveUid.id).get().then((doc) => {
      doc.forEach(async (data) => {
        await db.collection('users').doc(data.id).update({
          status: 'offline'
        }).then((res) => {
        })
      })
    })
    await realTimeDb.ref('users/'+Cookies.saveUid.id).set({
      status:'offline'
    }).then((res) => {
    })
    await removeCookie('saveUid')
    history.push('/')
  }
  return (
    <div >
      <Layout >
        <Sider
          width='230'
          breakpoint="md"
          collapsedWidth="0"
          onBreakpoint={broken => {
          }}
          onCollapse={(collapsed, type) => {
          }}
        >
          <Tabs defaultActiveKey="1" >
            <TabPane
              tab={
                <span onClick={contactList} >
                  <Icon type="user" />
                  chats
                </span>
              }
              key="1"
            >
              {/* <div className="logo" /> */}
              <div className="chat-panel" >
                <div style={{marginTop:16}}></div>
                {showChats}
              </div>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Icon type="search" />
                  search
                </span>
              }
              key="2"
            >
              <div className="searchBar">
                <Search
                  placeholder="search contact"
                  onSearch={(value) => getUsers(value)}
                  style={{ width: 210, marginLeft:10, color:'#0094d5' }}
                />
              </div>
              <div className="searched-contacts" >
                {usersList.map((value) => {return value})}
              </div>
            </TabPane>
          </Tabs>
        </Sider>
        {/* <Divider style={{margin:0, padding:0}} type='vertical' /> */}
        <Layout style={{backgroundColor:'#fff'}}>
          <Header style={{ height:55, display:'flex', background: '#ff9c00', padding: 0 }} >
            <div style={{height:50, marginLeft:20}}>
              <Avatar 
              style={{backgroundColor:'#ff9c00', marginBottom:10}}
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              <Badge color={(activeStatus === 'online') ? '#87d068' : 'gray'} dot style={{top: 5, right:5}} />
              {/* <Badge color='#87d068' dot style={{top: 5, right:5}} /> */}
            </div>
            <div style={{marginTop:4, height:50, marginRight:5, display:'flex', 
            flexDirection:'column', justifyContent: 'center'}}>
              <span className="lh-0" style={{color:'#00112a'}}><b>{activeChatName}</b></span>
              <span className="lh-0" style={{color:'#191919', fontSize:'12px'}}>
              {activeStatus}</span>
            </div>
            <div className="userName"><b>{Cookies.saveUid && Cookies.saveUid.name}</b></div>
            <Button onClick={logout} style={{border:'none',backgroundColor:'#00112a',color:'#ff9c00',marginTop:'15px',marginRight:'10px'}}>Logout</Button>
          </Header>
          {/* <Divider style={{margin:0, padding:0}} type='horizontal' /> */}
          <Content style={{ margin: '24px 0px 0' }}>
            <div id="main-content" className="main-content">
              
              {
                chatMsgs.map((data) => 
                (data))
              }
              {props.username}

            </div>
          </Content>
          {/* <Divider style={{margin:0, padding:0}} type='horizontal' /> */}
          <Footer style={{ backgroundColor:'#f7f5fc', height:80, position:'relative'}}>
            {emoji}
            <div className="footer">
              <Button style={{ border:'none', marginLeft:5, padding:5}} onClick={showEmoji}>
                <Icon style={{ fontSize: '20px', color: '#ff9c00' }} type="smile" />
              </Button>
              <Button style={{border:'none', margin:0, padding:5}} onClick={() => {setFilemodalVisible(true);setEmoji('')}}>
                <Icon style={{ fontSize: '22px', color: '#808080' }} type="paper-clip" />
              </Button>
              <Modal
                title="Please select file to upload"
                centered
                visible={FilemodalVisible}
                onOk={handleUpload}
                onCancel={() => setFilemodalVisible(false)}
                okText='Upload'
                confirmLoading={isconfirm}
              >
                <input type='file' onChange={handleChange} multiple={true}></input>
              </Modal>

              <Modal
                title="Delete messsage"
                centered
                visible={isTrue}
                onOk={() => deleteMsg({value:delMsg,id:delId})}
                onCancel={() => setIsTrue(false)}
                okText='Yes'
              >
                <span>Please click yes to delete message</span>
              </Modal>

              <Input  value={msg} id="input" onInput={e => setMsg(e.target.value) } color="#ff9c00" style={{marginLeft:5, border:'none'}} 
              placeholder="Type message..." onPressEnter={() => sendMsg()} />
              <Button onClick={() => sendMsg()} style={{marginLeft:2, border:'none', backgroundColor:'#fff'}}>
                <i className=" send-icon material-icons">send</i>
              </Button>
            </div>
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}
