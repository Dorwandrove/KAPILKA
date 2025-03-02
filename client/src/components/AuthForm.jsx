import React, { useRef, useState } from 'react'; 
import '../styles/AuthForm.css'; 
import { signUp } from '../api/auth'; // פונקציה לרישום משתמש
import { login } from '../api/auth'; // פונקציה להתחברות משתמש
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router'; // ניתוב לעמודים אחרים לאחר התחברות/הרשמה

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); 
  // משתנה state לקביעת מצב הטופס (האם המשתמש נמצא בדף התחברות או הרשמה)

  const [isPending, setIsPending] = useState(false);
  // משתנה state לבדיקה אם יש שליחת נתונים לשרת (כדי להימנע מלחיצות כפולות)

  const navigate = useNavigate(); // פונקציה המאפשרת ניתוב לעמוד אחר

  // שימוש ב- useRef לשליפת נתונים משדות הטופס מבלי לגרום לרינדור מחדש
  const fullNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // מניעת רענון הדף בעת שליחת הטופס

    // קבלת הערכים מתוך השדות בטופס
    const fullName = fullNameRef.current?.value;
    const username = usernameRef.current.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current.value;
    
    console.log({ fullName, username, email, password }); // הדפסת הנתונים לקונסול לבדיקה

    const payload = {
      fullName,
      username,
      email,
      password,
    };

    try {
      setIsPending(true); // הצגת מצב טעינה בזמן שליחת הבקשה

      if (isLogin) { 
        // אם המשתמש בלוגין - נשלחת בקשת התחברות
        const data = await login(payload);
        toast.success(data.message); // הצגת הודעת הצלחה
        window.location.href = '/'; // ניתוב לעמוד הבית לאחר התחברות
        return;
      }
      
      // אם המשתמש נרשם - נשלחת בקשת הרשמה
      const data = await signUp(payload);
      toast.success(data.message);
      navigate('/'); // ניתוב לעמוד הבית
      window.location.href = '/'; // ניתוב דרך שינוי ה- URL (ליתר ביטחון)

    } catch (error) {
      toast.error(error.message); 
    } finally {
      setIsPending(false); // עדכון שהפעולה הסתיימה
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1> 
        {/* כותרת משתנה בהתאם למצב התחברות/הרשמה */}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" ref={fullNameRef} placeholder="Enter your full name" required />
            </div>
          )}
          {/* שדה שם מלא מופיע רק אם המשתמש נרשם (ולא בהתחברות) */}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" ref={usernameRef} placeholder="Enter your username" required />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" ref={emailRef} placeholder="Enter your email" required />
            </div>
          )}
          {/* שדה אימייל מופיע רק אם המשתמש נרשם */}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={passwordRef} placeholder="Enter your password" required />
          </div>
          
          <button type="submit" className="btn" disabled={isPending}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          {/* כפתור שמכיל טקסט משתנה בהתאם למצב הטופס (Login / Sign Up)
          דיסאבלד מונע לחיצה כפולה */}
        </form>

        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span className='auth-mode' onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Sign Up' : ' Login'}
          </span>
        </p>
        {/* טקסט שמאפשר מעבר בין התחברות להרשמה על ידי שינוי ה-state */}
      </div>
    </div>
  );
};
