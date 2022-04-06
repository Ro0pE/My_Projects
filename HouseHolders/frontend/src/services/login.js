import axios from 'axios'


//const baseUrl = 'http://localhost:3001/login'
const baseUrl = '/login'



const login = async credentials => {
    try {
        const response =  await axios.post(baseUrl,credentials)
        if (typeof response.data.username !== 'undefined') {
            return response.data
        } else {
            
        }
    }catch(error) {

            }

        }
       
   


export default {login}