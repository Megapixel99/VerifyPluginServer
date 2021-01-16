const jwt = require('jsonwebtoken');
require('./env.js');
const token = jwt.sign({
  loc: "",
},
process.env.AUTH_STRING);

console.log(token);
