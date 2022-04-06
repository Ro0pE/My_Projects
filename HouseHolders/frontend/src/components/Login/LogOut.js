import { Route, Link, useHistory} from "react-router-dom"
import './../../css/login.css'


const LogOut = ({user,loginStatus,setUser,loggedInUser,setLoggedInUser,setLoginStatus}) => {
    const history = useHistory()
    const logOut = () => {
        if (!localStorage.length > 0) {          
            return
         }
        window.localStorage.removeItem('loggedUser')
        setUser(null)
        setLoggedInUser('')
        setLoginStatus(false)

        history.push("/")
      }

      return (

        <div className="logOutPosition">
           <button className="logOutButton" onClick={logOut} > LOG OUT</button>
           {loginStatus === false ?
       <span className='notLoggedInText' > Not logged in </span> : <span className='loggedInText'> Logged in as a  <span className='loggedInUser'> {loggedInUser.name}</span> </span>
}    
       </div>
           //logout
       )

}

export default LogOut