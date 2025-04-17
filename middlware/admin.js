const jwt = require('jsonwebtoken');
const Users = require('../model/user'); 
const JWT_SECRET = process.env.JWT_SECRET || 'asdxasdxajtdmwajtdmw';

const admin = async (req, res, next) => {
    try {
        const token = req.header('token');
        console.log("Received Token:", token); 

        if (!token) {
            return res.status(401).json({ msg: "No token available" });
        }

        const verified = jwt.verify(token, JWT_SECRET);
        console.log("Verified User ID:", verified.id); 
        if (!verified) {
            return res.status(401).json({ msg: "Token verification failed" });
        }

        const user = await Users.findById(verified.id);
        if (!user || user.type !== "admin") {
            return res.status(403).json({ msg: "You're not authorized as an admin" });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        console.error(e); 
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = admin;