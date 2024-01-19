const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError.js')
// const globalErrorHandler = require('./../controllers/errorController.js')

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

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check email and password exist
        if (!email || !password) {
            return next(new AppError('Please provide email and password!', 404))
        }

        // Check is user exist and password is correct
        const user = await User.findOne({ email }).select('+password');

        //  If everything is ok, send token to client
        const token = "";
        res.status(200).json({
            status: 'Success!',
            token: ''
        })
    } catch (error) {
        next(new AppError("Internal server error", 500))
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
