const router = require('express').Router();
const User = require('../models/User');

router.get('/users/signin', (req, res) => {
	res.render('users/signin');
});

router.get('/users/signup', (req, res) => {
	res.render('users/signup');
});
router.post('/users/signup', async (req, res) => {
	let errors = [];
	const { name, email, password, confirm_password } = req.body;
	if(name.length <= 2) {
		errors.push({text: 'Please insert a valid name'});
	}
	if(password != confirm_password) {
		errors.push({text: 'Password do not match!'});
	}
	if (password.length < 4) {
		errors.push({text: 'Password must be at least 4 characters'});
	}
	if(errors.length > 0) {
		res.render('users/signup', {errors, name, email, password, confirm_password});
	} else {	
		const emailUser = await User.findOne({ email: email });
		if (emailUser) {
			req.flash('error_msg', 'The Email is already in use');
			res.redirect('/users/signup');
		} else {
		const newUser = new User({ name, email, password });
		newUser.password = await newUser.encryptPassword(password);
		await newUser.save();
		req.flash('success_msg', 'You are registered');
		res.redirect('/users/signin');
	}
}
});
module.exports = router;