export const Person = ({ person, onDelete }) => (
	<p>
		{person.name} {person.number} <button onClick={onDelete}>delete</button>
	</p>
);
