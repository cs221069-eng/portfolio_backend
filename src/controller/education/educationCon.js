const Education = require('../../models/educationModel/education');

async function addEducation(req, res) {
    try {
        const { title, place, period, cgpa, detail } = req.body;
        const education = new Education({ title, place, period, cgpa, detail });
        await education.save();
        res.status(201).json({ message: 'Education added successfully', education });
    } catch (error) {
        res.status(500).json({ message: 'Error adding education', error: error.message });
    }
}

async function getAllEducation(req, res) {
    try {
        const educationItems = await Education.find().sort({ createdAt: -1 });
        res.status(200).json(educationItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching education items', error: error.message });
    }
}

async function deleteEducation(req, res) {
    try {
        const educationId = req.params.id;
        const deletedEducation = await Education.findByIdAndDelete(educationId);

        if (!deletedEducation) {
            return res.status(404).json({ message: 'Education item not found' });
        }

        res.status(200).json({ message: 'Education deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting education', error: error.message });
    }
}

async function updateEducation(req, res) {
    try {
        const educationId = req.params.id;
        const { title, place, period, cgpa, detail } = req.body;
        const updatedEducation = await Education.findByIdAndUpdate(
            educationId,
            { title, place, period, cgpa, detail },
            { new: true }
        );

        if (!updatedEducation) {
            return res.status(404).json({ message: 'Education item not found' });
        }

        res.status(200).json({ message: 'Education updated successfully', education: updatedEducation });
    } catch (error) {
        res.status(500).json({ message: 'Error updating education', error: error.message });
    }
}

module.exports = {
    addEducation,
    getAllEducation,
    deleteEducation,
    updateEducation
};
