const Skill = require('../../models/skillModel/skill'); 


async function addSkill(req, res) {
    try {
        const { name, icon } = req.body;    
        const skill = new Skill({ name, icon });
        await skill.save();
        res.status(201).json({ message: 'Skill added successfully', skill });
    } catch (error) {
        res.status(500).json({ message: 'Error adding skill', error: error.message });
    }   
}

async function getAllSkills(req, res) {
    try {
        const skills = await Skill.find();
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching skills', error: error.message });
    }
}

async function deleteSkill(req, res) {
    try {
        const skillId = req.params.id;  
        const deletedSkill = await Skill.findByIdAndDelete(skillId);    
        if (!deletedSkill) {
            return res.status(404).json({ message: 'Skill not found' });
        }   
        res.status(200).json({ message: 'Skill deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting skill', error: error.message });
    }   
}

async function updateSkill(req, res) {
    try {
        const skillId = req.params.id;  
        const { name, icon } = req.body;    
        const updatedSkill =    await Skill.findByIdAndUpdate(skillId, { name, icon }, { new: true });
        if (!updatedSkill) {
            return res.status(404).json({ message: 'Skill not found' });
        }       
        res.status(200).json({ message: 'Skill updated successfully', skill: updatedSkill });
    } catch (error) {           
        res.status(500).json({ message: 'Error updating skill', error: error.message });
    }
}

module.exports = {
    addSkill,
    getAllSkills,   
    deleteSkill,
    updateSkill
};  