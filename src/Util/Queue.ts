import { prisma } from "./Prisma";
import { getMainMessage } from "./Util";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  demuxProbe,
  getVoiceConnection,
  StreamType,
  VoiceConnectionConnectingState,
} from "@discordjs/voice";
import { getDefaultEmbed, getMusicEmbed } from "./EmbedUtil";
import ytdl from "@distube/ytdl-core";
import ytSearch from "yt-search";
import { getOrCreatePlayer } from "./playerRegistry";

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

export async function getFirstMusics(guildId: string) {
  return prisma.music.findFirst({
    where: {
      guildId: guildId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export function addMusic(guildId: string, url: string) {
  prisma.guild
    .update({
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
    })
    .then((guild) => {
      if (!guild) {
        console.log("Guild not found");
        return;
      }
      if (guild.musics.length === 1) {
        playMusic(guildId)
          .then(() => {
            console.log("Playing music");
          })
          .catch((e: any) => {
            console.log(e.message);
          });
      }
    })
    .catch((e: any) => {
      console.log(e.message);
    });
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
    const music = await getFirstMusics(guildId);
    if (!music) {
      console.log("No music found");
      return;
    }
    const player = getOrCreatePlayer(guildId);
    const connection = getVoiceConnection(guildId);
    if (!connection) {
      console.log("No connection found");
      return;
    }
    // musics.url ?v= 다음부터
    const id = music.url.split("?v=")[1];
    const video = await ytSearch({ videoId: id });
    const stream = ytdl(music.url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25, // 32MB 정도 (16~64MB 권장)
      liveBuffer: 0,
      dlChunkSize: 0,
    });
    const { stream: probed, type } = await demuxProbe(stream);
    const resource = createAudioResource(probed, {
      inputType: type ?? StreamType.Arbitrary,
    });

    player.play(resource);

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
