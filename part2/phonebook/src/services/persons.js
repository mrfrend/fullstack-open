import axios from "axios";
const baseUrl = "http://localhost:3001/persons";
const getAll = () => {
	return axios.get(baseUrl).then((response) => response.data);
};

const create = (personObject) => {
	return axios.post(baseUrl, personObject).then((response) => response.data);
};

const update = (id, personObject) => {
	return axios
		.put(`${baseUrl}/${id}`, personObject)
		.then((response) => response.data);
};

const deletePerson = (personId) => {
	return axios.delete(`${baseUrl}/${personId}`);
};

export default {
	getAll,
	create,
	deletePerson,
	update,
};
