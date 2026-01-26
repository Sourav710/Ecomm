const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ msg: 'Invalid authentication' });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err) return res.status(401).json({msg: 'Invalid authentication'});
            req.user = user;
            next();
        });

    } catch (err) {
        res.status(500).json({ msg: 'Invalid token', error: err.message });
    }
}

module.exports = auth;