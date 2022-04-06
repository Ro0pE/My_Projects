import axios from 'axios'

//const baseUrl = 'http://localhost:3001/maintenances'
const baseUrl = '/maintenances'

let token = null

const setToken = newToken => {

    token = `bearer ${newToken}`
}

const getMaintenances =  async id => {
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


const createMaintenance = async newObject => {
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
const updateMaintenance = async (id, newObject) => {
    const config = {
        headers: {
            Authorization: token
        },
        }
    const request = axios.put(`${baseUrl}/${id}`, newObject, config)
    const response = await request
    return response.data
  }

  const getById = async (id) => {
    const request = await axios.get(`${baseUrl}/${id}`)
    return request.data
  }

const deleteMaintenance = async (id) => {  
    const config = {
        headers: {
            Authorization: token
        },
        }
    const request = await axios.delete(`${baseUrl}/${id}`,config)
    return request.data
}

export default {getMaintenances, createMaintenance, updateMaintenance, deleteMaintenance, getById, setToken}