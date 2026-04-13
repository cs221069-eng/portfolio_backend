const Hero = require('../../models/heroModel/hero');

async function getHeroData(req, res) {
    try {
        const hero = await Hero.findOne({}, {}, { sort: { updatedAt: -1, createdAt: -1 } });

        if (!hero) {
            return res.status(404).json({ message: 'Hero data not found' });
        }

        res.json({ hero });
    } catch (error) {
        console.error('Error fetching hero data:', error);
        res.status(500).json({ message: 'Failed to fetch hero data' });
    }
}

async function uploadHeroData(req, res) {
    try {
        const { description, status } = req.body;

        const hero = new Hero({
            description,
            status,
        });

        await hero.save();
        res.status(201).json({ message: 'Hero data uploaded successfully', hero });
    } catch (error) {
        console.error('Error uploading hero data:', error);
        res.status(500).json({ message: 'Failed to upload hero data' });
    }   
}

async function updateHeroData(req, res) {
    try {
        const { description, status } = req.body;

        const latestHero = await Hero.findOneAndUpdate(
            {},
            {
                description,
                status,
            },
            {
                new: true,
                upsert: true,
                sort: { updatedAt: -1, createdAt: -1 },
            }
        );

        res.json({ message: 'Hero data updated successfully', hero: latestHero });
    } catch (error) {
        console.error('Error updating hero data:', error);
        res.status(500).json({ message: 'Failed to update hero data' });
    }
}

module.exports = {
    getHeroData,
    uploadHeroData,
    updateHeroData,
};
