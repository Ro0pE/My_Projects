import { Route, Link, NavLink} from "react-router-dom"
import { useEffect, useState } from "react"
import './../css/menubar.css'


const Menubar = ({user,setUser}) => {
   

//           
    return (
        <div>
        <div  className="links">
            <ul>

          <li> <NavLink exact activeClassName="active"  to="/kitchen"><span>Kitchen</span></NavLink></li>
          <li> <NavLink activeClassName="active" to="/vehicles"><span>Vehicles</span></NavLink></li>
          <li> <NavLink activeClassName="active" to="/renovations"><span>Renovations</span></NavLink></li>
          <li> <NavLink activeClassName="active" to="/maintenances"><span>Maintenances</span></NavLink></li>
          <li> <NavLink activeClassName="active" to="/Money"><span>Money</span></NavLink></li>     
            </ul>
        </div>
        </div>
    )
}

export default Menubar