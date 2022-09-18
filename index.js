require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.urlencoded({extended: false}));

app.use('/images', express.static('assets'));

app.use('/',require('./src/routers'));

const port = process.env.PORT;

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Running server'
  })
})

app.use('*',(req, res)=>{
    return res.status(404).json({
      success: false,
      message: 'Not Found'
    });
  });

app.listen(port, ()=>{
    console.log(`Our server is running on port: ${port}`);
});


