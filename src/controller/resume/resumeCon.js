const Resume = require('../../models/resumeModel/resume');
const { uploadFile, deleteFile, getFileDetails } = require('../../utiles/imagekit');

async function uploadResume(req, res) {
    try {
        console.log("🔥 CONTROLLER STARTED");

        console.log("📦 FILE CHECK:", req.file);

        // ❌ STEP 1: FILE CHECK
        if (!req.file) {
            console.log("❌ NO FILE RECEIVED");
            return res.status(400).json({ message: 'Resume file is required.' });
        }

        console.log("📄 FILE NAME:", req.file.originalname);
        console.log("🧠 MIME TYPE:", req.file.mimetype);
        console.log("📏 FILE SIZE:", req.file.size);

        console.log("📦 BUFFER EXISTS:", !!req.file.buffer);
        console.log("📦 BUFFER SIZE:", req.file.buffer?.length);

        // ❌ STEP 2: DB CHECK BEFORE UPLOAD
        console.log("🔍 CHECKING EXISTING RESUME...");
        const existingResume = await Resume.findOne().sort({ createdAt: -1 });
        console.log("📄 EXISTING RESUME:", existingResume);

        // ❌ STEP 3: IMAGEKIT UPLOAD
        console.log("☁️ STARTING IMAGEKIT UPLOAD...");

        const uploadedResume = await uploadFile(req.file);

        console.log("✅ IMAGEKIT RESPONSE:", uploadedResume);

        if (!uploadedResume || !uploadedResume.url) {
            console.log("❌ IMAGEKIT FAILED");
            return res.status(500).json({ message: 'Upload failed at ImageKit' });
        }

        // ❌ STEP 4: DB SAVE
        console.log("💾 SAVING TO DATABASE...");

        const resume = await Resume.findOneAndUpdate(
            {},
            {
                fileName: req.file.originalname,
                fileUrl: uploadedResume.url,
                fileId: uploadedResume.response?.fileId
            },
            { new: true, upsert: true }
        );

        console.log("✅ DB SAVED:", resume);

        // ❌ STEP 5: DELETE OLD FILE
        if (existingResume?.fileId) {
            console.log("🗑 DELETING OLD FILE:", existingResume.fileId);
            await deleteFile(existingResume.fileId);
        }

        // ❌ STEP 6: RESPONSE
        console.log("🎉 SUCCESS RESPONSE SENT");

        return res.status(201).json({
            message: 'Resume uploaded successfully.',
            resume
        });

    } catch (error) {
        console.log("💥 ERROR CAUGHT:", error);
        return res.status(500).json({
            message: 'Error uploading resume.',
            error: error.message
        });
    }
}

async function getResume(req, res) {
    try {
        const resume = await Resume.findOne().sort({ createdAt: -1 });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found.' });
        }

        if (resume.fileId) {
            const fileDetails = await getFileDetails(resume.fileId);

            if (fileDetails?.url && fileDetails.url !== resume.fileUrl) {
                resume.fileUrl = fileDetails.url;
                await resume.save();
            }
        }

        res.status(200).json({ resume });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resume.', error: error.message });
    }
}

async function deleteResume(req, res) {
    try {
        const resume = await Resume.findOne().sort({ createdAt: -1 });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found.' });
        }

        await deleteFile(resume.fileId);
        await Resume.findByIdAndDelete(resume._id);

        res.status(200).json({ message: 'Resume deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting resume.', error: error.message });
    }
}

async function downloadResume(req, res) {
    try {
        const resume = await Resume.findOne().sort({ createdAt: -1 });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found.' });
        }

        let resumeUrl = resume.fileUrl;

        if (resume.fileId) {
            const fileDetails = await getFileDetails(resume.fileId);

            if (fileDetails?.url) {
                resumeUrl = fileDetails.url;

                if (resume.fileUrl !== fileDetails.url) {
                    resume.fileUrl = fileDetails.url;
                    await resume.save();
                }
            }
        }

        const response = await fetch(resumeUrl);

        if (!response.ok) {
            return res.status(502).json({ message: 'Unable to download the resume file.' });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${resume.fileName}"`);
        res.status(200).send(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Error downloading resume.', error: error.message });
    }
}

module.exports = {
    uploadResume,
    getResume,
    deleteResume,
    downloadResume
};
