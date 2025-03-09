import axios from 'axios';


const baseURL=proccess.env.NODE_ENV==='production' ? 'kapilka-agvz.onrender.com/api' : '/api';
//הגדרת קובץ בסיס לכל קריאות ה api
export default axios.create({

    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});