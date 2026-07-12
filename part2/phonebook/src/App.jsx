import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import { Persons } from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newPhone, setNewPhone] = useState("");
	const [filterValue, setFilterValue] = useState("");
	const [notification, setNotification] = useState(null);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const eventHandler = (initialPersons) => setPersons(initialPersons);

		personService.getAll().then(eventHandler);
	}, []);

	const personsToShow = filterValue
		? persons.filter((person) =>
				person.name.toLowerCase().includes(filterValue.toLowerCase()),
			)
		: persons;

	const handleAddPerson = (event) => {
		event.preventDefault();
		const isNameInPhonebook = persons.some((person) => person.name === newName);

		const createdHandler = (createdPerson) => {
			setPersons(persons.concat(createdPerson));
			setNewName("");
			setNewPhone("");
			setNotification(`Added ${createdPerson.name}`);
			setTimeout(() => setNotification(null), 3000);
		};

		const errorHandler = (person) => {
			return () => {
				setNotification(
					`Information of ${person.name} has already been removed from server`,
				);
				setIsError(true);
				setTimeout(() => {
					(setNotification(null), setIsError(false));
				}, 3000);
			};
		};

		const updatedHandler = (updatedPerson) => {
			setPersons(
				persons.map((person) =>
					person.id === updatedPerson.id ? updatedPerson : person,
				),
			);
			setNewName("");
			setNewPhone("");
			setNotification(`Changed number for ${updatedPerson.name}`);
			setTimeout(() => setNotification(null), 3000);
		};

		if (isNameInPhonebook) {
			const isConfirmed = window.confirm(
				`${newName} is already added to phonebook, replace the old number with a new one?`,
			);

			if (isConfirmed) {
				const person = persons.find((person) => person.name === newName);
				const changedPerson = { ...person, number: newPhone };
				personService
					.update(changedPerson.id, changedPerson)
					.then(updatedHandler)
					.catch(errorHandler(person));
			}
		} else {
			const newPerson = {
				name: newName,
				number: newPhone,
				id: persons.length + 1,
			};

			personService.create(newPerson).then(createdHandler);
		}
	};

	const handleNewNameChange = (event) => {
		const nameValue = event.target.value;
		setNewName(nameValue);
	};

	const handleFilterChangeValue = (event) => setFilterValue(event.target.value);

	const handleNewNumberChange = (event) => setNewPhone(event.target.value);

	const handleDeletePerson = (person) => {
		const isConfirmed = window.confirm(`Delete ${person.name}?`);
		const deleteId = person.id;

		if (isConfirmed) {
			personService.deletePerson(deleteId).then(() => {
				setPersons(persons.filter((person) => person.id != deleteId));
			});
			setNotification(`Deleted person ${person.name}`);
			setTimeout(() => setNotification(null), 3000);
		}
	};
	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={notification} isError={isError} />
			<Filter value={filterValue} onChange={handleFilterChangeValue} />
			<h3>Add a new</h3>
			<PersonForm
				nameValue={newName}
				numberValue={newPhone}
				onChangeName={handleNewNameChange}
				onChangeNumber={handleNewNumberChange}
				onSubmit={handleAddPerson}
			/>
			<h3>Numbers</h3>
			<Persons onDeleteFn={handleDeletePerson} persons={personsToShow} />
		</div>
	);
};

export default App;
