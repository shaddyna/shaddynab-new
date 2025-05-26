/*const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  designer: {
    type: String,
    required: true
  },
  category: {
    main: {
      type: String,
      required: true
    },
    sub: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    }
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  attributes: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);*/

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  designer: {
    type: String,
    required: true
  },
  category: {
    main: {
      type: String,
      required: true
    },
    sub: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    }
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  attributes: {
    type: Object,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shop: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);