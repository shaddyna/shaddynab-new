const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const {
  createMembershipRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  checkPendingRequest // Add this new controller
} = require('../controllers/memberRequestController');
const auth = require('../middleware/authMiddleware');

// PUT THIS ROUTE BEFORE THE /:id ROUTE
router.get('/check', protect, checkPendingRequest);

// POST - Create request (user only)
router.post('/', auth, createMembershipRequest);

// GET - All requests (admin only)
router.get('/', getAllRequests);

// GET - Single request (admin or owner)
router.get('/:id', protect, getRequestById);

// PUT - Update request (admin only)
router.put('/:id',  updateRequest);

// DELETE - Delete request (admin only)
router.delete('/:id', protect, isAdmin, deleteRequest);

module.exports = router;