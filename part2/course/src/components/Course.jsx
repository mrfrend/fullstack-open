import Header from "./Header";
import Content from "./Content";
import Total from "./Total";
const Course = ({ course }) => {
	const totalExercises = course.parts.reduce(
		(acc, part) => acc + part.exercises,
		0,
	);
	return (
		<div>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total total={totalExercises} />
		</div>
	);
};

export default Course;
