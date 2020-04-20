import React from 'react';
import Dashboard from './components/dashboard'
import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router,Switch,Route } from "react-router-dom";
import Register from './components/register'
import Login from './components/login'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <Route path='/dashboard' exact component={Dashboard} />
        <Route path='/dashboard/:id' exact component={Dashboard} />
        {/* <Dashboard></Dashboard> */}
      </Switch>
    </Router>
  );
}

export default App;
