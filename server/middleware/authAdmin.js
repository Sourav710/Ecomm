const Users = require('../models/userModel');

const authAdmin = async(req, res, next) => {
    try {
        const user = await Users.findById(req.user.id);
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied: Admins only' });
        }
        next();
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
}

module.exports = authAdmin;