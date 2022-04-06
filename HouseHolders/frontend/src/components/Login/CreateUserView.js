
import { useCallback } from "react"
import { useEffect, useState } from "react"
import { Route, Link, useHistory} from "react-router-dom"
import userService from '../../services/user'
import Header from '../Header'
import './../../css/login.css'
import Notification from "../Notification"

const CreateUserView = ({notificationType, setNotificationType, notificationMessage,setNotificationMessage,notificationButtons,setNotificationButtons,setShowCreateUserForm, setLoginStatus, user, setUser, username, password, setUsername, setPassword, setLoggedInUser}) => {

    const [userList, setUserList] = useState([])
    const [createUser, setCreateUser] = useState('')
    const [createUsername, setCreateUsername] = useState('')
    const [createPassword, setCreatePassword] = useState('')

    const history = useHistory()

    const handleCreateUser =  async (event) => {
        event.preventDefault()
        
        const newUser = {
            name: createUser,
            username: createUsername,
            password: createPassword      
        }
            if (createUsername.length < 3) {
                setNotificationType('error')
                setNotificationMessage("Username must be 3 or more characters long")
                setTimeout(() => {
                    setNotificationMessage(null)
                    setNotificationType('')
                }, 5000)
            } else if (createPassword.length < 3){
                setNotificationType('error')
                setNotificationMessage("Password must be 3 or more characters long")
                setTimeout(() => {
                    setNotificationMessage(null)
                    setNotificationType('')
                }, 5000)
            }  else {
               userService
               .createUser(newUser)
              .then(user => {
                 setUserList(userList.concat(user))
                 setCreatePassword('')
                 setCreateUsername('')
                 setCreateUser(null)
                 setLoginStatus(false)
                 setShowCreateUserForm(false)

        })
        window.localStorage.removeItem('loggedUser')
        setUser(null)
        setLoggedInUser('')
        setNotificationType('succes')
        setNotificationMessage(`New user "${newUser.name}" succesfully created!`)
        setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType('')
        }, 5000)
        history.push("/")
    }
    }
    const handleUser = (event) => {
        setCreateUser(event.target.value)

    }

    const handleUsername = (event) => {
        setCreateUsername(event.target.value)

    }
    const handlePassword = (event) => {
        setCreatePassword(event.target.value)
    }
    
    return (
        
        <div className="loginPosition">
            <h2 className="Header">Create a new user</h2>

            <form  onSubmit={handleCreateUser}>
                <div>
                    <label className="label">Full name</label>
                    <p><input className="inputFieldFullName" type="text"  onChange={handleUser}></input></p>
                    <label className="label">Username</label>
                    <p><input className="inputFieldUsername" type="text" name="Username" value={createUsername} onChange={handleUsername}></input>
                    <span className="minCharactersNotification">min 3 characters</span></p>
                    <label className="label">Password</label>
                    <p><input className="inputFieldPassword"  type="password" name="Password" value={createPassword} onChange={handlePassword}></input>
                    <span className="minCharactersNotification">min 3 characters</span></p>
                </div>
                <button className="Button" type="submit">Create user</button>
            </form>
            <Notification notificationType={notificationType} setNotificationType={setNotificationType} message={notificationMessage} buttons={notificationButtons}/>


        </div>
    )


}

export default CreateUserView