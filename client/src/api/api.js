import axios from 'axios';
//הגדרת קובץ בסיס לכל קריאות ה api
export default axios.create({

    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});