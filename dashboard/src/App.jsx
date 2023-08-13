import React from 'react';
import { Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';
import './index.css';
import './demo.css';
import { NotificationProvider } from './pages/hook/useNotification';
import Notification from './pages/models/Notification';
import Domain from './pages/Bots/Domain';
import Intents from './pages/Bots/Intents';
import Entity from './pages/Bots/Entity';
import Login from './pages/Login';
import ChatbotMessages from './pages/Bots/Messages';
import ReplyMessage from './pages/Bots/Reply';
import Users from './pages/Users/Users';
function App() {
  const routes = [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/dashboard',
      component: Dashboard,
    },
    {
      path : 'messages',
      component : ChatbotMessages,
    }
    ,{
      path : 'domain',
      component : Domain,
    }
    ,{
      path : 'intents',
      component : Intents,
    }
    ,{
      path : 'entity',
      component : Entity,
    },{
      path : '/reply/:id',
      component : ReplyMessage,
    },{
      path : '/users',
      component : Users,
    }
  ]
  return (<>
    <NotificationProvider >
    <Notification />
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<route.component />}
        />
      ))}
      <Route path="*" element={<Dashboard />} />
    </Routes> 
    </NotificationProvider>
  </>
    
  )
}

export default App
