import { prisma } from "./Prisma";
import { getMainMessage } from "./Util";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  VoiceConnectionConnectingState,
} from "@discordjs/voice";
import { getDefaultEmbed, getMusicEmbed } from "./EmbedUtil";
import ytdl from "@distube/ytdl-core";
import ytSearch from "yt-search";

export async function getMusics(guildId: string) {
  return prisma.music.findMany({
    where: {
      guildId: guildId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function addMusic(guildId: string, url: string) {
  try {
    const guild = await prisma.guild.update({
      where: {
        id: guildId,
      },
      data: {
        musics: {
          create: {
            url: url,
          },
        },
      },
      select: {
        musics: true,
      },
    });
    if (!guild) {
      console.log("Guild not found");
      return;
    }
    if (guild.musics.length === 1) {
      await playMusic(guildId);
      console.log("Playing music");
    }
  } catch (e: any) {
    console.log(e.message);
  }
}

export async function removeMusic(
  guildId: string,
  id: string,
  noPlay: boolean = false
) {
  try {
    await prisma.music.delete({
      where: {
        id: id,
      },
    });
    if (noPlay) return;
    if ((await getMusics(guildId)).length > 0) {
      await playMusic(guildId);
    } else {
      const message = await getMainMessage(guildId);
      if (message) {
        await message.edit({
          embeds: [getDefaultEmbed()],
          files: [`${__dirname}/../Image/mari.jpg`],
        });
      }
    }
  } catch (error) {
    console.error("removeMusic 처리 중 오류 발생:", error);
  }
}

export async function skipMusic(guildId: string, id: number = 1) {
  const musics = await getMusics(guildId);
  if (musics.length === 0) return;
  if (id === 1) {
    await stopMusic(guildId);
    return;
  }
  if (id < 1 || id > musics.length) return;
  await removeMusic(guildId, musics[id - 1].id, true);
}

export async function stopMusic(guildId: string) {
  const connection = getVoiceConnection(guildId);
  if (!connection) return;
  const state = connection.state as VoiceConnectionConnectingState;
  if (!state.subscription) return;
  state.subscription.player.stop();
}

export async function playMusic(guildId: string) {
  try {
    const musics = (await getMusics(guildId))[0];
    if (!musics) {
      console.log("No music found");
      return;
    }
    const player = createAudioPlayer();
    const connection = getVoiceConnection(guildId);
    if (!connection) {
      console.log("No connection found");
      return;
    }
    // musics.url ?v= 다음부터
    const id = musics.url.split("?v=")[1];
    const video = await ytSearch({ videoId: id });
    const stream = ytdl(musics.url, {
      filter: "audioonly",
      highWaterMark: 1 << 30,
      liveBuffer: 1 << 30,
    });
    let resource = createAudioResource(stream);

    connection.subscribe(player);
    player.play(resource);
    player.on(AudioPlayerStatus.Idle, async () => {
      try {
        await removeMusic(guildId, musics.id);
      } catch (e) {
        console.error("AudioPlayer Idle 상태 처리 중 오류:", e);
      }
    });
    player.on("error", async (error: any) => {
      console.error("AudioPlayer 에러 발생:", error);
    });
    const message = await getMainMessage(guildId);
    if (message) {
      await message.edit({
        embeds: [getMusicEmbed(video)],
        files: [],
      });
    }
  } catch (error) {
    console.error("playMusic 처리 중 오류 발생:", error);
  }
}
