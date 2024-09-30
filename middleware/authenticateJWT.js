
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, resp, next) => {
    if(!req.header('Authorization')){
        // const req.header('Authorization').split(' ')[1];
        return resp.status(401).json({msg:'send authorization'})

    }
    const token = req.header('Authorization').split(' ')[1];

    if (!token) {
        return resp.status(401).json({ msg: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        return resp.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authenticateJWT;


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<userToken>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


