import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// Functions for dealing with json-server requests
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  // Creates a config object using the token of the logged in user
  // cofig object is used to set the default header for the axios post
  const config = {
    headers: { Authorization : token },
  }

  // makes an axios post request to the api/notes url
  const response = await axios.post(baseUrl, newObject, config)

  
  return response.data
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

// Exports the method definitions for interacting with the json-server 
// Uses the shorter notation for object initialisation with properties with the same name as the values
export default { getAll, create, update, setToken }