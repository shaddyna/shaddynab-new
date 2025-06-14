const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getSellerInquiries,
  getUserInquiries,
  updateInquiryStatus
} = require('../controllers/inquiryController');
const  protect  = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createInquiry);

router.route('/seller')
  .get( getSellerInquiries);

router.route('/user')
  .get( getUserInquiries);

router.route('/:id/status')
  .put( updateInquiryStatus);

module.exports = router;