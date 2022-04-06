import { useState, useEffect } from "react"
import MaintenanceBar from './MaintenanceBar.js'
import MaintenanceList from './MaintenanceList'
import './../../css/maintenances.css'


const Maintenances = ({setNotificationType,notificationType,notificationMessage,setNotificationMessage,completedTasks,setCompletedTasks,taskList,setTaskList,user,setUser}) => {

    

    return (
        <div>
            <h1 className="maintenancesHeader">Maintenances</h1>
    
            <div>
                <MaintenanceList key={taskList} notificationType={notificationType} setNotificationType={setNotificationType} notificationMessage={notificationMessage} setNotificationMessage={setNotificationMessage}  completedTasks={completedTasks} setCompletedTasks={setCompletedTasks} taskList={taskList} setTaskList={setTaskList} user={user} setUser={setUser}/>
            </div>
        </div>
    )
}

export default Maintenances

