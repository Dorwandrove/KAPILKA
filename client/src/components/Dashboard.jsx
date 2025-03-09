import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import { useAuth } from "./AuthProvider";
import { getTotalExpenses } from '../api/expense';
import { getTotalIncomes } from '../api/income';
import { formatPrice } from '../lib/utils';
import { Incomes } from './Incomes';
import { LineChart } from './charts/LineChart';
import { BarChart } from 'recharts';

export const Dashboard = () => {
  // קבלת פרטי המשתמש מהקונטקסט של האימות
  const { user } = useAuth();

  const [isPending,setIsPending] =useState({expenses:false, Incomes:false});

  // יצירת משתנים לשמירת סך כל ההוצאות וההכנסות
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncomes, settotalIncomes] = useState(0);

  useEffect(() => {
    // פונקציה לקבלת סך כל ההוצאות מהשרת

  const fetchTotalExpenses = async () => {
    try {
      setIsPending((prev)=> ({...prev,expenses:true}));
      const data = await getTotalIncomes(user.id); // שליחת בקשה ל-API עם מזהה המשתמש
      settotalIncomes(data.totalIncomes); // עדכון ה-state עם הנתונים שהתקבלו
      console.log(data); // הדפסת הנתונים ללוג (למטרות בדיקה)
    } catch (error) {
      console.log(error) 
    }
    finally{
      setIsPending((prev)=> ({...prev,expenses:false}));
    }


  };

  // פונקציה לקבלת סך כל ההכנסות מהשרת
  const fetchTotalIncomes = async () => {
    try {
      setIsPending((prev)=> ({...prev,Incomes:true}));
      const data = await getTotalIncomes(user.id); // שליחת בקשה ל-API עם מזהה המשתמש
      settotalIncomes(data.totalIncomes); // עדכון ה-state עם הנתונים שהתקבלו
      console.log(data); // הדפסת הנתונים ללוג (למטרות בדיקה)
    } catch (error) {
      console.log(error) 
    }
    finally{
      setIsPending((prev)=> ({...prev,Incomes:true}));
    }


  };

    // קריאה לפונקציות בעת טעינת הקומפוננטה
    fetchTotalIncomes();
    fetchTotalExpenses();
  }, []); // ריצה חד-פעמית בעת טעינת הקומפוננטה

  return (
    <div className='dashboard'>
      {/* כותרת לוח הבקרה עם שם המשתמש */}
      <header className='dashboard-header'>
        <h1>welcome {user.fullName}</h1>
      </header>

      <div className='summary'>

        {/* כרטיס המציג את סך כל ההכנסות */}
        <div className='card income'>
          <h2>Total Income</h2>
          {isPending.Incomes ? <p>...</p>:<p>{formatPrice(totalIncomes)}</p>}  {/* עיצוב הסכום בהתאם למטבע */}
        </div>

        {/* כרטיס המציג את סך כל ההוצאות */}
        <div className='card expense'>
          <h2>Total Expenses</h2>
          {isPending.expenses ? <p>...</p>:<p>{formatPrice(totalExpenses)}</p>} {/* עיצוב הסכום בהתאם למטבע */}
        </div>

        {/* כרטיס המציג את יתרת החשבון (הכנסות - הוצאות) */}
        <div className='card balance'>
          <h2>Total Balance</h2>
          <p>{formatPrice(totalIncomes - totalExpenses)}</p> {/* חישוב מאזן כולל */}
        </div>
      </div>
<div className="charts">
  <LineChart></LineChart>
  <BarChart></BarChart>
</div>
    </div>
  );
};
