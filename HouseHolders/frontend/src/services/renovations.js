import axios from 'axios'

//const baseUrl = 'http://localhost:3001/renovations'
const baseUrl = '/renovations'

let token = null
const setToken = newToken => {
    token = `bearer ${newToken}`
}


const getRenovations =  async () => {
    const config = {
        headers: {
            Authorization: token
        },
        }

    try {
        const response = await axios.get(baseUrl,config)
        return response.data
    } catch(error){
    }

}

const createRenovation = async newObject => {
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



const updateRenovation = async (id, newObject) => {
    const config = {
        headers: {
            Authorization: token
        },
        }
    const request = axios.put(`${baseUrl}/${id}`, newObject, config)
    const response = await request
    return response.data
  }

const deleteRenovation = async (id) => {  
    const config = {
        headers: {
            Authorization: token
        },
        }
    const request = await axios.delete(`${baseUrl}/${id}`, config)
    return request.data
}  




export default {getRenovations, createRenovation, updateRenovation, deleteRenovation, setToken}