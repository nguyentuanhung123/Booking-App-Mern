const express = require('express')

const cors = require('cors');
const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs'); //mã hoá khi gửi lên database
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const cookieParser = require('cookie-parser'); //phần mềm trung gian để đọc cookie
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config()//giúp quản lý và tải các biến môi trường từ một file .env và đưa chúng vào trong quá trình thực thi ứng dụng.

const app = express()
const port = 4000

const bcryptSalt = bcrypt.genSaltSync(10);//10 : số vòng được sử dụng để tạo ra salt => tăng độ khó để tránh kỹ thuật tấn công băm mật khẩu
const jwtSecret = 'hvkarbvpWEVBEupivew';// một chuỗi bất kỳ giúp mã hoá

//ta cần phân tích cú pháp json
app.use(express.json());
// đọc cookie
app.use(cookieParser());
// xem ảnh khi có link ảnh
app.use('/uploads', express.static(__dirname+'/uploads'));//http://localhost:4000/uploads/photo1706931498409.jpg

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
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email }); // Find user with the provided email in the database
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password); // Compare hashed password with provided password
    if (passOk) {
      // Generate a JSON Web Token (JWT) if the password is correct
      jwt.sign({ 
        email: userDoc.email, 
        id: userDoc._id, 
      }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        // Set the JWT as a cookie and respond with 'pass ok'
        res.cookie('token', token).json(userDoc);//View on Response Headers (Set Cookie) , hàm này chủ chạy sau khi frontend chạy xong
      });
    } else {
      // Respond with 'pass not ok' if the password does not match
      res.status(422).json('pass not ok');
    }
  } else {
    // Respond with 'not found' if the user with the provided email is not found
    res.json('not found');
  }
});

app.get('/profile', (req, res) => {
  const {token} = req.cookies;
  if(token){
    //giải mã
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if(err) throw err; 
      const {name, email, _id} = await User.findById(userData.id);
      res.json({name, email, _id});
    })
  }else{
    res.json(null);
  }
})

app.post('/logout' , (req, res) => {
  res.cookie('token', '').json(true);
})


//console.log({__dirname});//E:\\document\\MERN STACK\\Booking App\\api

app.post('/upload-by-link' , async (req,res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  // const originalPath = __dirname;
  // const updatedPath = originalPath.replace(/\\/g, '/');

  await imageDownloader.image({
    url: link,
    dest: __dirname + '\\uploads\\' + newName
  });
  res.json(newName)//"photo1706971412264.jpg"
})

//Dòng này khởi tạo phần mềm trung gian multer, chỉ định thư mục đích cho các tệp đã tải lên là 'uploads/'.
const photosMiddleware = multer({dest:'uploads\\'}) //Không có dấu gạch chéo vẫn ra
//Tuyến này xử lý yêu cầu POST tới '/upload' và sử dụng photosMiddleware để xử lý các tệp đã tải lên. Nó yêu cầu các tệp có tên trường 'ảnh' và cho phép tối đa 100 tệp.
app.post('/upload', photosMiddleware.array('photos', 100),(req, res) => {
  //console.log("Request files : ", req.files);
  //bug : những file được tải lên đang là jpeg và không được hỗ trợ mỡ rộng nên phải bổ sung đoạn code bên dưới
  const uploadedFiles = [];
  for(let i = 0; i < req.files.length; i++){
    const {path, originalname} = req.files[i];
    //path: 'uploads\\9060f25488cd4352614f491b27430268'
    //originalname: 'Screenshot (15).png'
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    //Mã xây dựng một đường dẫn mới bằng cách nối thêm phần mở rộng tệp vào đường dẫn ban đầu và đổi tên tệp bằng fs.renameSync.
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads\\',''));// bỏ uploads\\ trong đường dẫn đẻ chỉ có tên file ảnh (Example : "2374e424e32013f13386a0e8a558bd60.png")
  }
  //res.json(req.files)
  res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
  const {token} = req.cookies;
  const {
    title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if(err) throw err; 
    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests
    });
    res.json(placeDoc);
  })
});

app.get('/places', (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json(await Place.find({owner:id}))
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})