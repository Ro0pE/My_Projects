import { React,useTable } from 'react-table'
 
function MaintenanceTableView({taskList}) {

      const handleRemove = (event) => {
          console.log('delete', event.target.value)
      }
      const handleMarkDone = (event) => {
        console.log('mark done' ,event.target.value)
      }

        return (
          <div className="App">
            <table>
              <tr>
                <th>Task</th>
                <th>How often task should be done (days)</th>
                <th>Cost</th>
                <th>Check done</th>
                <th>Delete</th>
              </tr>
              {taskList.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.task}</td>
                    <td>{val.when}</td>
                    <td>{val.cost}</td>
                    <td><button value={val.id} onClick={handleMarkDone}>check done</button></td>
                    <td><button value={val.id} onClick={handleRemove}>delete</button></td>
                  </tr>
                )
              })}
            </table>
          </div>
        )
      }

export default MaintenanceTableView