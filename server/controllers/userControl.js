const Users = require('../models/userModel');





const userController = {
    register: async(req, res) => {
        try {
            const { name, email, password } = req.body;

            // Simple validation
            if (!name || !email || !password) {
                return res.status(400).json({ msg: 'Please enter all fields' });
            }

            // Check for existing user
            await Users.findOne({ email }).then(user => {
                if (user) return res.status(400).json({ msg: 'User already exists' });

                const newUser = new Users({
                    name,
                    email,
                    password
                });

                // Save user
                newUser.save().then(user => {
                    res.status(201).json({ msg: 'User registered successfully', user });
                }).catch(err => {
                    res.status(500).json({ msg: 'Error saving user', error: err.message });
                });
            }).catch(err => {
                res.status(500).json({ msg: 'Error checking existing user', error: err.message });
            });
        } catch (err) {
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
    }
}
module.exports = userController