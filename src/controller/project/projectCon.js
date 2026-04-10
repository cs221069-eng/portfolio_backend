const Project = require('../../models/projectModel/project');
const fs = require('fs');
const path = require('path');
const { uploadImage } = require('../../utiles/imagekit');

function normalizeTags(tags) {
    if (Array.isArray(tags)) {
        return tags.map((tag) => String(tag).trim()).filter(Boolean);
    }

    if (typeof tags === 'string') {
        return tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    return [];
}

function normalizeUrl(url) {
    if (!url || typeof url !== 'string') {
        return '';
    }

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
        return '';
    }

    if (/^https?:\/\//i.test(trimmedUrl)) {
        return trimmedUrl;
    }

    if (/^data:image\//i.test(trimmedUrl)) {
        return trimmedUrl;
    }

    return `https://${trimmedUrl}`;
}

function getScreenshotPath(file) {
    if (!file) {
        return '';
    }

    return `/uploads/projects/${path.basename(file.path)}`;
}

function logUploadedFileBuffer(file) {
    if (!file?.path) {
        return;
    }

    const uploadedFileBuffer = fs.readFileSync(file.path);
    console.log('Uploaded screenshot buffer:', uploadedFileBuffer);
}

function removeUploadedFile(filePath) {
    if (!filePath || !filePath.startsWith('/uploads/projects/')) {
        return;
    }

    const absolutePath = path.resolve(__dirname, '../../../', filePath.replace(/^\//, ''));

    if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
    }
}

async function addProject(req, res) {
    try {
        const { title, shortDescription, details, tags, technology, liveUrl, codeUrl, screenshot, iconClass } = req.body;
        if (req.file) {
            logUploadedFileBuffer(req.file);
        }
        let screenshotPath = normalizeUrl(screenshot);

        if (req.file) {
            const uploadedImage = await uploadImage(req.file);
            screenshotPath = uploadedImage.url;
            removeUploadedFile(getScreenshotPath(req.file));
        }

        const project = new Project({
            title,
            shortDescription,
            details,
            tags: normalizeTags(tags),
            technology,
            liveUrl: normalizeUrl(liveUrl),
            codeUrl: normalizeUrl(codeUrl),
            screenshot: screenshotPath,
            iconClass
        });

        await project.save();
        res.status(201).json({ message: 'Project added successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error adding project', error: error.message });
    }
}

async function getAllProjects(req, res) {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
}

async function updateProject(req, res) {
    try {
        const { title, shortDescription, details, tags, technology, liveUrl, codeUrl, screenshot, iconClass } = req.body;
        if (req.file) {
            logUploadedFileBuffer(req.file);
        }
        const existingProject = await Project.findById(req.params.id);

        if (!existingProject) {
            if (req.file) {
                removeUploadedFile(getScreenshotPath(req.file));
            }
            return res.status(404).json({ message: 'Project not found' });
        }

        let screenshotPath = existingProject.screenshot;

        if (req.file) {
            const uploadedImage = await uploadImage(req.file);
            screenshotPath = uploadedImage.url;
            removeUploadedFile(getScreenshotPath(req.file));
        } else if (typeof screenshot === 'string') {
            screenshotPath = normalizeUrl(screenshot);
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            {
                title,
                shortDescription,
                details,
                tags: normalizeTags(tags),
                technology,
                liveUrl: normalizeUrl(liveUrl),
                codeUrl: normalizeUrl(codeUrl),
                screenshot: screenshotPath,
                iconClass
            },
            { new: true }
        );

        res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
}

async function deleteProject(req, res) {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
}

module.exports = {
    addProject,
    getAllProjects,
    updateProject,
    deleteProject
};
