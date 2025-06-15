const express = require('express');
const router = express.Router();
const {
  createSeller,
  getAllSellers,
  getSellerById,
  updateSeller,
  deleteSeller
} = require('../controllers/sellerController');

// CRUD routes for sellers
router.post('/', createSeller);
router.get('/', getAllSellers);
router.get('/:id', getSellerById);
router.put('/:id', updateSeller);
router.delete('/:id', deleteSeller);

module.exports = router;
