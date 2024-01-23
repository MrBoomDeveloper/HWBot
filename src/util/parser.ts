export function parseCommand(text: string, prefix: string | string[]) {
	const args = text.split(" ");
	const username = `@${process.env.TELEGRAM_BOT_USERNAME}`;
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

	if(selectedPrefix == null || !args[0].startsWith(selectedPrefix)) {
		return null;
	}

	args[0] = args[0].substring(selectedPrefix.length);

	if(args[0].endsWith(username)) {
		args[0] = args[0].substring(0, args[0].length - username.length);
	}

	return args;
}