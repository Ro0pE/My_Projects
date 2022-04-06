import { useState, useEffect } from "react"
import { Route, Link, useHistory} from "react-router-dom"
import loginServices from '../../services/login'
import maintenanceServices from  '../../services/maintenances'
import renovationServices from  '../../services/renovations'
import completedMaintenanceServices from '../../services/completedMaintenances'
import Notification from "../Notification"
import './../../css/login.css'



const Login = ({notificationType, setNotificationType,notificationButtons, setNotificationButtons, notificationMessage, setNotificationMessage, user,showCreateUserForm,setShowCreateUserForm,loginStatus,setLoginStatus,setLoggedInUser,setUser,username,password,setUsername,setPassword})  => {

    const [showLoginForm, setShowLoginForm] = useState(false)


    const history = useHistory()


      const logOut = () => {
      if (localStorage.length > 0) {
          
       }
      window.localStorage.removeItem('loggedUser')
      setUser(null)
      setLoggedInUser('')
      setLoginStatus(false)
      history.push("/")
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        if (username === ''){
            setNotificationMessage("Username can't be empty")
            setNotificationType('login')
            setTimeout(() => {
                setNotificationMessage(null)
                setNotificationType('')
            }, 5000)
           // alert("Username can't be empty")
            return 
        } else if (password === ''){
            setNotificationMessage("Password can't be empty")
            setNotificationType('login')
            setTimeout(() => {
                setNotificationMessage(null)
                setNotificationType('')
            }, 7000)
        } else {

        try{
        const user = await loginServices
        .login({
            username,password
        })
        window.localStorage.setItem(
            'loggedUser', JSON.stringify(user)
        )
        completedMaintenanceServices.setToken(user.token)
        maintenanceServices.setToken(user.token)
        renovationServices.setToken(user.token)
        setLoginStatus(true)
        setUser(user)
        setUsername('')
        setPassword('')
        setLoggedInUser(user)
        setShowCreateUserForm(false)
        history.push("/kitchen")
        
    

    } catch(error){
        setNotificationMessage("Wrong username or password")
        setTimeout(() => {
            setNotificationMessage(null)
        }, 7000) 
        history.push("/login")
    }
}
}

    const handleUsername = (event) => {
        setUsername(event.target.value)

    }
    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    if (loginStatus !== false) {

        return (
            <></>
        )
    } else {
        return (
            <div className="loginPosition">
                <h2 className="Header">Login</h2>
                <form  onSubmit={handleLogin}>
                    <div>
                        <label className="label">Username</label> 
                        <p><input className="inputFieldLogin" value={username} type="text" onChange={handleUsername}></input></p>
                        <label className="label">Password</label>
                        <p><input className="inputFieldLogin" value={password} type="password" onChange={handlePassword}></input></p>
                    </div>
                    <button className="Button" type="submit">Login</button>
                </form>
                <Notification notificationType={notificationType} setNotificationType={setNotificationType} message={notificationMessage} buttons={notificationButtons}/>
    
    
            </div>
        )
    }

    }




export default Login