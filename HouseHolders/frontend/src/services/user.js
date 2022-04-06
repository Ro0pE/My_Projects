import axios from 'axios'

//const baseUrl = 'http://localhost:3001/users'
const baseUrl = '/users'

const createUser = async newUser => {
    try {
        const response =  await axios.post(baseUrl,newUser)
        return response.data
    } catch(error) {
    }
}

export default {createUser}