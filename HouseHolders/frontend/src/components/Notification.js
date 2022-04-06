
import './../css/notification.css'


const Notification = ({message,setMessage,setNotificationType, notificationType}) => {



  
    if (notificationType === 'error') {

    if (message === null) {
        return null
    } else {
        return (
            <div className="errorNotification">
                <p>{message}</p>
            </div>
        )

    } 
} else if (notificationType === 'succes') {

    if (message === null) {
        return null
    } else {
        return (
            <div className="succesNotification">
                <p>{message}</p>
            </div>
        )

    } 

} else if (notificationType === 'login') {

    if (message === null) {
        return null
    } else {
        return (
            <div className="errorNotification">
                <p>{message}</p>
            </div>
        )
    }

} else {
    return null
}



}
export default Notification