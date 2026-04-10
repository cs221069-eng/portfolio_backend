const About = require('../../models/aboutModel/about');

async function uploadAboutInfo(req, res) {
    try {   
        const { description } = req.body;

        let about = await About.findOne();  
        if (about) {
            about.description = description; 
            await about.save();
            return res.json(about);
        }   
        about = new About({ description });
        await about.save();
        res.json(about);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }   
}

async function getAboutInfo(req, res) {
    try {   
        const about = await About.findOne();
        if (!about) {
            return res.status(404).json({ message: 'About information not found' });
        }   
        res.json(about);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }   
}

async function updateAboutInfo(req, res) {
    try {
        const { description } = req.body;
        const about = await About.findOneAndUpdate(
            {},
            { description },
            { new: true, upsert: true }
        );

        res.json({ message: 'About information updated successfully', about });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports = {
    uploadAboutInfo,
    getAboutInfo,
    updateAboutInfo
};  
