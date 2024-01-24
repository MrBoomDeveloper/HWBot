export function parseCommand(text: string, prefix: string | string[]) {
	const args = text.split(" ");
	let selectedPrefix: string;

	if(Array.isArray(prefix)) {
		for(const aPrefix of prefix) {
			if(args[0].startsWith(aPrefix)) {
				selectedPrefix = aPrefix;
				break;
			}
		}
	} else {
		selectedPrefix = prefix;
	}

	if(selectedPrefix == null) {
		return null;
	}

	if(!args[0].startsWith(selectedPrefix)) {
		return null;
	}

	args[0] = args[0].substring(selectedPrefix.length);
	return args;
}