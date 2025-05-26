const express = require('express');
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

//router.route('/user/:userId')
//  .get(getShopByUser);

module.exports = router;