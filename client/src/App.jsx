import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true; // lưu trũ token vào Cookies trong Application của trình duyệt (ban đầu mới chỉ có ở Response Headers , tức là ta chỉ nhận được token nhưng chưa lưu nó vào Cookies)

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
