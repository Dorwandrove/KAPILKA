import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthProvider'
import '../styles/Expenses.css';
import { addExpense ,deleteExpense, getExpenses, UpdateExpense } from '../api/expense';
import { toast } from 'react-toastify';
import { currencySymbols } from '../constants'
import { Filters } from './Filters';

export const Expenses = () => {
    const { user } = useAuth();
    const [isPending, setIsPending] = useState({ add: false, delete: false, update: false });
    const [expenseID, setExpenseID] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [inputSearch, setInputSearch] = useState('');
    const [selectFilter, setSelectFilter] = useState(null);

    console.log(expenses);

    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const amountRef = useRef(null);
    const tagRef = useRef(null);
    const currencyRef = useRef(null);

    const maxAmount = useMemo(() => {
        console.log('useMemo');
        return expenses.length ? Math.max(...expenses.map((expense) => expense.amount)) : 0;
    }, []);

    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch = expense.title.toLowerCase().includes(inputSearch.toLowerCase());

        if (selectFilter && selectFilter.type == 'amount') {
            return (
                matchesSearch &&
                expense.amount >= selectFilter.min &&
                expense.amount <= selectFilter.max
            );
        }
        return matchesSearch;
    });



    const resetFields = () => {
        titleRef.current.value = '';
        descriptionRef.current.value = '';
        amountRef.current.value = '';
        tagRef.current.value = 'food';
        currencyRef.current.value = 'ILS';
    }

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
            console.log(expenseID)
            if (expenseID) {
                setIsPending((prev) => ({ ...prev, update: true }));
                const data = await UpdateExpense(user.id, expenseID, payload);
                toast.success(data.message);
                setExpenses(await getExpenses(user.id));
                resetFields();
                setExpenseID(null);
                setIsUpdate(false);
            } else {
                setIsPending((prev) => ({ ...prev, add: true }));
                const data = await addExpense(payload);
                toast.success(data.message);
                resetFields();
                setExpenses([...expenses, data.expense]);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsPending((prev) => ({ ...prev, add: false }));
            setIsPending((prev) => ({ ...prev, update: false }));
        }
    };

    const handleDelete = async (expenseId) => {
        try {
            const data = await deleteExpense(user.id, expenseId);
            toast.success(data.message);
            setExpenses(expenses.filter((expense) => expense._id !== expenseId));
        } catch (error) {
            toast.error(error.message);
        }
    };


    const handleUpdate = async (expense) => {
        setIsPending((prev) => ({ ...prev, update: false }));
        setExpenseID(expense._id);
        setIsUpdate(true);
        try {
            titleRef.current.value = expense.title;
            descriptionRef.current.value = expense.description;
            amountRef.current.value = expense.amount;
            tagRef.current.value = expense.tag;
            currencyRef.current.value = expense.currency;
        } catch (error) {
            toast.error(error.message);
        }
    };


    useEffect(() => {
        const getData = async () => {
            try {
                const data = await getExpenses(user.id);
                setExpenses(data);
            } catch (error) {
                toast.error(error.message);
            }
        };
        getData()
    }, []);

    return (
        <main className='expense-container'>
            <form onSubmit={handleSubmit}>
                <h1>Expenses Page</h1>
                <div>
                    <label htmlFor='title'>Title</label>
                    <input type='text' id='title' ref={titleRef} placeholder='Enter Expense Title' />
                </div>
                <div>
                    <label htmlFor='title'>Description</label>
                    <input type='text' id='description' ref={descriptionRef} placeholder='Enter Expense Description' />
                </div>
                <div>
                    <label htmlFor='title'>Amount</label>
                    <input
                        type='number'
                        inputMode='numeric'
                        id='amount'
                        ref={amountRef}
                        placeholder='Enter Expense Amount' />
                </div>
                <div>
                    <label htmlFor='Tag'>Tag</label>
                    <select id='tag' ref={tagRef}>
                        <option value="food">Food</option>
                        <option value="rent">Rent</option>
                        <option value="transport">Transport</option>
                        <option value="clothing">Clothing</option>
                        <option value="entertaiment">Entertaiment</option>
                        <option value="health">Health</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor='currency'>Currency</label>
                    <select id='currency' ref={currencyRef} required>
                        <option value="ILS" defaultValue>ILS</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>
                <button type='submit' className='expense-button' disabled={isPending.add || isPending.update}>
                    {
                        isUpdate ? isPending.update ? 'Updating...' : 'Update Expense' : isPending.add ? 'Adding...' : 'Add Expense'
                    }
                </button>
            </form>

            <Filters
                inputSearch={inputSearch}
                setInputSearch={setInputSearch}
                selectFilter={selectFilter}
                setSelectFilter={setSelectFilter}
                maxAmount={maxAmount}
            />

            {filteredExpenses.length ? (
                <table className='expenses-table'>
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
                        {filteredExpenses?.map((expense) => (
                            <tr key={expense._id}>
                                <td>{expense.title}</td>
                                <td>{expense.description}</td>
                                <td>{`${currencySymbols[expense.currency]} ${expense.amount}`}</td>
                                <td>{expense.tag}</td>
                                <td>{expense.currency}</td>
                                <td>
                                    <div className='action-buttons'>
                                        <button
                                            className='edit-button'
                                            onClick={() => handleUpdate(expense)}
                                            disabled={isPending.update}
                                        >Edit
                                        </button>

                                        <button className='delete-button'
                                            onClick={() => handleDelete(expense._id)}
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
            ) : (
                <p className='not-found'>"{inputSearch}" no expenses found.</p>
            )}

        </main >

    );
};