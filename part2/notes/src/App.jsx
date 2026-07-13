import { useState, useEffect } from "react";
import Notification from './components/Notification'
import Footer from "./components/Footer";
import Note from "./components/Note";
import noteService from "./services/notes";

const App = () => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState("a new note...");
	const [showAll, setShowAll] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		console.log("effect");

		const eventHandler = (initialNotes) => {
			console.log("promise fulfilled");
			setNotes(initialNotes);
		};

		noteService.getAll().then(eventHandler);
	}, []);
	console.log("render", notes.length, "notes");

	const notesToShow = showAll
		? notes
		: notes.filter((note) => note.important === true);

	const toggleImportanceOf = (id) => {
		const note = notes.find((note) => note.id === id);
		const changedNote = { ...note, important: !note.important };

		noteService
			.update(id, changedNote)
			.then((updatedNote) => {
				setNotes(notes.map((note) => (note.id === id ? updatedNote : note)));
			})
			.catch((error) => {
				setErrorMessage(`Note ${note.content} was already removed from server`);
				setTimeout(() => setErrorMessage(null), 5000);
				setNotes(notes.filter((note) => note.id !== id));
			});
	};

	const addNote = (event) => {
		event.preventDefault();
		console.log("button clicked", event.target);
		const noteObject = {
			content: newNote,
			important: Math.random() < 0.5,
			id: String(notes.length + 1),
		};

		noteService.create(noteObject).then((createdNote) => {
			setNotes(notes.concat(createdNote));
			setNewNote("");
		});
	};

	const handleNoteChange = (event) => {
		console.log(event.target.value);
		setNewNote(event.target.value);
	};

	return (
		<div>
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			<div>
				<button onClick={() => setShowAll(!showAll)}>
					show {showAll ? "important" : "all"}
				</button>
			</div>
			<ul>
				{notesToShow.map((note) => (
					<Note
						key={note.id}
						note={note}
						toggleImportance={() => toggleImportanceOf(note.id)}
					/>
				))}
			</ul>

			<form onSubmit={addNote}>
				<input value={newNote} onChange={handleNoteChange} />
				<button type="submit">save</button>
			</form>
			<Footer/>
		</div>
	);
};

export default App;
