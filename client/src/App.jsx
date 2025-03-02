import { AuthForm, Navbar, Dashboard, useAuth, Loading } from "./components"
import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router'
import { Expenses } from "./components/Expenses";
import { Incomes } from "./components/Incomes";


function App() {

  const { user, isPending, isLoggedIn } = useAuth();

  if (isPending) {
    return <Loading />;
  }

  console.log(isLoggedIn);

  return (
    <>
      {isLoggedIn && <Navbar />}
      <Routes>
        {isLoggedIn ? (
          <Route path="/" element={<Dashboard />} />
        ) : (
          <Route path="/" element={(<AuthForm />)} />
        )}

        {isLoggedIn && <Route path="/expenses" element={<Expenses />} />}
        <Route path="/auth" element={(<AuthForm />)} />
        <Route path="/incomes" element={<Incomes />} />
      </Routes>
      <ToastContainer position='top-right' autoClose={3000} theme='colored' />
    </>
  )
}

export default App