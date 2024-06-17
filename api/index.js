const express = require('express')

const cors = require('cors');
const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs'); //mã hoá khi gửi lên database
const jwt = require('jsonwebtoken');

//mongoose
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');

const cookieParser = require('cookie-parser'); //phần mềm trung gian để đọc cookie
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config()//giúp quản lý và tải các biến môi trường từ một file .env và đưa chúng vào trong quá trình thực thi ứng dụng.

const nodemailer = require("nodemailer");

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

const allowedOrigins = ['http://localhost:5200', 'http://localhost:5173'];

// link to client
app.use(cors({
  credentials: true,
  // origin: 'http://localhost:5200',
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
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

const getUserDataFromToken = (req) => {
  // jwt.verify(token, jwtSecret, {}, async (err, userData) => {
  //   if(err) throw err;
  //   return userData;
  // }); => Không thể viết thế này vì nó sẽ từ hàm async trả về getUserDataFromToken
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if(err) throw err;
      resolve(userData);
    });
  })
}

// email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nguyentuanhung4529871036@gmail.com",
    pass: "wsybvxozzdykyrij"
  }
})


//nguyentuanhung123
//Register
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role){
    res.status(400).json({
      message: "Please provide fully information",
      success: false,
      error: true
    });
  }
  
  try{
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),//đồng bộ hoá băm =>  trả về giá trị băm cuối cùng của mật khẩu
      role
    });
    //res.json({name, email, password});
    res.status(200).json({
      data: userDoc,
      success: true,
      error: false
    });
  }catch(e){
    res.status(422).json(e); // 422 : lỗi không thể xử lý được
  }
});

// Login
// Sau khi gửi thông tin lên server , server sẽ kiểm tra email và password
// Nếu đúng thì sẽ tạo jwt (token) bao gồm thông tin (tạo từ email , password) và khoá bí mật
// Tạo xong server sẽ trả cho browser (user) token đó và thông tin user đang đăng nhập  
// Phải lưu nó ở Cookies khi được server trả về
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
        role: userDoc.role
      }, jwtSecret, { expiresIn: '10d' }, (err, token) => {
        if (err) throw err;
        // Set the JWT as a cookie and respond with 'pass ok'
        res.cookie('token', token).json({
          data: userDoc,
          message: "pass ok",
          success: true, 
          error:false
        });//View on Response Headers (Set Cookie) , hàm này chủ chạy sau khi frontend chạy xong
      });
    } else {
      // Respond with 'pass not ok' if the password does not match
      res.status(422).json({
        data: {},
        message: "pass not ok",
        sucess: true, 
        error:false
      });
    }
  } else {
    // Respond with 'not found' if the user with the provided email is not found
    res.status(400).json({
      data: {},
      message: "not found",
      sucess: true, 
      error:false
    });
  }
});

// Hàm này trả về thông tin chi tiết của user đang đăng nhập
// Trang sử dụng hàm này là <UserContext />
// Lý do sử dụng : Sau hhi đăng nhập và chuyển đến trang chủ thì khi refresh sẽ mất hết dữ liệu của user đã đăng nhập dù cookie vẫn còn lưu
// Sử dụng hàm này giúp chúng ta khi refresh , nó sẽ gửi cookies lên server và trả về thông tin của user trong cookies đó (Xem chi tiết ở <UserContext />)
app.get('/profile', (req, res) => {
  const {token} = req.cookies;
  if(token){
    //giải mã
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if(err) throw err; 
      const {name, email, role, _id, gender, dateOfBirth, phone} = await User.findById(userData.id);
      res.json({name, email, role, _id, gender, dateOfBirth, phone});
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

// Tạo place cho user đang đăng nhập
// Sau khi tạo xong thì place đó sẽ được hiển thị ở IndexPage
// Trang sử dụng hàm này : <PlacesFormPage />
app.post('/places', (req, res) => {
  const {token} = req.cookies;
  const {
    title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if(err) throw err; 
    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, photos:addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests, price
    });
    res.json(placeDoc);
  })
});

// Cung cấp các place mà user đang đăng nhập đã đăng lên ứng dụng
// Trang sử dụng hàm này : <PlacesPage />
// PlacesPage là trang hiển thị danh sách các place của user đang đăng nhập đã đăng
app.get('/user-places', (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json(await Place.find({owner:id}))
  });
});

// Trang sử dụng hàm này là : <PlacePage />
// PlacePage là trang hiển thị thông tin chi tiết của place đó
// Hàm này giúp cung cấp thông tin chi tiết của place đó
app.get('/places/:id', async (req, res) => {
  const {id} = req.params;
  res.json(await Place.findById(id));
  //res.json(req.params);//id: "65be...ef"
})

// Sửa lại thông tin của một place nào đó 
// Yêu cầu để sửa lại thông tin : user đang đăng nhập phải trùng với ở database mới có thể sửa
// Trang sử dụng hàm này là : <PlacesFormPage />
app.put('/places', async (req, res) => {
  const {token} = req.cookies;
  const {
    id, title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    // console.log("User Id : ", userData.id);
    // console.log("Owner : ", placeDoc.owner.toString());
    if(userData.id === placeDoc.owner.toString()){
      console.log({price});
      placeDoc.set({
        title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests,price
      })
      await placeDoc.save();
      res.json('OK');
    }
  });
});

//delete 
app.delete('/user-places/:id' , async (req, res) => {
    const userData = await getUserDataFromToken(req);
    const {id} = req.params;
    try{
      const placeDoc = await Place.findById(id);
      if (!placeDoc) {
        return res.status(404).json({ error: 'Place not found' });
      }
      if (userData.id !== placeDoc.owner.toString()) {
        return res.status(403).json({ error: 'Unauthorized: You are not the owner of this place' });
      }
      await Place.deleteOne({ _id: id });
      res.json({ message: 'Place deleted successfully' });
    }catch(e){
      console.error('Error deleting place:', e);
      res.status(500).json({ e: 'Internal Server Error' });
    }
})  

// In tất cả các place có trong database (res.json(await Place.find());)
// Đăng nhập bằng tài khoản khác thì vẫn còn 
// Trang sử dụng hàm này : <IndexPage />
app.get('/places', async (req,res) => {
  res.json(await Place.find().populate("owner").sort({ createdAt: -1 }));
})

// Tạo booking mà user đã điền thông tin và gửi lên database
// Page sử dụng hàm này : <BookingWidget /> <Nằm trong PlacePage>
// Không cần thiết dùng async await
// Không thể dùng if (err) throw err như trên vì ta đang gửi data
app.post('/bookings', async(req, res) => {
  const userData = await getUserDataFromToken(req);
  const {
    place, checkIn, checkOut, 
    numberOfGuests, name, phone, price
  } = req.body;
  Booking.create({
    place, checkIn, checkOut, 
    numberOfGuests, name, phone, price,
    user: userData.id
  }).then((doc) => {
      res.json(doc);
  }).catch((err) => {
      throw err;
  })
});


// Cung cấp thông tin chi tiết của các booking mà user đang đăng nhập đã đặt (bao gồm cả thông tin chi tiết của place liên quan đến booking đó)
// Trang sử dụng : <BookingsPage />
app.get('/bookings', async (req, res) => {
  // bởi vì getUserDataFromToken là một promise nên phải thêm async await
  const userData = await getUserDataFromToken(req);
  const bookingData = await Booking.find({user:userData.id}).populate("place");
  //console.log(bookingData);
  res.json(bookingData);
});

app.put('/editProfile', async (req, res) => {
  const userData = await getUserDataFromToken(req);

  const { id, name, gender, phone, dateOfBirth } = req.body

  const payload = {
    ...( name && { name : name } ),
    ...( gender && { gender : gender } ),
    ...( phone && { phone : phone } ),
    ...( dateOfBirth && { dateOfBirth : dateOfBirth } ),
}

  console.log(id);

  const user = await User.findById(userData.id)

  if(id === user.id) {
    const updateUser = await User.findByIdAndUpdate(id, payload)
    return res.json({
      data: updateUser,
      message: "User Updated",
      success: true,
      error: false
    })
  }
})

// send email Link for reset password
app.post("/sendpasswordlink" , async(req, res) => {
  // console.log(req.body);

  const {email} = req.body;
  
  if(!email) {
    res.status(401).json({
      message: "Enter your email",
      status: 401,
      success: false,
      error: true
    })
  }

  try {
    const userfind = await User.findOne({ email: email });

    // token generate for reset password
    const token = jwt.sign({_id: userfind._id}, jwtSecret, {
      expiresIn: "120s"
    })

    const setusertoken = await User.findByIdAndUpdate({_id: userfind._id}, {verifyToken: token}, {new: true});

    if(setusertoken) {
      const mailOptions = {
        from: "nguyentuanhung4529871036@gmail.com",
        to: email,
        subject: "Sending Email For password Reset",
        text: `This Link Valid For 2 MINUTES http://localhost:5200/forgotpassword/${userfind._id}/${setusertoken.verifyToken}`
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
          console.log("error", error);
          return res.status(401).json({
            status: 401,
            message: "Email not send",
            success: false,
            error: true
          })
        } else {
          console.log("Email sent", info.response);
          return res.status(201).json({
            status: 201,
            message: "Email send successfully",
            success: true,
            error: false
          })
        }
      })
    }
   

  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: "invalid user",
      success: false,
      error: true
    })
  }
})

// verify user for forgot password time
app.get("/forgotpassword/:id/:token", async(req, res) => {
  const { id, token } = req.params;

  try {
    const validuser = await User.findOne({ _id: id, verifyToken: token});
    
    const verifyToken = jwt.verify(token, jwtSecret);

    // console.log("verifyToken: ", verifyToken); // { _id: '6643bbc9f04f89ab3f7ce6b3', iat: 1715793431, exp: 1715879831 }

    if(validuser && verifyToken._id) {
      return res.status(201).json({
        status: 201,
        validuser,
        success: true,
        error: false
      })
    } else {
      return res.status(401).json({
        status: 401,
        message: "user not exits",
        success: false,
        error: true
      })
    }
  } catch(err) {
    return res.status(401).json({
      status: 401,
      err
    })
  }
})


// change password

app.post("/:id/:token", async(req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const validuser = await User.findOne({ _id: id, verifyToken: token});
    
    const verifyToken = jwt.verify(token, jwtSecret);

    if(validuser && verifyToken._id) {
      const newPassword = await bcrypt.hash(password, 12);

      const setnewuserpass = await User.findByIdAndUpdate({ _id: id }, { password: newPassword })

      setnewuserpass.save();
      return res.status(201).json({
        status: 201,
        setnewuserpass,
        success: true,
        error: false
      })
    } else {
        return res.status(401).json({
          status: 401,
          message: "user not exits",
          success: false,
          error: true
        })
    }
  } catch(err) {
    return res.status(401).json({
      status: 401,
      err
    })
  }
})

// get owner
app.get('/allAdmin', async (req,res) => {
  res.json(await User.find({ role: "ADMIN" }));
})

// get renter
app.get('/allGeneral', async (req,res) => {
  res.json(await User.find({ role: "GENERAL" }));
})

// get all booking
app.get('/allBookings', async (req,res) => {
  res.json(await Booking.find());
})

// delete user
app.delete('/deleteUser/:id', async (req,res) => {
  try {
    const id = req.params.id;
    const deleteUser = await User.deleteOne({_id: id})
    return res.status(200).json({
      message: "Delete user successfully",
      data: deleteUser,
      error: false,
      success: true
    })
  } catch(err) {
    return res.status(500).json({
      message: err,
      error: true,
      success: false
    })
  }
})

// delete place
app.delete('/deletePlace/:id', async (req,res) => {
  try {
    const id = req.params.id;
    const deletePlace = await Place.deleteOne({_id: id})
    return res.status(200).json({
      message: "Delete place successfully",
      data: deletePlace,
      error: false,
      success: true
    })
  } catch(err) {
    return res.status(500).json({
      message: err,
      error: true,
      success: false
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})