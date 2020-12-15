let mongoose = require('mongoose');

let postSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    postText : String,
    date : {
        type : Date,
        default : new Date()
    }
   
  
})

module.exports = mongoose.model('posts',postSchema )