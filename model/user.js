const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
          image:
                    {
                              type : String,
                              required: true,  
                              default:"../uploads/profile.jpg"
                    },     
              
          firstname: {
                    required: true,
                    type:String,
                    trim:true

          },
          lastname: {
                    required: true,
                    type:String,
                    trim:true

          },
          email: {
                    required: true,
                    type:String,
                    trim:true,
                    validate:{
                              validator:(value)=>{
                                        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                        return value.match(re);
   
                              },
                              message : 'Please enter a valid email address'
                    }
          },
          password : {
                    required : true,
                    type : String,
                    validate:{
                              validator:(value)=>{

                                        return value.length > 6;
   
                              },
                              message : 'Please enter al long password'
                    }
          },
                     gender: { 
                    type: Number,
                     enum: [0, 1], 
                     required: true 
                    }, // 0 = ذكر، 1 = أنثى
          
          address :{
                    type : String,
                    default : '',
          },
          type : {
                    type: String,
                    default : 'user',
                    enum: ['admin', 'user']

          },
          selectedTopics: {
                    type: [String], 
                    default: []
                },
          content:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Content"
          },
          posts: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }],
        sharedPosts: [{ 
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Post',
      }],

});
const Users = mongoose.model('Users',userSchema);
module.exports = Users;