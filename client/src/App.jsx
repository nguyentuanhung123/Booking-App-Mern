import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import UserContextProvider from './context/UserContext';
import AccountPage from './pages/AccountPage';

axios.defaults.baseURL = 'http://localhost:4000'; // trong trường hợp ở Set-Cookie cái Path bị cảnh báo thì phải đổi đường dẫn đi (Ví dụ : 127.0.0.1:5200)
axios.defaults.withCredentials = true; // lưu trữ token vào Cookies trong Application của trình duyệt (ban đầu mới chỉ có ở Response Headers , tức là ta chỉ nhận được token nhưng chưa lưu nó vào Cookies và đăng nhập lần 2 thì sẽ tự động gửi cookíe lên)

const App = () => {

  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/register' element={<RegisterPage />}></Route>
          <Route path='/account/:subpage?' element={<AccountPage />}></Route>
          <Route path='*' element={<Navigate to="/"/>}></Route>
        </Route>
    </Routes>
    </UserContextProvider>
  )
}

export default App
