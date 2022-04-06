import { useState, useEffect } from "react"
import renovationService from '../../services/renovations'
import RenovationsList from "./RenovationsList"
import Calendar from 'react-calendar';
import Notification from "../Notification";
import './../../css/calendar.css'





const Renovations = ({notificationType, setNotificationType, confirmation, setConfirmation, notificationButtons, setNotificationButtons, notificationMessage, setNotificationMessage,user,setUser,renovations,setRenovations}) => {


    const [project, setProject] = useState('')
    const [details, setDetails] = useState('')
    const [company, setcompany] = useState('')
    const [date, setDate] = useState('')
    const [workBudget,setWorkBudget] = useState(0)
    const [materialBudget, setMaterialBudget] = useState(0)
    const [otherBudget, setOtherBudget] = useState(0)
    const [status, setStatus] = useState(false)
    const [renovationStartDate, setRenovationStartDate] = useState('')
    const [calendarDate, setCalenderDate] = useState('')
    const [showDetails, setShowDetails] = useState(false)



    
    useEffect(() => {
        renovationService.getRenovations().then(renovations => {
          setRenovations(renovations)
        })
      },[])
    

    const addRenovation = (event) => {
    
        event.preventDefault()

        let newReno = {
            project: project,
            details: details,
            showDetails: showDetails,
            company: company,
            startDate: renovationStartDate,
            finishedDate: null,
            workBudget: workBudget,
            materialBudget: materialBudget,
            otherBudget: otherBudget,
            status: status,

        }
        if (project === ''){
          setNotificationType('error')
          setNotificationMessage("Project must have a name")
          setTimeout(() => {
              setNotificationMessage(null)
              setNotificationType('')
          }, 5000)

        } else if (details === ''){
          setNotificationType('error')
          setNotificationMessage("Project must have details")
          setTimeout(() => {
              setNotificationMessage(null)
              setNotificationType('')
          }, 5000)

        } else if (company === '') {
          setNotificationType('error')
          setNotificationMessage("Project must have a contractor")
          setTimeout(() => {
              setNotificationMessage(null)
              setNotificationType('')
          }, 5000)

        } else if (renovationStartDate === ''){
          setNotificationType('error')
          setNotificationMessage("Project must have a starting date")
          setTimeout(() => {
              setNotificationMessage(null)
              setNotificationType('')
          }, 5000)

        } else {
          setNotificationType('succes')
          setNotificationMessage(`New Project "${newReno.project}" added!`)
          setTimeout(() => {
              setNotificationMessage(null)
              setNotificationType('')
          }, 9000)
          renovationService
          .createRenovation(newReno)
          .then(returnedReno => {
              setRenovations(renovations.concat(returnedReno))
              setProject('')
              setDetails('')
              setcompany('')
              setWorkBudget(0)
              setMaterialBudget(0)
              setOtherBudget(0)    
              setRenovationStartDate('')
              
          })
         


        }
    }

    const setDateToCalender = (time) => {
      let properDate = time.getDate() + '-' +  (time.getMonth()) + '-' +  time.getFullYear()
      setRenovationStartDate(time)
      setCalenderDate(properDate)
  }  

    const handleProject = (event) => {
        setProject(event.target.value)
      }
    const handleDetails = (event) => {
        setDetails(event.target.value)
    }
    const handleCompany = (event) => {
        setcompany(event.target.value)
    }

    const handleWorkBudget = (event) => {
        setWorkBudget(event.target.value)
    } 
    const handeMaterialBudget = (event) => {
      setMaterialBudget(event.target.value)
  } 
  const handleOtherBudget = (event) => {
    setOtherBudget(event.target.value)
} 


    return (

        <div>
                          

            <h1 className="renovationsHeader" >Renovations</h1>
            <Notification setNotificationType={setNotificationType} notificationType={notificationType} message={notificationMessage} buttons={notificationButtons}/>

           <h3 className="addRenovationsHeader">Add a new renovation</h3>

              <form  onSubmit={addRenovation}>
              <div className="addRenovationForm">
                <p>
                <label className="label">Project: </label>
                <input className="inputfield" value={project} onChange={handleProject}/><br />
                <label className="label" >Details:</label>    
                <textarea className="textArea" value={details} onChange={handleDetails}/><br />
                <label className="label">Contractor:</label>
                <input className="inputfield" value={company} onChange={handleCompany}/><br />
                <label className="label">Work cost:</label>
                <input className="inputfield" type="number" min="0" value={workBudget} onChange={handleWorkBudget}/><br />
                <label className="label">Material cost:</label>
                <input className="inputfield" type="number" min="0" value={materialBudget} onChange={handeMaterialBudget}/><br />
                <label className="label">Other costs:</label>
                <input className="inputfield" type="number" min="0" value={otherBudget} onChange={handleOtherBudget}/><br />            
                </p>         
                <div className="calendarPostion">   

                <label className="label">Project start date:</label> <span className="label">{calendarDate}</span><br />  
                <button className="addRenovationButton" type="submit">Add a new renovation</button>  
                <Calendar onChange={setDateToCalender} value={renovationStartDate}/>

                </div>  
                </div>  

              </form> 

           
            
            <RenovationsList setNotificationType={setNotificationType} notificationType={notificationType} confirmation={confirmation} setConfirmation={setConfirmation} notificationButtons={notificationButtons} setNotificationButtons={setNotificationButtons} notificationMessage={notificationMessage} setNotificationMessage={setNotificationMessage} renovationStartDate={renovationStartDate} calendarDate={calendarDate} showDetails={showDetails} setShowDetails={setShowDetails} renovations={renovations} setRenovations={setRenovations} user={user} setUser={setUser}/>        
        </div>
    )
}

export default Renovations