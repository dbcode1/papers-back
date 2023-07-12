const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

require("dotenv").config();

const User = require('../models/User');

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

router.post('/login', 
  body('email').isEmail().normalizeEmail(), 
  body('password').isLength({
  min: 6
}), async (req, res) => {
  
  const errors = validationResult(req);
  console.log("errors", errors.array())
  if (!errors.isEmpty()) {
      return res.status(400).json({
          success: false,
          errors: errors.array()
      });
  }


	const { email, password } = req.body;
	
	try {
		let user = await User.findOne({ email });

		if (!user) {
			return res.status(400).send({ errors: [{ msg: 'No user exists' }] });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			console.log('no password match');
			return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
		}

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: 360000 },
			(err, token) => {
				if (err) throw err;
				res.json({ token });
			}
		);
	} catch (err) {
		console.error(err.message);
	}
});

router.post('/logout', async (req, res) => {
	req.user = ""
	req.header('x-auth-token') = null
	res.json('User logged out')
})

module.exports = router;
