const Job = require('../models/Job');

// Get all jobs (Public)
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'approved' }).populate('employerId', 'name email');
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get job by ID (Public)
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employerId', 'name email');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Create a job (Employer only)
exports.createJob = async (req, res) => {
    try {
        const { title, description, company, location, salary } = req.body;

        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Access denied. Employers only.' });
        }

        const newJob = new Job({
            title,
            description,
            company,
            location,
            salary,
            employerId: req.user.id,
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Update a job (Employer only)
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check user
        if (job.employerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Delete a job (Employer only)
exports.deleteJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check user
        if (job.employerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await Job.findByIdAndRemove(req.params.id);
        res.json({ message: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get employer jobs
exports.getEmployerJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employerId: req.user.id });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
