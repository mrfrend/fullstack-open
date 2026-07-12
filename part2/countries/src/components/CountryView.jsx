import Country from "./Country";
import CountryList from "./CountryList";
const CountryView = ({ countries }) => {
	if (!countries) {
		return <p>None countries are found</p>;
	}

	if (countries.length > 10) {
		return <p>Too many matches, specify another filter</p>;
	} else if (countries.length <= 10 && countries.length > 1) {
		return <CountryList countries={countries} />;
	} else if (countries.length == 1) {
		return <Country country={countries[0]} />;
	}
};

export default CountryView;
