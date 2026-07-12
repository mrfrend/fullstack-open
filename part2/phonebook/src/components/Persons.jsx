import { Person } from "./Person";

export const Persons = ({ persons, onDeleteFn }) => (
	<>
		{persons.map((person) => (
			<Person
				onDelete={() => onDeleteFn(person)}
				key={person.id}
				person={person}
			/>
		))}
	</>
);
