import { useState, useEffect } from "react";
import countriesService from "./services/countries";
import CountryForm from "./components/CountryForm";
import CountryView from "./components/CountryView";
const App = () => {
	const [countryValue, setCountryValue] = useState(null);
	const [countries, setCountries] = useState(null);

	useEffect(() => {
		console.log("effect");
		const promiseHandler = (countries) => {
			setCountries(countries);
			console.log("got countries");
			console.log(countries.slice(0, 2))
		};
		countriesService.getAll().then(promiseHandler);
	}, []);

	const countriesToShow =
		countries && countryValue
			? countries.filter((country) =>
					country.name.common.toLowerCase().includes(countryValue.toLowerCase()),
				)
			: countries;

	const handleCountryChange = (event) => {
		setCountryValue(event.target.value);
	};
	return (
		<div>
			<CountryForm value={countryValue ?? ""} onChange={handleCountryChange} />
			{countryValue && <CountryView countries={countriesToShow} />}
		</div>
	);
};

export default App;
