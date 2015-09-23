var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var HotelSchema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String
  },
  city: {
    type: String
  },
  statename: {
    type: String
  },
  total: {
    type: String
  },
  images: [{
    id: {
      type: String
    },
    image: {
      type: String
    },
    thumbnail: {
      type: String
    },
  }],
  rating: [],
  facilities: [{
    id: {
      type: String
    },
    hotel_id: {
      type: String
    },
    facility_id: {
      type: String
    },
    available: {
      type: String
    },
    comment: {
      type: String
    },
    name: {
      type: String
    },
    type: {
      type: String
    },
    description: {
      type: String
    },
    icon: {
      type: String
    }
  }]

});


module.exports = mongoose.model('Hotels', HotelSchema);