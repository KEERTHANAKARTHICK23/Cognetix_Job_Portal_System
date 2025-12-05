const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, applicationController.applyForJob);
router.get('/job/:jobId', auth, applicationController.getJobApplications);
router.get('/my-applications', auth, applicationController.getMyApplications);
router.put('/:id/status', auth, applicationController.updateApplicationStatus);

module.exports = router;
