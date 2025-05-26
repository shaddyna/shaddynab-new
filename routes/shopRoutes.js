/*const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');    
const { createShop, getShops, getShop, updateShop, deleteShop } = require('../controllers/shopController');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getShops)
  .post(protect, upload.single('image'), createShop);

router.route('/:id')
  .get(getShop)
  .put(protect, updateShop)
  .delete(protect, deleteShop);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');    
const upload = require('../middleware/uploadMiddleware');
const {
  createShop,
  getShops,
  getShop,
  getMyShop,
  updateShop,
  deleteShop,
} = require('../controllers/shopController');

// Public & authenticated routes
router.route('/')
  .get(getShops)
  .post(protect, upload.single('image'), createShop);

// Authenticated route to get the logged-in seller’s shop
router.get('/my-shop',protect, getMyShop);

// Routes by shop ID
router.route('/:id')
  .get(getShop)
  .put(protect, updateShop)
  .delete(protect, deleteShop);

module.exports = router;
