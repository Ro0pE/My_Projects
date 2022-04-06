import './css/header.css'
import './css/menubar.css'
//import './css/renovations.css'
import {React ,useMemo,useTable, useEffect, useState } from "react"
import Vehicles from './components/Vehicles/vehicles'
import Header from './components/Header.js'
import Menubar from './components/Menubar.js'
import Kitchen from "./components/Kitchen/Kitchen.js"
import Freezer from "./components/Kitchen/Freezer.js"
import ShoppingList from "./components/Kitchen/ShoppingList.js"
import Renovations from "./components/Renovations/Renovations.js"
import Maintenances from "./components/Maintenances/Maintenances.js"
import Money from "./components/Money/Money"
import Login from "./components/Login/Login"
import CreateUserView from './components/Login/CreateUserView'
import LogOut from './components/Login/LogOut'
import renovationServices from './services/renovations'
import maintenanceServices from './services/maintenances'
import completedMaintenanceServices from './services/completedMaintenances'
import { Switch, Route } from 'react-router'
import './css/login.css'
import './css/table.css'
import './css/renovations.css'
import './css/maintenances.css'










const App = () => {

  
  
  const [user, setUser] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userID, setUserID] = useState('')
  const [loggedInUser, setLoggedInUser] = useState('')
  const [taskList, setTaskList] = useState([])
  const [completedTasks,setCompletedTasks] = useState([])
  const [renovations, setRenovations] = useState([])
  const [showCreateUserForm,setShowCreateUserForm] = useState(false)
  const [loginStatus, setLoginStatus] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationButtons, setNotificationButtons] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  const [notificationType, setNotificationType] = useState('')


  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser === 'undefined') {
      window.localStorage.removeItem('loggedUser')
      setLoginStatus(false)
      return
    }
    if (loggedUser) {
        const user = JSON.parse(loggedUser)
        setUser(user)
        setLoggedInUser(user)
        setLoginStatus(true)
                 
        renovationServices.setToken(user.token)
        maintenanceServices.setToken(user.token)
        completedMaintenanceServices.setToken(user.token)
        
    }
},[])


  useEffect(() => {

    renovationServices
    .getRenovations()
    .then(reno => {
        setRenovations(reno)
    })

  },[])



  
  useEffect(() => {

    completedMaintenanceServices
    .getCompletedMaintenances()
    .then(maintenance => {
        setCompletedTasks(maintenance)
    })

  },[])

    
  useEffect(() => {

    maintenanceServices
    .getMaintenances()
    .then(maintenance => {
        setTaskList(maintenance)
    })

  },[])




    const toggleShowCreateUserForm = () => {
      setShowCreateUserForm(!showCreateUserForm)
    }
    const buttonToShow =() => { // implement this

      if (loginStatus === false ){
        return (
          <button>Create a new user</button>
        )
      }

      if (loginStatus === true) {
        return (
          <button> logout</button>
        )
    } else if (loginStatus === false) {
      return (
        <button>login</button>
      )
    }
  }

  const showLoginAndCreate = () => {
      if (loggedInUser){
        return 
      } else {
        return (
          <div className='loginPosition'>
          <button className="showLoginCreateUserButton" onClick={toggleShowCreateUserForm}>
          {showCreateUserForm === true ? <p className='loginText'>Login</p> : <p className='createNewUserText'>CREATE A NEW USER</p>}</button>
          </div>
        )
      }
  }


// REFACTOR THIS
  return (
    <div className='backGround'>
      
      {loginStatus === true &&
       <LogOut notificationType={notificationType} setNotificationType={setNotificationType} confirmation={confirmation} setConfirmation={setConfirmation} notificationButtons={notificationButtons} setNotificationButtons={setNotificationButtons} notificationMessage={notificationMessage} setNotificationMessage={setNotificationMessage} loginStatus={loginStatus}setLoginStatus={setLoginStatus}loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} user={user} setUser={setUser}/>
}

      {loginStatus === true &&
      <Menubar user={user} setUser={setUser}/>
}    
      <Header />
      {showLoginAndCreate()}
      <Switch>
      {loginStatus === true &&
        <Route path ="/kitchen">
          <Kitchen />
        </Route>
}
      {loginStatus === true &&
        <Route path ="/vehicles">
          <Vehicles />
        </Route>
}
      {loginStatus === true &&
        <Route path="/freezer">
          <Freezer />
          </Route>
}
      {loginStatus === true &&
        <Route path="/shoppinglist">
          <ShoppingList />
        </Route>
}
      {loginStatus === true &&
        <Route path="/renovations">
          <Renovations notificationType={notificationType} setNotificationType={setNotificationType} confirmation={confirmation} setConfirmation={setConfirmation} notificationButtons={notificationButtons} setNotificationButtons={setNotificationButtons} notificationMessage={notificationMessage} setNotificationMessage={setNotificationMessage} renovations={renovations} setRenovations={setRenovations} user={user} setUser={setUser}/>
        </Route>
}
      {loginStatus === true &&
        <Route path="/maintenances">
          <Maintenances notificationMessage={notificationMessage} setNotificationMessage={setNotificationMessage} notificationType={notificationType} setNotificationType={setNotificationType} completedTasks={completedTasks} setCompletedTasks={setCompletedTasks} taskList={taskList} setTaskList={setTaskList} user={user} setUser={setUser}/>
        </Route>
}
      {loginStatus === true &&
        <Route path="/Money" >
          <Money completedTasks={completedTasks} setCompletedTasks={setCompletedTasks} setTaskList={setTaskList} setRenovations={setRenovations} renovations={renovations} taskList={taskList}/>
        </Route>
}    
        <Route path ="/">
        {loginStatus === false &&  showCreateUserForm === false &&
          <Login notificationType={notificationType} setNotificationType={setNotificationType} confirmation={confirmation} setConfirmation={setConfirmation} notificationButtons={notificationButtons} setNotificationButtons={setNotificationButtons} notificationMessage={notificationMessage} setNotificationMessage={setNotificationMessage} showCreateUserForm={showCreateUserForm} setShowCreateUserForm={setShowCreateUserForm} loginStatus={loginStatus} setLoginStatus={setLoginStatus} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} username={username} setUsername={setUsername} password={password} setPassword={setPassword} user={user} setUser={setUser} />
} 
          {showCreateUserForm && (
            <CreateUserView notificationType={notificationType} setNotificationType={setNotificationType} confirmation={confirmation} setConfirmation={setConfirmation} notificationButtons={notificationButtons} setNotificationButtons={setNotificationButtons} notificationMessage={notificationMessage} setNotificationMessage={setNotificationMessage} setShowCreateUserForm={setShowCreateUserForm} setLoginStatus={setLoginStatus} user={user} setLoggedInUser={setLoggedInUser} username={username} setUsername={setUsername} password={password} setPassword={setPassword} user={user} setUser={setUser}/>
          )}
          

        </Route>
      </Switch>
      <div className="bottom">
            
      </div>

    </div>
  )

}





export default App
