const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const hash = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            username,
            password: hash
        });
        await user.save();
        req.session.user_id = user._id;
        console.log(user);
        req.flash('success', 'Welcome!');
        res.redirect('/posts');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome Back !');
    const redirectUrl = req.session.returnTo || '/posts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
        }
        req.flash('success', 'You have successfully logged out.');
        return res.redirect('/posts');
    });
}