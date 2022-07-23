import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://to-do-list-9e30e-default-rtdb.europe-west1.firebasedatabase.app/'
});

export default instance;