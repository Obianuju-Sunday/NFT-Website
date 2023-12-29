const User = require('./../models/user');
const jwt = require('jsonwebtoken')

exports.signup = async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    try {
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (error) {
        res.status(501).json({ message: error.message })
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check email and password exist
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password!' })
        }

        // Check is user exist and password is correct
        const user = await User.findOne({ email }).select('+password');

        console.log(user);

        //  If everything is ok, send token to client
        const token = "";
        res.status(200).json({
            status: 'Success!',
            token: ''
        })
    } catch (error) {
        res.status(501).json({ message: error.message })
    }
};

exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();

    try {
        res.status(200).json({
            status: 'Success!',
            results: users.length,
            data: {
                users
            }
        })
    } catch (error) {
        res.status(501).json({ message: error.message })
    }
};


// // Router.post('/post', async (req, res) => {
// //     const data = new Model({
// //         name: req.body.name,
// //         email: req.body.email
// //     })

// //     try {
// //         const dataToSave = await data.save()
// //         res.status(200).json(dataToSave)
// //     } catch (error) { 
// //         res.status(501).json({message: error.message})
// //     }
// // })
