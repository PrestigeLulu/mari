import Bot from '../../Bot/Bot';
import Event from '../../Structures/Event';

function onCall(bot: Bot): void {
	console.log(`Logged in ${bot.user?.tag}`);
}

const Ready = new Event('ready', onCall);

export default Ready;