const express = require("express");
const app = express();

const cors = require('cors')

const generateId = () => {
	const maxId = notes.length > 0
		? Math.max(...notes.map(n => Number(n.id)))
		: 0
	return String(maxId + 1)
}

let notes = [
	{
		id: "1",
		content: "HTML is easy",
		important: true,
	},
	{
		id: "2",
		content: "Browser can execute only JavaScript",
		important: false,
	},
	{
		id: "3",
		content: "GET and POST are the most important methods of HTTP protocol",
		important: true,
	},
];

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
	res.send("<h1>Hello world!</h1>");
});

app.get("/api/notes", (req, res) => {
	res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
	const id = req.params.id;
	const note = notes.find((note) => note.id === id);

	if (note) {
		res.json(note);
	} else {
		res.statusMessage = `There is no note with the id ${id}`;
		res.status(404).end();
	}
});

app.post("/api/notes", (req, res) => {
	const body = req.body;

	if (!body.content) {
		return res.status(400).json({ error: "content missing" })
	}

	const note = {
		content: body.content,
		important: body.important || false,
		id: generateId()
	}

	notes = notes.concat(note)
	res.json(note)
})

app.put("/api/notes/:id", (req, res) => {
	const id = req.params.id;
	const body = req.body;
	const isExists = notes.some(note => note.id === id);

	if (!isExists) {
		return res.status(404).end()
	}

	if (!body.id) {
		return res.status(400).json({ error: 'id required' })
	}

	if (!body.content) {
		return res.status(400).json({ error: 'content required' })
	}

	if (body.important === null || body.important === undefined) {
		return res.status(400).json({ error: 'important required' })
	}

	const changedNote = {
		id: body.id,
		content: body.content,
		important: body.important
	}

	notes = notes.map(note => note.id === id ? changedNote : note)
	res.json(changedNote)
})

app.delete("/api/notes/:id", (req, res) => {
	const id = req.params.id;
	notes = notes.filter((note) => note.id !== id);
	res.status(204).end();
});

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
	console.log("Server running on port:", PORT);
});
