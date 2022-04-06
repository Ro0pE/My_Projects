import { useState, useEffect } from "react"
import maintenanceServices from './../../services/maintenances'
import renovationServices from './../../services/renovations'
import completedMaintenanceServices from './../../services/completedMaintenances'
import './../../css/money.css'

const Money = ({completedTasks,setCompletedTasks,taskList,renovations, setTaskList, setRenovations}) => {


    const [taxRefund, setTaxRefund] = useState(0)
    const [waterBills, setWaterBills] = useState([])
    const [electricityBills, setElectricityBills] = useState([])

    const thisYear = new Date().getFullYear()

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

      useEffect(() => {
        renovationServices
        .getRenovations()
        .then(renovations => {
          setRenovations(renovations)
        })
      },[])

     
    const totalMoneyUsed = () => {
        let renovationCosts = countTotalMoneyUsedRenovations()
        let maintenanceCosts = countTotalMoneyUsedMaintenances()
        let totalMoneySpend = (Number(renovationCosts) + Number(maintenanceCosts))
        return totalMoneySpend.toFixed(2)
    }  

    const countTotalMoneyUsedMaintenances = () => {
        let totalMoneySpend = 0
        completedTasks.forEach(maintenance => {
            totalMoneySpend = totalMoneySpend + maintenance.cost
        })
        return totalMoneySpend.toFixed(2)
    }  

    const countTotalMoneyUsedRenovations = () => {
        let totalMoneySpend = 0
        renovations.forEach(renovation => {
            totalMoneySpend = totalMoneySpend + renovation.workBudget + renovation.materialBudget + renovation.otherBudget

        })
        return totalMoneySpend.toFixed(2)

    } 
    const countMoneySpendOnRenovationsThisYear = () => {
        let renovationsThisYear = 0

        renovations.forEach(renovation => {
            let renovationYear = new Date(renovation.startDate)

            if (thisYear === renovationYear.getFullYear()){

                renovationsThisYear = renovationsThisYear + renovation.workBudget + renovation.materialBudget + renovation.otherBudget
            }
        })
        return renovationsThisYear.toFixed(2)
    }

    const countMoneySpendOnMaintenancesThisYear = () => {
        let maintenancesThisYear = 0

        completedTasks.forEach(task => {
            let taskYear = new Date(task.lastTime)
            if (thisYear === taskYear.getFullYear()) {
                maintenancesThisYear = maintenancesThisYear + task.cost
            }
        })
        return maintenancesThisYear.toFixed(2)
    }



    const countTaxRefund = () => {   // hae myös maintenancest
        let totalRenovationCost = 0
        renovations.forEach(renovation => {   
            let renovationYear = new Date(renovation.startDate)
          
            if (thisYear === renovationYear.getFullYear()) {
                totalRenovationCost = totalRenovationCost + renovation.workBudget
            }
        })
        
        let totalMaintenanceCost = 0
        completedTasks.forEach(maintenance => {
            let maintenanceYear = new Date(maintenance.lastTime)
            if (thisYear === maintenanceYear.getFullYear()) {       
                totalMaintenanceCost = totalMaintenanceCost + maintenance.cost
            }
        })
        const totalRefund = (totalRenovationCost + totalMaintenanceCost) * 0.4 - 100
        if (totalRefund > 2250) {
            return 2250
        } else if (totalRefund < 0) {
            return 0
        } else {
            return totalRefund.toFixed(2)
        }
    

    }
    

    return (
        <div to="/Money">
            <div>
            <h1 className="moneyHeader">Money</h1>
            <table name="total">
            <thead>
            <h2 className="totalHeader">Total</h2>
              <tr>
                <th name="renovations">Renovations</th>
                <th name="tasks">Maintenances</th>
                <th name="shopping">Shopping</th>
                <th name="bills">Bills</th>
                <th name="totalMoneySpend">Total money spend</th>

              </tr>
            </thead>
               <tr >
                <td name="totalMoneySpendRenovations">{countTotalMoneyUsedRenovations()}€</td>
                <td name="totalMoneySpendMaintenances">{countTotalMoneyUsedMaintenances()}€</td>
                <td>-</td>
                <td>-</td>
                <td name="totalMoneySpend">{totalMoneyUsed()}</td>
              </tr>

            </table>
            </div>
            <div>
            <table name="thisYear">         
            <thead> 
            <h2 className="thisYearHeader">This year</h2>
              <tr>
                <th name="renovationsThisYear">Renovations this year</th>
                <th name="maintenancesThisYear">Maintenances this year</th>
                <th name="shoppingThisYear">Shopping this year</th>
                <th name="billsThisYear">Bills this year</th>
                <th name="totalMoneySpendThisYear">Total money spend this year</th>

              </tr>
            </thead>
               <tr >
                <td name="moneySpendRenovationsThisYear">{countMoneySpendOnRenovationsThisYear()}€</td>
                <td name="moneySpendMaintenancesThisYear">{countMoneySpendOnMaintenancesThisYear()}€</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>

            </table>
            </div>
            <h2 className="taxRefundThisYearHeader">Tax refund this year</h2>
            <h3 className="taxRefundThisYearAmount">{countTaxRefund()}€</h3>
        </div>
    )
}

export default Money