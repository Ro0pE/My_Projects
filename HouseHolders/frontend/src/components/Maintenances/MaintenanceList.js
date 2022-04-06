import { useState, useEffect } from "react"
import maintenanceServices from '../../services/maintenances'
import Calendar from 'react-calendar'
import Select from 'react-select'
import Notification from "../Notification"
import 'react-calendar/dist/Calendar.css'
import completedMaintenanceServices from '../../services/completedMaintenances'
import './../../css/calendar.css'





const MaintenanceList = ({notificationType,setNotificationType,setNotificationMessage,notificationMessage, completedTasks,setCompletedTasks,taskList,setTaskList,user,setUser}) => {


    const [task, setTask] = useState('')
    const [when, setWhen] = useState(0)
    const [lastTimeDone, setLastDoneTime] = useState('')
    const [cost, setCost] = useState(0)
    const [calendarDate, setCalenderDate] = useState(null)

    const [oneTimeTask, setOneTimeTask] = useState(true)
 

    let today = new Date()
    let dateNow = today.getDate() + '-' +  (today.getMonth() + 1) + '-' +  today.getFullYear()

    useEffect(() => {
        const loggedUser = window.localStorage.getItem('loggedUser')
        if (loggedUser === 'undefined') {
          window.localStorage.removeItem('loggedUser')
          return
        }
        if (loggedUser) {
            const user = JSON.parse(loggedUser)
            setUser(user)
            maintenanceServices.setToken(user.token)
            
        }
    },[])



    useEffect(() => {

        maintenanceServices
        .getMaintenances()
        .then(maintenance => {
            setTaskList(maintenance)
        })

      },[]) 

      useEffect(() => {

        completedMaintenanceServices
        .getCompletedMaintenances()
        .then(maintenance => {
            setCompletedTasks(maintenance)
        })
    
      },[])





const renderTime = (timeWhenTaskIsDone) => {
    let convertedTime = new Date(timeWhenTaskIsDone)
    let date = convertedTime.getDate() + '-' +  (convertedTime.getMonth() + 1) + '-' +  convertedTime.getFullYear()
    return date
}      

const countTimeLeftToDoTask = (taskDone,howOften) => {
    const dateWhenTaskDone = new Date(taskDone)
    const today = new Date()
    const one_day = 1000*60*60*24;
    let result = Math.ceil((today.getTime()-dateWhenTaskDone.getTime())/(one_day))
    let timeToDoCurrentTask = howOften - (result)

    if (timeToDoCurrentTask > 0){
        return ' You have ' + timeToDoCurrentTask + ' days to do this!'
    } else if (timeToDoCurrentTask < 0) {
        return 'You are ' + Math.abs(timeToDoCurrentTask) + ' days late!'
    } else {
        return  'You should do this today!'
        //Math.abs(timeToDoCurrentTask)
    }
    
}     

const setDateToCalender = (time) => {
    let properDate = time.getDate() + '-' +  (time.getMonth() + 1) + '-' +  time.getFullYear()
    setLastDoneTime(time)
    setCalenderDate(properDate)
}     


const markAsDone = (event) => {
    event.preventDefault()

    let newPrice = 0
    const id = event.target.value
    const mainte = taskList.find(maintenance => maintenance.id === id)
 

    newPrice = mainte.cost
    if (lastTimeDone === ''){
   
        setNotificationType('error')
        setNotificationMessage(`Pick a date from the calendar`)
        setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType('')
        }, 5000)

        return
    } 
    if (!window.confirm(`Is the old price ${mainte.cost}€ right`)){
        newPrice = window.prompt('New price')
    }
    if (lastTimeDone === ''){
        alert('Pick a date from the calendar')

        return
    } 
    if (lastTimeDone > new Date()) {
        alert("You probably don't have a time machine, pick a proper date...")
        return
    }



    let targetMaintenanceDate = { ...mainte, cost: newPrice, lastTime: new Date(lastTimeDone) }
    maintenanceServices
    .updateMaintenance(id, targetMaintenanceDate)
      .then(mainte => {
          setTaskList(taskList.map(maintenance => maintenance.id !== id ? maintenance : mainte))  
    })
    .catch(error => {
      alert('virhe, maintenance puuttuu ' , error)
 
    }) 
   

    let newOnetimeTask = {
        task: mainte.task,
        lastTime: lastTimeDone,
        cost: newPrice

    }



    completedMaintenanceServices
   .createCompletedMaintenance(newOnetimeTask)
   .then(maintenance => {
       setCompletedTasks(completedTasks.concat(maintenance))
   })
    
   
}
 


const removeMaintenance = (event)=> {
    const id = event.target.value
    let taskToBeRemoved = taskList.find(maintenance => maintenance.id === id) 
    if (window.confirm(`Do you really want to remove maintenance "${taskToBeRemoved.task}" `)){
    maintenanceServices
    .deleteMaintenance(id)
    setTaskList(taskList.filter(maintenance => maintenance.id !== id)) 
    setNotificationType('succes')
    setNotificationMessage(`Active task ${taskToBeRemoved.task} removed succesfully`)
    setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType('')
    }, 5000)
    
    } else {
        return
    }

   
}
const removeCompletedMaintenance = (event)=> {
    const id = event.target.value
    let taskToBeRemoved = completedTasks.find(maintenance => maintenance.id === id) 
    if (window.confirm(`Do you really want to remove maintenance "${taskToBeRemoved.task}" `)){
        completedMaintenanceServices
    .deleteCompletedMaintenance(id)
    setCompletedTasks(completedTasks.filter(maintenance => maintenance.id !== id)) 
    setNotificationType('succes')
    setNotificationMessage(`Completed task ${taskToBeRemoved.task} removed succesfully`)
    setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType('')
    }, 5000)
    } else {
        return
    }

   
}

const handleTask = (event) => {
    setTask(event.target.value)

}
const handleWhen = (event) => {
    setWhen(event.target.value)
    
}

const handleCost = (event) => {
    setCost(event.target.value)
    
}

const addTask = (event) => {
    event.preventDefault()
    let newTask = {
        task: task,
        when: when,
        lastTime: lastTimeDone,
        cost: cost

    }
    let newOnetimeTask = {
        task: task,
        lastTime: lastTimeDone,
        cost: cost

    }


   
        if (task === '') {         
            setNotificationType('error')
            setNotificationMessage('Task must have a name')
            setTimeout(() => {
                setNotificationMessage(null)
                setNotificationType('')
            }, 5000)
        } else if (lastTimeDone === ''){
            setNotificationType('error')
            setNotificationMessage('Date is empty, choose a date from the calendar')
            setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType('')
        }, 5000)
        return
        } else if (!lastTimeDone instanceof Date) {
            setNotificationType('error')
            setNotificationMessage('Date must be in correct format, choose a date from the calendar')
            setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType('')
        }, 5000)
        return
        } else if (lastTimeDone > new Date()) {
            setNotificationType('error')
            setNotificationMessage("You probably don't have a time machine, pick a proper date...")
            setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType('')
        }, 5000)
        return
        
        }else {
            if (oneTimeTask === false) {
                maintenanceServices
                .createMaintenance(newTask)
                .then(maintenance => {
                    setTaskList(taskList.concat(maintenance))
                    setTask('')
                    setWhen(0)
                    setLastDoneTime('')    
                    setCost(0)
                })
            
            
                setTaskList(taskList.concat(newTask))
                setNotificationType('succes')
                setNotificationMessage(`Active task "${newTask.task}" succesully created!`)
                setTimeout(() => {
                setNotificationMessage(null)
                setNotificationType('')
            }, 5000)

            } else {
                completedMaintenanceServices
                .createCompletedMaintenance(newOnetimeTask)
                .then(maintenance => {
                    setCompletedTasks(completedTasks.concat(maintenance))
                    setTask('')
                    setLastDoneTime('')    
                    setCost(0)
                })
                setNotificationType('succes')
                setNotificationMessage(`One time task "${newOnetimeTask.task}" succesully created!`)
                setTimeout(() => {
                setNotificationMessage(null)
                setNotificationType('')
            }, 5000)
            }

    }
}

    


const actions = [
    {label: "One time", value: 1, color: "#eeb086"},
    {label: "Active", value: 2, color: "#eeb086"}
]

const handleSelect = (event) => {
    if (event.label === 'One time'){
        setOneTimeTask(true)
    } else {
        setOneTimeTask(false)
    }

}


    return (
        <div>      
            <Notification setNotificationType={setNotificationType} notificationType={notificationType} message={notificationMessage} />
            <div className="addMaintenanceForm">       
            <form  onSubmit={addTask}>
                <div>          
                <h2 className="addNewTaskHeader">Add a new task</h2>
                <h3 className="date">Today is: {dateNow}</h3>
                <p>
                <label>Choose one time task or active task:</label>
                <Select className="selector" onChange={handleSelect} options={actions} defaultValue = {{ label: "One Time" , value: 1}}/>
                <p>*One time tasks are task which you have already "done".</p>
                <p>*Active tasks are ongoing tasks which you mark "done" whenever you do the task.</p>
                <label>Task:</label><input value={task}  onChange={handleTask}></input> <br />
                {oneTimeTask === false &&
                <div>
                <label>How often</label><input value={when} type="number" min="0" onChange={handleWhen}></input>
                <p>*Put the number of the days here when the task should be done</p>
                </div>
                }
                <label>Date when task is done:</label> <span className="chosenDate">{calendarDate}</span>
                <Calendar className="calendar" onChange={setDateToCalender} /> 
                <label>Cost: </label> <input  name="cost" type="number" min="0" value={cost} onChange={handleCost}></input><br />
                <p>*Put the cost here only if it's a taxrefundable</p>
                <button className="addTaskButton" type="submit">Add a new task</button>              
                </p>
                </div>
            </form>  
   
            </div>
            <div className="completedTaskList">
                <h1 className="completedTasksHeader">Completed Tasks</h1>
                        <table name="completedTasks">
                        <thead>
                          <tr>
                            <th name="number">#</th>
                            <th name="task">Task</th>
                            <th name="lastTimeDone">Last time done</th>
                            <th name="cost">Cost</th>
                            <th name="delete">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedTasks.map((val,index) => {
                            return (                      
                              <tr key={val.id}>
                                <td name="number">{index+1}</td>
                                <td>{val.task}</td>
                                <td>{renderTime(val.lastTime)}</td>
                                <td>{val.cost}€</td>
                                <td name="delete"><button name="delete" value={val.id} onClick={removeCompletedMaintenance}>X</button></td>
                              </tr>                             
                            )
                          })}
                           </tbody>
                        </table>
                        <div className="footer"></div>
            </div> 
            


        <div className="tasksBackground">
          <div className="activeTaskList">
          <h1 className="activeTaskListHeader">Active task list</h1>
            <table name="activeTasks">
            <thead>
              <tr>
                <th name="number">#</th>
                <th name="task">Task</th>
                <th name="howOften">How often task should be done (days)</th>
                <th name="lastTimeDone">Last time done</th>
                <th name="timeToDoTask">Time to do this task</th>
                <th name="cost">Cost</th>
                <th name="checkDone">Check done</th>
                <th name="delete">Delete</th>
              </tr>
            </thead>
            <tbody>
              {taskList?.map((val,index) => {
                return (        
                  <tr key={val.id}>
                    <td>{index+1}</td>
                    <td>{val.task}</td>
                    <td>{val.when}</td>
                    <td>{renderTime(val.lastTime)}</td>
                    <td>{countTimeLeftToDoTask(val.lastTime, val.when)}</td>
                    <td>{val.cost}€</td>
                    <td><button name="checkDone" value={val.id} onClick={markAsDone}>done</button></td>
                    <td><button name="delete" value={val.id} onClick={removeMaintenance}>X</button></td>
                  </tr>      
                )
              })}
              </tbody> 
            </table>
 
          </div>
          </div>
 
        
        </div>     
    )      

}



export default MaintenanceList