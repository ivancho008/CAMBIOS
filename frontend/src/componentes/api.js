export const API_BASE_URL = 'http://localhost:5000/api';


export const apiCall = async (endpoint, options = {}) => {
const token = localStorage.getItem('token');
const config = {
headers: {
'Content-Type': 'application/json',
...(token && { Authorization: `Bearer ${token}` }),
},
...options,
};


if (config.body && typeof config.body !== 'string') config.body = JSON.stringify(config.body);


try {
const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
const data = await response.json();
if (!response.ok) throw new Error(data.message || 'Error en la petición');
return data;
} catch (error) {
console.error('API Error:', error);
throw error;
}
};