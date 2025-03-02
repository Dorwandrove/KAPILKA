const jwt = require('jsonwebtoken'); // ייבוא ספריית jwt לעבודה עם טוקנים
const User = require('../models/user'); // ייבוא מודל המשתמשים מהמסד נתונים

const auth = async (req, res, next) => {
    try {
        // קבלת הטוקן מהעוגיות (cookies)
        const token = req.cookies.token;

        // בדיקה אם הטוקן קיים ולוודא שאינו ריק
        if (!token || token.lenght === 0) {  
            throw new Error('Please authenticate'); // זריקת שגיאה במקרה שאין טוקן
        }

        // אימות הטוקן באמצעות המפתח הסודי שנמצא בקובץ הסביבה
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // בדיקה אם פענוח הטוקן נכשל
        if (!decoded) {
            throw new Error('Token is invalid');
        }

        // בדיקה אם הטוקן פג תוקף (exp שומר את הזמן שבו הטוקן יפוג)
        if (decoded.exp < Date.now() / 1000) {
            throw new Error('Token is expired');
        }

        console.log(decoded); // הדפסת נתוני הטוקן המפוענחים (לבדיקות)

        // חיפוש המשתמש במסד הנתונים לפי ה-ID שמופיע בטוקן
        const user = await User.findOne({ _id: decoded.id });

        console.log(user); // הדפסת המשתמש שנמצא (לבדיקות)

        // אם המשתמש לא נמצא במסד הנתונים, זריקת שגיאה
        if (!user) {
            throw new Error('User not found');
        }

        // הוספת המשתמש המבוסס לטוקן לבקשה, כך שניתן יהיה לגשת אליו בהמשך
        req.user = Object.assign(user, { exp: decoded.exp });

        next(); // מעבר לפונקציה הבאה בשרשרת הבקשות
    } catch (error) {
        console.log(error); 
        return res.status(401).send({ message: error.message }); 
    }
}

module.exports = auth; // ייצוא הפונקציה לשימוש בקבצים אחרים
