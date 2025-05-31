const errorHandler = require("../utils/error_handler");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require("../model/user");
const Content = require("../model/content");
const getMessage = require("../utils/message");
const crypto = require('crypto');
// const ElasticEmail = require('elastic-email').default;
// const client = ElasticEmail.Client(process.env.ELASTIC_EMAIL_API_KEY);
const SALT = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'asdxasdxajtdmwajtdmw';
const register = errorHandler(async (req, res) => {
    const { image, firstname, lastname, email, password, gender, type } = req.body;
    const {language} = req.query;
    
    if (!language || !['ar', 'en'].includes(language)) {
        return res.status(400).json({ message: getMessage('invalidLanguage', language) });
    }
    if (!firstname || !lastname || !email || !password || !gender) {
        return res.status(400).send({ 
            message: getMessage('invalidRequest', language)
        });
    }
    
    const existing = await Users.findOne({ email });
    if (existing) {
        return res.status(400).send({ message: getMessage('emailAlreadyExists', language) });
    }
    
    const hashedPassword = await bcrypt.hash(password, SALT);
    
    const user = new Users({
        image,
        firstname,
        lastname,
        email,
        password: hashedPassword,
        gender,
        type
    });
    
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    user.password = undefined;
    
    res.status(200).json({ token, message: getMessage('registrationSuccess', language), ...user._doc });
});

const login = errorHandler(async (req, res) => {
    const { email, password } = req.body;
    const {language} = req.query;
    if (!email || !password) {
        return res.status(400).send({ 
            message: getMessage('invalidRequest', language) 
        });    
    }
    
    if (!language || !['ar', 'en'].includes(language)) {
        return res.status(400).json({ message: getMessage('invalidLanguage', language) });
    }
    const user = await Users.findOne({ email });
    if (!user) {
        return res.status(404).send({ 
            message: getMessage('userNotFound', language) 
        });      
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send({ message: getMessage('invalidPassword', language) });
    }
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    
    res.status(200).json({
        message: getMessage('loginSuccess', language),
        token,
    _id: user._id
    });
});
const profile = errorHandler(async (req, res) => {
    const userId = req.user.id;
    const { language } = req.query;

    if (!language || !['ar', 'en'].includes(language)) {
        return res.status(400).json({ message: getMessage('invalidLanguage', language) });
    }

    const user = await Users.findById(userId).populate('content');
    if (!user) {
        return res.status(404).json({ message: getMessage('userNotFound', language) });
    }

    res.status(200).json({
        user: {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            gender: user.gender,
            image: user.image,
            selectedTopics: user.selectedTopics 
        }
    });
});
// const sendVerificationCode = errorHandler(async (req, res) => {
//     const { email } = req.body;
//     const { language } = req.query;

//     if (!language || !['ar', 'en'].includes(language)) {
//         return res.status(400).json({ message: getMessage('invalidLanguage', language) });
//     }

//     const user = await Users.findOne({ email });
//     if (!user) {
//         return res.status(404).send({ message: getMessage('userNotFound', language) });
//     }

//     const verificationCode = crypto.randomBytes(3).toString('hex');
//     user.verificationCode = verificationCode;
//     user.verificationCodeExpires = Date.now() + 3600000; 
//     await user.save();

//     const emailData = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Reset Password Verification Code',
//         body: `Your verification code is: ${verificationCode}`,
//     };

//     try {
//         await client.email.send(emailData);
//         res.status(200).send({ message: getMessage('verificationCodeSent', language) });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send({ message: 'Failed to send verification code. Please try again later.' });
//     }
// });
// const restPassword = errorHandler(async (req, res) => {
//     const { email, verificationCode, newPassword } = req.body;
//     const { language } = req.query;
//     if (!language || !['ar', 'en'].includes(language)) {
//         return res.status(400).json({ message: getMessage('invalidLanguage', language) });
//     }
//     const user = await Users.findOne({ email });
//     if (!user || user.verificationCode !== verificationCode || 
//         user.verificationCodeExpires < Date.now()) {
//         return res.status(400).send({
//              message: getMessage(
//                 'invalidVerificationCode',
//                  language
//                 )
//              });
//     }
//     user.password = await bcrypt.hash(newPassword, SALT);
//     user.verificationCode = undefined;
//     user.verificationCodeExpires = undefined;
//     await user.save();
//     res.status(200).send({ message: getMessage('passwordResetSuccess', language) });

// })
module.exports = {
          register,
          login,
          profile,
         // sendVerificationCode,
          //restPassword
}