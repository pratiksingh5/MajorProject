let mongoose = require('mongoose');
let plm = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/YugMajor')
.then(function(){
  console.log('database connected')
})
.catch(function(e){
  console.log(e)
})

let UserSchema = mongoose.Schema({
  username : String,
  password : String,
  email : String,
  about: String
})

UserSchema.plugin(plm);

module.exports =  mongoose.model('users', UserSchema)