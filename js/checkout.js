import { validate } from "./validator.js";

const FIELD_INVALID = 'field-invalid'
const FIELD_VALID = 'field-valid'
const form = document.querySelector(".form");

const fName = document.getElementById("fName");
const fLastName = document.getElementById("fLastN");
const fEmail = document.getElementById("fEmail");
const fAddress = document.getElementById("fAddress");
const fPassword = document.getElementById("fPassword");
const fPhone = document.getElementById("fPhone");

form.addEventListener('submit', (event) => {
	resetFields(fName, fLastName, fEmail, fAddress, fPassword, fPhone);
	const fields = [fName, fLastName, fEmail, fAddress, fPassword, fPhone];
	const invalidFields = validate(fName, fLastName, fEmail, fAddress, fPassword, fPhone);
	const validFields = fields.filter(field => !invalidFields.includes(field));
	if(invalidFields.length > 0) {
		event.preventDefault();
		invalidFields.forEach(field => field.classList.add(FIELD_INVALID));
		alert("Please check the fields and try again");
	}
	else{
		alert("Form submitted successfully");
	}

	validFields.forEach(filed => {
		if(!filed.classList.contains(FIELD_VALID)){ 
			filed.classList.add(FIELD_VALID) 
		}
	})
})

function resetFields(...fields) {
	fields.forEach(f => {
		if(f.classList.contains(FIELD_INVALID)) {
			f.classList.remove(FIELD_INVALID);
		}
		if(f.classList.contains(FIELD_VALID)) {
			f.classList.remove(FIELD_VALID);
		}
	})
}

