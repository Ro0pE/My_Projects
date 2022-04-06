import { useState } from "react"


const ShoppingList = () => {

    const [item, setItem] = useState('')
    const [shoppingList , setShoppingList] = useState([])

    const handleChange = (event) =>       {
        setItem(event.target.value)
    }

    const addItem = () => {

        setShoppingList(shoppingList.concat(item))
        setItem('')
     

    }

    const removeAll = () => {
        setShoppingList([])


    }
    const test = (target) => {
        setItem(target)
        console.log(target.value ," ja tämä" ,target.checked)

    }
     

 
    return (
        <div>       
            <h1>Shopping list</h1>
            <div>
            <input type="text" value={item}  onChange={handleChange}></input>
            <button type="submit" onClick={addItem}>Add to list</button>
            <ul>
            {shoppingList.map((item) => (
            <li>{item} <input type="checkbox" value={item} onClick={({target}) => test(target)}></input></li>
            ))}
            </ul>
            <button type="submit" onClick={removeAll}>remove all</button>
            </div>


        </div>
    )
}

export default ShoppingList