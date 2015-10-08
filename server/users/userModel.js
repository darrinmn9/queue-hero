var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    unique: true,
    default: null
  },
  password: {
    type: String,
    //required: true
  },
  facebookId: {
    type: String,
    unique: true
    //required: true
  },
  profilePhoto: {
    type: String,
    //required: true,
    default: 'placeholder/image'
  },
  firstName: {
    type: String,
    //required: true
  },
  lastName: {
    type: String,
    //required: true
  },
  phoneNumber: {
    type: Number,
    //required: true
  },
  cardNumber: {
    type: Number,
    //required: true,
    //unique: true
  },
  cvc: {
    type: Number,
    //required: true
  },
  expirationDate: {
    type: String,
    //required: true
  },
  city: {
    type: String,
    //required: true
  },
  billingAddress: {
    type: String,
    //required: true
  },
  state: {
    type: String,
    //required: true
  },
  country: {
    type: String,
    //required: true
  },
  ratings: {
    type: {},
    default: {}
    //required: true
  }
});

module.exports = mongoose.model('User', UserSchema);
