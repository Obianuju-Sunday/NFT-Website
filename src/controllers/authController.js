const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError.js')
// const globalErrorHandler = require('./../controllers/errorController.js')

// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'youremail@gmail.com',
//     pass: 'yourpassword'
//   }
// });

// var mailOptions = {
//   from: 'youremail@gmail.com',
//   to: 'myfriend@yahoo.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

exports.signup = async (req, res, next) => {
    const newUser = await User.create({
        fullName: req.body.fullName,
        userName: req.body.userName,
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
        next(new AppError("Internal server error", 500))
    }
};

// exports.login = async (req, res, next) => {
//     const { email, password } = req.body;

//     try {
//         // Check email and password exist
//         if (!email || !password) {
//             return next(new AppError('Please provide email and password!', 404))
//         }

//         // Check is user exist and password is correct
//         const user = await User.findOne({ email }).select('+password');

//         //  If everything is ok, send token to client
//         const token = "";
//         res.status(200).json({
//             status: 'Success!',
//             token: ''
//         })
//     } catch (error) {
//         next(new AppError("Internal server error", 500))
//     }
// };

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check if email and password are provided
        if (!email || !password) {
            return next(new AppError('Please provide email and password!', 400));
        }

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new AppError('Incorrect email or password!', 401));
        }

        // Check if password is correct
        const passwordIsCorrect = await user.correctPassword(password, user.password);
        if (!passwordIsCorrect) {
            return next(new AppError('Incorrect email or password!', 401));
        }

        // If everything is correct, generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Send token to client
        res.status(200).json({
            status: 'Success!',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        next(new AppError("Internal server error", 500));
    }
};


exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();

    if (users.length === 0) {
        return res.status(200).json({
            status: 'Success!',
            message: 'No users found in the database',
            data: {
                users: []
            }
        });
    }

    try {
        res.status(200).json({
            status: 'Success!',
            results: users.length,
            data: {
                users
            }
        })
    } catch (error) {
        next(new AppError("Internal server error", 500))
    }
};

exports.getOneUser = async (req, res, next) => {
    const userId = req.params.userId;

    // Check if userId is not present or invalid
    if (!userId || userId.length < 24 || /[^a-zA-Z0-9]/.test(userId)) {
        return next(new AppError("Please provide a valid user ID. IDs must be 24 characters long and can only contain letters and numbers.", 400));
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        res.status(200).json({
            status: 'Success!',
            data: {
                user
            }
        });
    } catch (error) {
        next(new AppError("Internal server error", 500))
    }
};



exports.updateUser = async (req, res, next) => {
    const userId = req.params.userId;
    const dataToUpdate = req.body;
    const options = { new: true }

    // Check if userId is not present or invalid
    if (!userId || userId.length < 24 || /[^a-zA-Z0-9]/.test(userId)) {
        return next(new AppError("Please provide a valid user ID. IDs must be 24 characters long and can only contain letters and numbers.", 400));
    }

    try {

        // Check if the user exists in the database before updating
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return next(new AppError("User not found", 404));
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, dataToUpdate, options
        )

        res.status(200).json({
            status: 'Success!',
            data: {
                message: "User updated successfully!",
                user: updatedUser
            },
        })

    } catch (error) {
        next(new AppError("Internal server error", 500))
    }
}

exports.deleteUser = async (req, res, next) => {

    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
        return next(new AppError("User not found", 404));
    }
    try {
        const updatedUserList = await User.find();
        res.status(200).json({
            status: 'Success!',
            data: {
                message: `User ${user.name} with the id ${req.params.userId} has been Deleted`,
                newUserList: updatedUserList,
            }
        });
    } catch (error) {
        next(new AppError("Internal server error", 500))
    }
};

// const registerUser = async (req, res) => {
//     try {
//         const { fullName, userName, email, password, passwordConfirm } = req.body;

//         // Check if all required fields are provided
//         if (!fullName || !userName || !email || !password || !passwordConfirm) {
//             return res.status(400).json('All fields are required!');
//         }

//         // Check if email is valid
//         if (!validator.isEmail(email)) {
//             return res.status(400).json('Email must be valid!!');
//         }

//         // Check if password is strong
//         if (!validator.isStrongPassword(password)) {
//             return res.status(400).json('Password must be a strong one!! Must contain at least one uppercase letter, lowercase letter, a number and a special character');//one uppercase letter, lowercase letter, a number and a special character
//         }

//         // Check if passwords match
//         if (password !== passwordConfirm) {
//             return res.status(400).json('Passwords do not match!');
//         }

//         // Check if user with the same email already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json('User with email already exists...');
//         }

//         // Create a new user
//         const newUser = await User.create({
//             fullName,
//             userName,
//             email,
//             password,
//             passwordConfirm
//         });

//         // Generate JWT token
//         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRES_IN
//         });

//         // Return success response
//         res.status(201).json({
//             status: 'success',
//             token,
//             data: {
//                 user: newUser
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json('Internal server error');
//     }
// };



    // const loginUser = async (req, res) => {
    //     try {
    //         const { email, password } = req.body;

    //         // Check if email and password are provided
    //         if (!email || !password) {
    //             return res.status(400).json({ error: 'Please provide email and password!' });
    //         }

    //         // Find user by email
    //         const currentUser = await User.findOne({ email }).select('+password');

    //         // Check if user exists
    //         if (!currentUser) {
    //             return res.status(404).json({ error: 'User not found!' });
    //         }

    //         // Compare passwords
    //         const passwordIsCorrect = await bcrypt.compare(password, currentUser.password);
    //         console.log(passwordIsCorrect);

    //         // Check if password is correct
    //         if (!passwordIsCorrect) {
    //             return res.status(400).json({ error: 'Incorrect email or password!' });
    //         }

    //         // Generate JWT token
    //         const token = jwt.sign({ id: currentUser._id, status: currentUser.status }, process.env.ACCESS_TOKEN);

    //         // Send token and user information to client
    //         return res.header({ 'auth-token': token }).json({ token, username: currentUser.username });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ error: 'Internal server error' });
    //     }
    // };


    // const changeUserPassword = async (req, res, next) => {};

    // const logoutUser = async (req, res, next) => {
    //     req.user = null;
    //     next();
    // };

    // const forgotUserPassword = async (req, res, next) => {};


