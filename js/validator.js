const lettersOnly = /^[a-zA-Z]+$/;
const numbersOnly = /^[0-9]+$/;
const hasLetters = /[a-zA-Z]/;
const hasNumbers = /[0-9]/;
const isEmail = /[a-zA-Z0-9_]+@[a-zA-Z0-9]+\..+/;
const minThreeSimbols = /^.{3,}$/;
const minNineSimbols = /^.{9,}$/;

export function validate(fName, fLastName, fEmail, fAddress, fPassword, fPhone) {

	const invalidFields = [];
	// Validate fields entered by the user: name, phone, password, and email
	checkPattern(minThreeSimbols, fName, fLastName, fEmail, fAddress, fPassword);
	checkPattern(minNineSimbols, fPhone);
	checkPattern(lettersOnly, fName, fLastName);
	checkPattern(numbersOnly, fPhone);
	checkPattern(hasLetters, fPassword);
	checkPattern(hasNumbers, fPassword);
	checkPattern(isEmail, fEmail);

	function checkPattern(pattern, ...fields){
		fields.forEach(field => {
			if(!pattern.test(field.value)){
                invalidateField(field)
			}
		})
	}

    function invalidateField(field){
        if(!invalidFields.includes(field)){
			invalidFields.push(field);
        }	
    }

	return invalidFields;
}