import api from './api'

//העמוד מבצע קריאות api 
//לניהול האקספנסס

export const addExpense = async (payload) => {
    try {
        const { userId } = payload
        const { data } = await api.post(`/expense/add-expenses/${userId}`, payload);
        //payload- האובייקט שנשלח לשרת עם פרטי המשתמש
        //data- הרספונס של הסרבר לקריאה, מכיל את פרטי המשתמש
        return data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'An unexpected error occurred. Please try again later.';

        throw new Error(message);
    }

}

export const getExpenses = async (userId) => {
    try {
        const { data } = await api.get(`/expense/get-expenses/${userId}`);

        return data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'An unexpected error occurred. Please try again later.';

        throw new Error(message);
    }

}

export const getTotalExpenses = async (userId) => {
    try {
        const { data } = await api.get(`/expense/get-total-expenses/${userId}`);

        return data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'An unexpected error occurred. Please try again later.';

        throw new Error(message);
    }

}

export const deleteExpense = async (userId, expenseId) => {
    try {
        console.log(userId, expenseId)
        const { data } = await api.delete(`/expense/delete-expenses/${userId}/${expenseId}`);

        return data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'An unexpected error occurred. Please try again later.';

        throw new Error(message);
    }

}

export const UpdateExpense = async (userId, expenseId,payload) => {
    try {
        console.log(userId, expenseId)
        const { data } = await api.patch(`/expense/update-expenses/${userId}/${expenseId}`,payload);

        return data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'An unexpected error occurred. Please try again later.';

        throw new Error(message);
    }

}