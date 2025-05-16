import Event from "../../Structures/Event";
import { VoiceState } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { stopMusic } from "../../Util/Queue";
import { prisma } from "../../Util/Prisma";
import { getMainMessage } from "../../Util/Util";
import { getDefaultEmbed } from "../../Util/EmbedUtil";

const VoiceStateUpdate = new Event("voiceStateUpdate", async function (
  bot,
  oldState: VoiceState,
  newState: VoiceState
) {
  // 서버가 아니면 무시
  if (!oldState.guild) return;

  // 봇이 나간 경우는 무시
  if (oldState.member?.user.bot) return;

  // 음성 채널에서 나간 경우
  if (oldState.channelId && !newState.channelId) {
    const voiceChannel = oldState.channel;
    if (!voiceChannel) return;

    // 채널에 남은 멤버 확인
    const members = voiceChannel.members;
    const humanMembers = members.filter((member) => !member.user.bot);

    // 사람이 없고 봇만 있는 경우
    if (humanMembers.size === 0) {
      try {
        const message = await getMainMessage(oldState.guild.id);
        const connection = getVoiceConnection(oldState.guild.id);

        // 음악 중지
        await stopMusic(oldState.guild.id);

        // 큐 초기화
        await prisma.music.deleteMany({
          where: {
            guildId: oldState.guild.id,
          },
        });

        // 메시지가 존재하는 경우에만 메시지 업데이트
        if (message) {
          await message.edit({
            embeds: [getDefaultEmbed()],
            files: [`${__dirname}/../../Image/mari.jpg`],
          });
        }

        // 봇 연결 해제
        connection?.destroy();
      } catch (error) {
        console.error("VoiceStateUpdate 처리 중 오류 발생:", error);
      }
    }
  }
});

export default VoiceStateUpdate;
