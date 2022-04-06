import axios from 'axios'

//const baseUrl = 'http://localhost:3001/completedMaintenances'
const baseUrl = '/completedMaintenances'

let token = null

const setToken = newToken => {

    token = `bearer ${newToken}`
}

const getCompletedMaintenances =  async id => {
    const config = {
        headers: {
            Authorization: token
        },
        }


    try {
        const response =  await axios.get(baseUrl,config)
        return response.data
    } catch(error) {

    }
    
}


const createCompletedMaintenance = async newObject => {
    const config = {
        headers: {
            Authorization: token
        },
        }

    try {
        const response =  await axios.post(baseUrl,newObject,config)

        return response.data
    } catch(error) {

    }
}
const updateCompletedMaintenance = async (id, newObject) => {

    const config = {
        headers: {
            Authorization: token
        },
        }
        try {
    const request = axios.put(`${baseUrl}/${id}`, newObject, config)
    const response = await request
    return response.data
  } catch(error){
      
  }
  }

  const getById = async (id) => {
    const request = await axios.get(`${baseUrl}/${id}`)
    return request.data
  }

const deleteCompletedMaintenance = async (id) => {  
    const config = {
        headers: {
            Authorization: token
        },
        }
    const request = await axios.delete(`${baseUrl}/${id}`,config)
    return request.data
}

export default {getCompletedMaintenances, createCompletedMaintenance, updateCompletedMaintenance, deleteCompletedMaintenance, getById, setToken}