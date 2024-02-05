import Event from '../../Structures/Event';
import {Message} from 'discord.js';
import {prisma} from '../../Util/Prisma';

const Ready = new Event('messageCreate', async function (bot, message: Message) {
	// 채널 확인
	if (!message.guildId) return;
	if (message.author.bot) return;
	const guildData = await prisma.guild.findUnique({
		where: {
			id: message.guildId
		}
	});
	if(!guildData) return;
	if(message.channelId !== guildData.channelId) return;
	//

});

export default Ready;