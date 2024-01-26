import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<IndexPage />}></Route>
        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/register' element={<RegisterPage />}></Route>
        <Route path='*' element={<Navigate to="/"/>}></Route>
      </Route>
    </Routes>
  )
}

export default App
