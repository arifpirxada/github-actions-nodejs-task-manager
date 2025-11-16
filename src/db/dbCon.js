const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connection is successful')
  })
  .catch((e) => {
    console.log('Connection unsuccessful!', e)
  })
