const { addExpense, getExpenses, updateExpense, deleteExpense,getTotalExpenses } = require('../controllers/expense');

const router = require('express').Router();

router.post('/add-expenses/:userId', addExpense);

router.get('/get-expenses/:userId', getExpenses);

router.patch('/update-expenses/:userId/:expenseId', updateExpense);

router.delete('/delete-expenses/:userId/:expenseId', deleteExpense);

router.get('/get-total-expenses/:userId',getTotalExpenses);

module.exports = router;

