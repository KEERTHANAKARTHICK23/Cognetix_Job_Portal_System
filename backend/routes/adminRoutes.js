const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');

router.get('/stats', auth, adminController.getStats);
router.get('/users', auth, adminController.getAllUsers);
router.delete('/users/:id', auth, adminController.deleteUser);
router.put('/jobs/:id/status', auth, adminController.updateJobStatus);

module.exports = router;
