
const getProfile = async(req, res, next) => {
    if (req.get('profile_id')) {
        const { Profile } = req.app.get('models');
        const profile = await Profile.findOne({ where: { id: req.get('profile_id') || 0 } });
        if(!profile) return res.status(401).end()
        req.profile = profile;
        next();
    } else {
        return res.status(401).end();
    }
};

module.exports = getProfile;