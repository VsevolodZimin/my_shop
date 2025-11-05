const FIELD_INVALID = 'field-invalid'
const FIELD_VALID = 'field-valid'

const form = document.querySelector(".form");

const fName = document.getElementById("fName");
const fLastName = document.getElementById("fLastN");
const fEmail = document.getElementById("fEmail");
const fAddress = document.getElementById("fAddress");
const fPassword = document.getElementById("fPassword");
const fPhone = document.getElementById("fPhone");

const lettersOnly = /^[a-zA-Z]+$/;
const numbersOnly = /^[0-9]+$/;
const hasLetters = /[a-zA-Z]/;
const hasNumbers = /[0-9]/;
const isEmail = /[a-zA-Z0-9_]+@[a-zA-Z0-9]+\..+/;

form.addEventListener('submit', (event) => {
	resetFields(fName, fLastName, fEmail, fAddress, fPassword, fPhone);
	form.classList.add('was-validated');
	const fields = [fName, fLastName, fEmail, fAddress, fPassword, fPhone];
	const invalidFields = validate(fName, fLastName, fEmail, fAddress, fPassword, fPhone);
	const validFields = fields.filter(field => !invalidFields.includes(field));
	console.log('valid fields: ', validFields);
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


// Exercise 6
const validate = () => {

	const invalidFields = [];
	
	resetFields(fName, fLastName, fEmail, fAddress, fPassword, fPhone);
	// Get the error elements
	const errorName = document.getElementById("errorName");
	const errorEmail = document.getElementById("errorEmail");  
	const errorAddress = document.getElementById("errorAddress");  
	const errorLastN = document.getElementById("errorLastN");  
	const errorPassword = document.getElementById("errorPassword");  
	const errorPhone = document.getElementById("errorPhone");  


	// Validate fields entered by the user: name, phone, password, and email
	checkMinimumInput(3, fName, fLastName, fEmail, fAddress, fPassword);
	checkMinimumInput(9, fPhone);
	checkPattern(lettersOnly, fName, fLastName);
	checkPattern(numbersOnly, fPhone);
	checkPattern(hasLetters, fPassword);
	checkPattern(hasNumbers, fPassword);
	checkPattern(isEmail, fEmail);

	function checkMinimumInput(min, ...fields){
		fields.forEach(field => {
			if(field.value.trim().length < min){
				if(!invalidFields.includes(field)){
					invalidFields.push(field);
				}		
			}
		})
	}

	function checkPattern(pattern, ...fields){
		fields.forEach(field => {
			if(!pattern.test(field.value)){
				if(!invalidFields.includes(field)){
					invalidFields.push(field);
				}
			}
		})
	}

	return invalidFields;
}

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

