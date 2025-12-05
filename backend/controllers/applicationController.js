const Application = require('../models/Application');
const Job = require('../models/Job');

// Apply for a job (Candidate only)
exports.applyForJob = async (req, res) => {
    try {
        const { jobId, resumeLink } = req.body;

        if (req.user.role !== 'candidate') {
            return res.status(403).json({ message: 'Access denied. Candidates only.' });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({ jobId, candidateId: req.user.id });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const newApplication = new Application({
            jobId,
            candidateId: req.user.id,
            resumeLink,
        });

        const application = await newApplication.save();
        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get applications for a job (Employer only)
exports.getJobApplications = async (req, res) => {
    try {
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('candidateId', 'name email')
            .populate('jobId', 'title');

        // Check if user is the employer of the job
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (job.employerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get my applications (Candidate only)
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ candidateId: req.user.id })
            .populate('jobId', 'title company location status');
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update application status (Employer only)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        let application = await Application.findById(req.params.id).populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user is the employer
        if (application.jobId.employerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        application.status = status;
        await application.save();
        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
