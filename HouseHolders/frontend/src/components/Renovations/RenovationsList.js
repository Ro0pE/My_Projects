import renovationServices from '../../services/renovations'
import { useState, useEffect } from "react"
import './../../css/renovations.css'


const RenovationsList = ({notificationType, setNotificationType,confirmation, setConfirmation, notificationButtons, setNotificationButtons, notificationMessage, setNotificationMessage,renovationStartDate, user,setUser,renovations,setRenovations,showDetails,setShowDetails}) => {   // refaktoroi returni

 


  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser === 'undefined') {
      window.localStorage.removeItem('loggedUser')
      return
    }
    if (loggedUser) {
        const user = JSON.parse(loggedUser)
        setUser(user)
       
        renovationServices.setToken(user.token)

        
    }
},[])


useEffect(() => {

  renovationServices
  .getRenovations()
  .then(reno => {
      setRenovations(reno)
  })

},[])

const renderTime = (timeToFix) => {
  let convertedTime = new Date(timeToFix)
  let date = convertedTime.getDate() + '-' +  (convertedTime.getMonth() + 1) + '-' +  convertedTime.getFullYear()
  return date
}      


    const markFinished = (event) => {
  
        const id = event.target.value
        const ren = renovations.find(reno => reno.id === id)
       
          if (renovationStartDate === '' && ren.status === false){
            setNotificationType('error')
            setNotificationMessage("Pick a finishing date from the calendar")
            setTimeout(() => {
                setNotificationMessage(null)
                setNotificationType('')
            }, 5000)

          } else {
        if (ren.status === true){
          const targetRenovation = { ...ren, status: !ren.status, finishedDate: null }
          renovationServices
          .updateRenovation(id, targetRenovation)
            .then(reno => {
            setRenovations(renovations.map(renovation => renovation.id !== id ? renovation : reno))
            setNotificationType('succes')
            setNotificationMessage(`Renovation ${targetRenovation.project} marked undone`)
            setTimeout(() => {
                setNotificationMessage(null)
                setNotificationType('')
            }, 5000)
          })
          .catch(error => {
            setNotificationType('error')
            setNotificationMessage("Missing renovation")
            setTimeout(() => {
                setNotificationMessage(null)
                setNotificationType('')
            }, 5000)
            setRenovations(renovations.filter(r => r.id !== id))
          })

        } else {
  
          const targetRenovation = { ...ren, status: !ren.status, finishedDate: renovationStartDate }
          renovationServices
          .updateRenovation(id, targetRenovation)
            .then(reno => {
            setRenovations(renovations.map(renovation => renovation.id !== id ? renovation : reno))
            setNotificationType('succes')
            setNotificationMessage(`Renovation ${targetRenovation.project} finished`)
            setTimeout(() => {
                setNotificationMessage(null)
                setNotificationType('')
            }, 5000)
          })
          .catch(error => {
            setNotificationType('error')
            setNotificationMessage("Missing renovation")
            setTimeout(() => {
                setNotificationMessage(null)
                setNotificationType('')
            }, 5000)
            setRenovations(renovations.filter(r => r.id !== id))
          })
        }

        
    
  }

}

  const removeRenovation = (event)=> {
    const id = event.target.value
    let renoToRemove = renovations.find(maintenance => maintenance.id === id) 
    
    if (window.confirm(`Do you really want to remove renovation "${renoToRemove.project}" `)){
    renovationServices
    .deleteRenovation(id)
    setRenovations(renovations.filter(reno => reno.id !== id)) 
    setNotificationType('succes')
    setNotificationMessage(`Succesfully removed renovation ${renoToRemove.project}`)
    setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType('')
    }, 5000)
    } else {
        return
    }


}

  const handleLongDetails = (event) => {
    const id = event.target.value
    const ren = renovations.find(reno => reno.id === id)
    const targetRenovation = { ...ren, showDetails: !ren.showDetails}
    renovationServices
    .updateRenovation(id, targetRenovation)
    .then(reno => {
      setRenovations(renovations.map(renovation => renovation.id !== id ? renovation : reno))
    })
    .catch(error => {
      alert('Errror, missing renovation!')
      setRenovations(renovations.filter(r => r.id !== id))
    })    
  }

  const countTotalCost = (a,b,c) => {
    let totalCost = a+b+c
    
    return totalCost
  }

 
    return (
    <div className='renovationList'>
    <h1 className='renovationListHeader'>Renovations</h1>
    <div>
            <table name="renovations">
            <thead>
              <tr>
                <th name="project">Project</th>
                <th name="details">Details</th>
                <th name="contractor">Contractor</th>
                <th name="costs">Work cost</th>
                <th name="costs">Material cost</th>
                <th name="costs">Other costs</th>
                <th name="costs">Total cost</th>
                <th name="date">Starting date</th>
                <th name="date">Finishing date</th>
                <th name="status">Status</th>
                <th name="markStatus">Mark done / undone</th>
                <th name="delete">Delete</th>
              </tr>
            </thead>
              {renovations?.map((val, key) => {
                return (
                  <tbody>
                  <tr key={key}>
                    <td>{val.project}</td>
                    {val.showDetails ?
                    <td>{val.details}<button name="hide" value={val.id}onClick={handleLongDetails}>Hide</button></td> :
                    <td><button name="details" value={val.id}onClick={handleLongDetails}>Show details</button></td>  
                     
                  }
                    <td>{val.company}</td>
                    <td>{val.workBudget}€</td>
                    <td>{val.materialBudget}€</td>
                    <td>{val.otherBudget}€</td>
                    <td>{countTotalCost(Number(val.workBudget),Number(val.otherBudget),Number(val.materialBudget))}€</td>
                    <td>{renderTime(val.startDate)}</td>
                    {val.status?
                    <td>{renderTime(val.finishedDate)}</td>:  
                    <td>Not finished</td>            
                  }
                    {val.status ? 
                    <td name="statusDone">Finished</td>:
                    <td name="statusUndone">Not finished</td>
                  }
                    {val.status ?
                    <td><button name="undone" value={val.id} onClick={markFinished}>Undone</button></td>:
                    <td ><button name="done" value={val.id} onClick={markFinished}>Done</button></td>
                  }
                     <td><button name="delete" value={val.id} onClick={removeRenovation}>X</button></td>
                  </tr>
                  </tbody>
                )
              })}
            </table>
          </div>
    </div>   
    )
  
}
export default RenovationsList