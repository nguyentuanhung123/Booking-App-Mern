const express = require('express')

const cors = require('cors');
const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs'); //mã hoá khi gửi lên database
const User = require('./models/User.js');
require('dotenv').config()//giúp quản lý và tải các biến môi trường từ một file .env và đưa chúng vào trong quá trình thực thi ứng dụng.

const app = express()
const port = 4000

const bcryptSalt = bcrypt.genSaltSync(10);//10 : số vòng được sử dụng để tạo ra salt => tăng độ khó để tránh kỹ thuật tấn công băm mật khẩu

//ta cần phân tích cú pháp json
app.use(express.json());

// link to client
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5200',
}))

//console.log("URL mongoose : ",process.env.MONGO_URL);
//kết nối CSDL
mongoose.connect(process.env.MONGO_URL);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', (req, res) => {
  res.send('test ok!')
})


//nguyentuanhung123
//Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try{
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),//đồng bộ hoá băm =>  trả về giá trị băm cuối cùng của mật khẩu
    });
    //res.json({name, email, password});
    res.json(userDoc);
  }catch(e){
    res.status(422).json(e); // 422 : lỗi không thể xử lý được
  }
});

//Login
app.post('/login' , async (req, res) => {
  const {email , password} = req.body;
  const userDoc = User.findOne({email}); //tìm user trong database 
  if(userDoc){
    res.json('found')//view on Network
  }else{
    res.json('not found')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})