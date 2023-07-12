const express = require('express');
let router = express.Router();

const auth = require('../middleware/auth');

const Container = require('../models/Container');
const User = require('../models/User')

// add a container

router.post('/', auth, async (req, res) => {
	try {
		const { title } = req.body;
		let container = await Container.findOne({ title });

		if (container) {
			console.log('')
			return res.json('Container exists').status(500)

		}

		container = new Container({
			title,
			user: req.user.id
		});

		await container.save();
		res.send(container);

		//
	} catch (err) {
		console.log(err.message);
		res.send(err.message);
	}
});

// get containers
router.get('/', auth, async (req, res) => {
	try {
		const container = await Container.find({ user: req.user.id})
	
		res.json(container);
		
	  } catch (err) {
		console.error(err.message);
	
		res.status(500).send('Server Error');
	  }
});

// update
router.get('/update', auth, async (req, res) => {
	try {
		const container = await Container.find({ user: req.user.id})
		console.log(container)
		res.json(container);
		
	
	  } catch (err) {
		console.error(err.message);
	
		res.status(500).send('Server Error');
	  }
});

// delete a container
router.delete('/', auth, async (req, res) => {

	try {
		const { title } = req.body;
		let container = await Container.deleteOne({title});
		res.send(container)
	} catch (err) {
		console.log(err);
		if (err.kind === 'ObjectId') {
			return res.status(500).json({ msg: 'container not found' });
		}
	}
});

module.exports = router;
