const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { get } = require('mongoose');



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

                // Hash password
                const saltRounds = 10;
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = bcrypt.hashSync(password, salt);

                // Create new user

                const newUser = new Users({
                    name,
                    email,
                    password: hashedPassword
                });

                //create jwt to authenticate
                const accessToken = Users.createAccessToken({ id: newUser._id });
                const refreshToken = Users.createRefreshToken({ id: newUser._id });

                res.cookie('refreshToken', refreshToken,{
                    httpOnly: true,
                    path: '/users/refresh_token',
                });
                
                // Save user
                newUser.save().then(user => {
                    res.status(201).json({accessToken});
                }).catch(err => {
                    res.status(500).json({ msg: 'Error saving user', error: err.message });
                });
            }).catch(err => {
                res.status(500).json({ msg: 'Error checking existing user', error: err.message });
            });
        } catch (err) {
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
    },

    refreshToken: async (req, res) => {
        try {
          const refreshToken = req?.cookies?.refreshToken;
          if (!refreshToken) return res.status(401).json({ msg: 'No refresh token provided' });
      
          // verify refreshToken and issue access token here...
          // placeholder response while wiring:
          return res.status(200).json({ msg: 'Refresh token received' });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ msg: 'Server error', error: err.message });
        }
      },
      
      login : async (req, res) => {
        try{
            const { email, password } = req.body;

            const user = await Users.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }
            // Simple validation
            if (!email || !password) {
                return res.status(400).json({ msg: 'Please enter all fields' });
            }
            // Check for existing user

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const accessToken = Users.createAccessToken({ id: user._id });
            const refreshToken = Users.createRefreshToken({ id: user._id });

            res.cookie('refreshToken', refreshToken,{

                httpOnly: true,
                path: '/users/refresh_token',
            });
            res.json({msg: 'logged in successfully', accessToken});
            
        }
        catch(err){
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
      },
      logout: async (req, res) => {
        try {
          res.clearCookie('refreshToken', { path: '/users/refresh_token' });
          return res.status(200).json({ msg: 'Logged out successfully' });
        } catch (err) {
          return res.status(500).json({ msg: 'Server error', error: err.message });
        }
      },
      getUserInfo: async (req, res) => {
        try{
            const user = await Users.findById(req.user.id).select('-password');
            if(!user) return res.status(400).json({msg: 'User does not exist'});
            res.json(user);
        }
        catch(err){
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
      }
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};
Users.createAccessToken = createAccessToken;

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
Users.createRefreshToken = createRefreshToken;


module.exports = userController