const PersonForm = ({
	nameValue,
	numberValue,
	onChangeName,
	onChangeNumber,
	onSubmit
}) => {
	return (
		<form>
			<div>
				name: <input value={nameValue} onChange={onChangeName} />
			</div>
			<div>
				number: <input value={numberValue} onChange={onChangeNumber} />
			</div>
			<div>
				<button onClick={onSubmit} type="submit">
					add
				</button>
			</div>
		</form>
	);
};

export default PersonForm;
