import { Route, Link} from "react-router-dom"


const MaintenanceBar = () => {


    return (
        
        <div  className="links">
            <Link style={{ textDecoration: 'none' }}><span>Overall  &nbsp; &nbsp; &nbsp;</span></Link>
            <Link style={{ textDecoration: 'none' }}><span>Toilet  &nbsp; &nbsp; &nbsp;</span></Link>
            <Link style={{ textDecoration: 'none' }}><span>Bathroom  &nbsp; &nbsp; &nbsp;</span></Link>
            <Link style={{ textDecoration: 'none' }}><span>Bedroom  &nbsp; &nbsp; &nbsp;</span></Link>
            <Link style={{ textDecoration: 'none' }}><span>Other</span></Link>
            
            
        </div>
    )
}

export default MaintenanceBar