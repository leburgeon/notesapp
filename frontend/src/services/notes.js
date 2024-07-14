import axios from 'axios'
const baseUrl = '/api/notes'

// Functions for dealing with json-server requests

const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: 'This note is not saved to server',
    important: true,
  }
  return request.then(response => response.data.concat(nonExisting))
}

const create = newObject => {
  return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

// Exports the method definitions for interacting with the json-server 
// Uses the shorter notation for object initialisation with properties with the same name as the values
export default { getAll, create, update }