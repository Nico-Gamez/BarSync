const { error, success } = require('../utils/apiResponse');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            return error(res, 'E01', 'Incorrect email or password', 401);
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return error(res, 'E01', 'Incorrect email or password', 401);
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '8h'
        });

        return success(res, { token }, 'Login successful');
    } catch (err) {
        console.error('Login error:', err);
        return error(res, 'E99', 'Internal server error', 500);
    }
};
