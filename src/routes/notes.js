const router = require('express').Router();

const Note = require('../models/Note');

router.get("/notes/add", (req, res) => {
	res.render('notes/new-note');
});

router.post('/notes/new-note', async (req, res) => {
	const { title, description } = req.body;
	const errors = [];
	if(!title) {
		errors.push({text: 'Please write a Title'});
	}
	if (!description) {
		errors.push({text: 'Please write a Description'});
	}
	if(errors.length > 0) {
		res.render('notes/new-note', {
			errors,
			title,
			description
		});
	} else {
	const newNote = new Note({ title, description });
	await newNote.save();
	res.redirect('/notes');
}
});

router.get('/notes', async (req, res) => {
await Note.find().sort({date: 'desc'})
.then(data => {
	const notesDb = {
		notes: data.map(note => {
			return {
				title: note.title,
				description: note.description,
				_id: note._id
			}
		})
	}
	res.render('notes/all-notes', { notes: notesDb.notes });
});
});

router.get('/notes/edit/:id', async (req, res) => {
	const note = await Note.findById(req.params.id)
	.then(data => {
		return {
			title: data.title,
			description: data.description,
			_id: data._id
		}
	})
	res.render('notes/edit-note', {note});
});

module.exports = router;