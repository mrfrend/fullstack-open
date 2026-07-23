import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async blogData => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.post(baseUrl, blogData, config)
  return response.data
}

const update = async (id, blogData) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.put(`${baseUrl}/${id}`, blogData, config)
  return response.data
}

const remove = async id => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, setToken, create, update, remove }
