import axios from 'axios';


const baseURL=process.env.NODE_ENV==='production' ? '/api': 'http://localhost:3000/api';//כתובת השרת של האפליקציה
//הגדרת קובץ בסיס לכל קריאות ה api
export default axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});