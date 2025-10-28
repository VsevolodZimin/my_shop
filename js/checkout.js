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
const isEmail = /[a-zA-Z0-9-_]+@[a-zA-Z0-9]+\..+/;

form.addEventListener('submit', (event) => {
	resetFields(fName, fLastName, fEmail, fAddress, fPassword, fPhone);
	form.classList.add('was-validated');
	const invalidFields = validate(fName, fLastName, fEmail, fAddress, fPassword, fPhone);
	if(invalidFields.length > 0) {
		event.preventDefault();
		invalidFields.forEach(field => field.classList.add('is-invalid'));
		alert("Please check the fields and try again");
	}
	else{
		resetFields(fName, fLastName, fEmail, fAddress, fPassword, fPhone);
		alert("Form submitted successfully");
	}
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
	checkMinimumInput(fName, fLastName, fEmail, fAddress, fPassword, fPhone);
	checkPattern(lettersOnly, fName, fLastName);
	checkPattern(numbersOnly, fPhone);
	checkPattern(hasLetters, fPassword);
	checkPattern(hasNumbers, fPassword);
	checkPattern(isEmail, fEmail);

	function checkMinimumInput(...fields){
		fields.forEach(field => {
			if(field.value.trim().length < 3){
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
		if(f.classList.contains('is-invalid')) {
			f.classList.remove('is-invalid');
		}
	})
}

