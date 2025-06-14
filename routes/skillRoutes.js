const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { createSkill, getSkills, getSkill, updateSkill, deleteSkill,  getSkillsByUser } = require('../controllers/skillController');
const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware');    

router.route('/')
  .get(getSkills)
  .post(protect, upload.array('images', 3), createSkill);

/*router.route('/:id')
  .get(getSkill)
  .put(authenticate, authorize('seller'), updateSkill)
  .delete(authenticate, authorize('seller'), deleteSkill);*/

router.route('/user/:userId')
  .get(protect, getSkillsByUser);


router.get('/user/:userId', authorize, getSkillsByUser);

module.exports = router;

