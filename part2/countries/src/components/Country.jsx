const Country = ({ country }) => {
	console.log("inside country", country);
	return (
		<div>
			<h1>{country.name.official}</h1>
			<p>{country.capital[0]}</p>
			<p>Area {country.area}</p>
			<h2>Languages</h2>
			<ul>
				{Object.values(country.languages).map((language) => (
					<li key={language}>{language}</li>
				))}
			</ul>
			<img src={country.flags.png} />
		</div>
	);
};

export default Country;
