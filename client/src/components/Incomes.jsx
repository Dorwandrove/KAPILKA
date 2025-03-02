import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthProvider';
import { toast } from 'react-toastify';
import '../styles/Income.css';
import { AddIncome, deleteIncome,UpdateIncome,getIncomes} from '../api/income';
import { currencySymbols } from '../constants';

export const Incomes = () => {
  const { user } = useAuth();
  const [isPending, setIsPending] = useState({ add: false, delete: false, update: false });
  const [incomeID, setIncomeID] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);  

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getIncomes(user.id);
        setIncomes(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getData();
  }, [user.id]);

  const handleDelete = async (IncomeId) => {
    try {
      const userId = user.id;
      const data = await deleteIncome(userId, IncomeId);
      setIncomes(await getIncomes(userId));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending((prev) => ({ ...prev, delete: false }));
    }
  };



  const handleUpdate = async (income) =>
   {
    setIncomeID(income._id);
    setIsUpdate(true); 
      titleRef.current.value = income.title;
      descriptionRef.current.value = income.description;
      amountRef.current.value = income.amount;
      tagRef.current.value = income.tag;
      currencyRef.current.value = income.currency;
    
  };

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const tagRef = useRef(null);
  const currencyRef = useRef(null);

  const resetFields = () => {
    titleRef.current.value = '';
    descriptionRef.current.value = '';
    amountRef.current.value = '';
    tagRef.current.value = 'salary';
    currencyRef.current.value = 'ILS';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const amount = amountRef.current?.value;
    const tag = tagRef.current.value;
    const currency = currencyRef.current.value;

    const payload = {
      userId: user.id,
      title,
      description,
      amount: Number(amount),
      tag,
      currency,
    };

    try {
      console.log(incomeID)
      if (incomeID) {
        setIsPending((prev) => ({ ...prev, update: true }));
        const data = await UpdateIncome(user.id, incomeID, payload);
        toast.success(data.message);
        setIncomes(await getIncomes(user.id));
        resetFields();
        setIncomeID(null);
        setIsUpdate(false);  
      } else {
        setIsPending((prev) => ({ ...prev, add: true }));
        const data = await AddIncome(payload);
        toast.success(data.message);
        resetFields();
        setIncomes([...incomes, data.income]);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending((prev) => ({ ...prev, add: false }));
      setIsPending((prev) => ({ ...prev, update: false }));
    }
  };

  return (
    <main className='income-container'>
      <form onSubmit={handleSubmit}>
        <h1>Incomes Page</h1>
        <div>
          <label htmlFor='title'>Title</label>
          <input type='text' id='title' ref={titleRef} placeholder='Enter Income Title' required />
        </div>
        <div>
          <label htmlFor='description'>Description</label>
          <input type='text' id='description' ref={descriptionRef} placeholder='Enter Income Description' required />
        </div>
        <div>
          <label htmlFor='amount'>Amount</label>
          <input type='number' step={0.01} inputMode='numeric' id='amount' ref={amountRef} placeholder='Enter Income Amount' required />
        </div>
        <div>
          <label htmlFor='tag'>Tag</label>
          <select id='tag' ref={tagRef} required>
            <option value='salary'>Salary</option>
            <option value='bonus'>Bonus</option>
            <option value='gift'>Gift</option>
            <option value='other'>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor='currency'>Currency</label>
          <select id='currency' ref={currencyRef} required>
            <option value='ILS' defaultValue>ILS</option>
            <option value='USD'>USD</option>
            <option value='EUR'>EUR</option>
          </select>
        </div>
        <button type='submit' className='income-button' disabled={isPending.add || isPending.update}>
          {
            isUpdate ? isPending.update ? 'Updating...' : 'Update income':
            isPending.add ? 'Adding...' : 'Add income'
          }
        </button>
      </form>
      <table className='incomes-table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Tag</th>
            <th>Currency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes?.map((income) => (
            <tr key={income.id}>
              <td>{income.title}</td>
              <td>{income.description}</td>
              <td>{`${currencySymbols[income.currency]}${income.amount}`}</td>
              <td>{income.tag}</td>
              <td>{income.currency}</td>
              <td>
                <div className='action-buttons'>
                  <button
                    className='edit-button'
                    onClick={() => handleUpdate(income)}
                    disabled={isPending.update}
                  >
                    {isPending.delete ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    className='delete-button'
                    onClick={() => handleDelete(income._id)}
                    disabled={isPending.delete}
                  >
                    {isPending.delete ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};
