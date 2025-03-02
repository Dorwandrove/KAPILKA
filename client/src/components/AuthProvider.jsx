import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { me } from '../api/auth';

const AuthContext = createContext(); // יצירת הקונטקסט של האותנטיקציה

export const AuthProvider = ({ children }) => {
    // ניהול מצבי המשתמש והאימות
    const [user, setUser] = useState(null); // מצב המאחסן את פרטי המשתמש
    const [isPending, setIsPending] = useState(true); // בודק אם הטעינה עדיין מתבצעת
    const [isLoggedIn, setIsLoggedIn] = useState(false); // מציין אם המשתמש מחובר

    const navigate = useNavigate(); 
    //useNavigate()-מאפשר לקומפוננטה לנווט לעמודים אחרים
    /**
     * פונקציה שבודקת האם הטוקן פג תוקף
     */
    const isTokenExpired = (decodedToken) => {
        try {
            if (!decodedToken || !decodedToken.tokenExpired) return true;
            const currentTime = Math.floor(Date.now() / 1000); // הזמן הנוכחי בשניות
            return decodedToken.tokenExpired < currentTime;
        } catch (error) {
            return true; // במקרה של שגיאה, נניח שהטוקן לא תקין
        }
    };

    /**
     * פונקציה שבודקת אם המשתמש מחובר
     * אם המשתמש אינו מחובר או שהטוקן שלו פג תוקף, נעביר אותו לדף ההתחברות
     */
    const checkAuth = async () => {
        try {
            const data = await me(); // ביצוע בקשה לבדיקה האם המשתמש מחובר
            if (!data || isTokenExpired(data)) {
                throw new Error('Token expired');
            }
            setUser(data); // שמירת נתוני המשתמש
            setIsLoggedIn(true); // סימון שהמשתמש מחובר
        } catch (error) {
            setUser(null); // ניקוי המשתמש
            setIsLoggedIn(false); // סימון שהמשתמש אינו מחובר
            navigate('/auth'); // הפניה לדף ההתחברות
        } finally {
            setIsPending(false); // סיום מצב הטעינה
        }
    };

    // ביצוע הבדיקה בעת טעינת האפליקציה
    useEffect(() => {
        checkAuth();
    }, []); // מתבצע רק פעם אחת כשהקומפוננטה נטענת

    return (
        <AuthContext.Provider value={{ user, isPending, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * קריאה לקונטקסט של האותנטיקציה
 */
export const useAuth = () => useContext(AuthContext);
