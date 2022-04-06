import { Route, Link} from "react-router-dom"
import './../../css/kitchen.css'


const KitchenBar = () => {

    let a = 0
    
    if (a === 0){
        return (
            <div>
                <h1 className="kitchenHeader">Kitchen</h1>
                <h3 className="comingSoon"> coming soon...</h3>
            </div>
        )
    } else {

  


    return (
        
        <div  className="links">
            <Link style={{ textDecoration: 'none' }} to="/shoppinglist"><span>Shopping list  &nbsp; &nbsp; &nbsp;</span></Link>
            <Link style={{ textDecoration: 'none' }} to="/fridge"><span>Fridge  &nbsp; &nbsp; &nbsp;</span></Link>       
            <Link style={{ textDecoration: 'none' }} to="/freezer"><span path='/freezer'>Freezer  &nbsp; &nbsp; &nbsp;</span></Link>
            <Link style={{ textDecoration: 'none' }} to="/pantry"><span>Pantry  </span></Link>
            
            
        </div>
    )
}
}

export default KitchenBar
