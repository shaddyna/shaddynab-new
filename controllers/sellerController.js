const Seller = require('../models/Seller');

// @desc    Create a new seller
// @route   POST /api/sellers
exports.createSeller = async (req, res) => {
  try {
    const { name, email, phoneNumber, mpesaCode, amount, status } = req.body;

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Seller already exists with this email' });
    }

    const newSeller = new Seller({
      name,
      email,
      phoneNumber,
      mpesaCode,
      amount,
      status
    });

    const savedSeller = await newSeller.save();
    res.status(201).json(savedSeller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all sellers
// @route   GET /api/sellers
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    res.status(200).json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a seller by ID
// @route   GET /api/sellers/:id
exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a seller
// @route   PUT /api/sellers/:id
exports.updateSeller = async (req, res) => {
  try {
    const updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(updatedSeller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a seller
// @route   DELETE /api/sellers/:id
exports.deleteSeller = async (req, res) => {
  try {
    const deleted = await Seller.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
