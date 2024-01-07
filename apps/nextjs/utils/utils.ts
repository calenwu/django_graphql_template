export function errorDictToString(key: string, errorDict: any) {
	errorDict = JSON.parse(JSON.parse(errorDict.message));
	let errors = '';
	if (key in errorDict) {
		errorDict[key].forEach((error: any) => {
			errors += error.message + '\n';
		});
		errors.substring(0, errors.length - 2);
	}
	return errors;
}
