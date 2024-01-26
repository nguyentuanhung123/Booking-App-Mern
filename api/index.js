const express = require('express')
const cors = require('cors');
const app = express()
const port = 4000

//ta cần phân tích cú pháp json
app.use(express.json());

// link to client
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5200',
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/test', (req, res) => {
  res.send('test ok!')
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  res.json({name, email, password});
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})