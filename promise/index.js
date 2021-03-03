// const Promise = require('./promise')

// const Promise = require("./promise");

let p = new Promise((resolve, reject) => { 
  resolve(100)
}).then(data => { 
  console.log('data:', data)
}, reason => {
  console.log('reason:', reason)
})