import Part from "./Part";
const Content = ({parts}) => (
	<div>
		{parts.map(part => <Part key={part.name} part={part}/>)}
	</div>
);

export default Content;
