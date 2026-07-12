const CountryForm = ({ value, onChange }) => {
	return (
		<form>
			<label htmlFor="country-input">find countries </label>
			<input value={value} onChange={onChange} id="country-input" />
		</form>
	);
};

export default CountryForm;
