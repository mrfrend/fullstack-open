import { useState } from "react";
import Country from "./Country";

const CountryListPoint = ({ country }) => {
	const [opened, setOpened] = useState(false);
	const handleClick = () => setOpened(!opened);

	if (opened) {
		return (
			<>
				<Country country={country} />
				<button onClick={handleClick}>close</button>
			</>
		);
	}
	return (
		<li>
			{country.name.common} <button onClick={handleClick}>show</button>
		</li>
	);
};

const CountryList = ({ countries }) => {
	console.log("inside CountryList", countries);
	return (
		<ul>
			{countries.map((country) => (
				<CountryListPoint key={country.name.common} country={country} />
			))}
		</ul>
	);
};

export default CountryList;
