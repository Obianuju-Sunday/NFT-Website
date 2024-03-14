const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    maxLength: [32, 'Your full name must not exceed 32 characters'],
    minLength: [8, 'Your user name must be more than 8 characters'],
    required: [true, 'Please tell us your full name!']
  },
  userName: {
    type: String,
    maxLength: [18, 'Your user name must not exceed 18 characters'],
    minLength: [3, 'Your user name must be more than 3 characters'],
    required: [true, 'Please tell us your user name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email address.']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minLength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: [true, 'Please confirm your password!'],
    validate: {
      //  This only work on create and save!!
      validator: function(el) {
        return el === this.password
      },
      message: 'Passwords are not the same!'
    }
  }
});

userSchema.pre('save', async function(next) {
  //  Only run this func if password was modified
  if(this.isModified('password')) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm
  this.passwordConfirm = undefined;
  next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
