const express = require('express')

const testRoutes = require('./endpoints/test/TestRoutes')

const app = express()


/* Adding the Routes */

app.use('/', testRoutes);  //an welcher Stelle wollen wirs reinhängen
//app.use('/user', userRoutes);

const port = 8080
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
