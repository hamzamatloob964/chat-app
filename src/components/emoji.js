import React from 'react'
import '../App.css'
import { Tabs } from 'antd';
import Dashboard from '../components/dashboard'
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import { Button } from 'antd/lib/radio';
const { TabPane } = Tabs;

export default function Emoji () {
  return(
    <div className="emoji">
      <Tabs defaultActiveKey="2">
        <TabPane
          tab={
            <span>
              <AppleOutlined />
              Tab 1
              <Button onClick={() => <Dashboard username={"hello"}/>}>hello</Button>
            </span>
          }
          key="1"
        >
          Tab 1
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
    </div>
  )
}