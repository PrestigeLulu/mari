import { prisma } from "./Prisma";
import { getMainMessage } from "./Util";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  VoiceConnectionConnectingState,
  NoSubscriberBehavior,
  StreamType,
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
  let player;
  let connection;

  try {
    const musics = (await getMusics(guildId))[0];
    if (!musics) {
      console.log("No music found");
      return;
    }

    player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Stop,
      },
    });

    connection = getVoiceConnection(guildId);
    if (!connection) {
      console.log("No connection found");
      return;
    }

    // musics.url ?v= 다음부터
    const id = musics.url.split("?v=")[1];
    const video = await ytSearch({ videoId: id });

    const stream = ytdl(musics.url, {
      filter: "audioonly",
      highWaterMark: 1 << 25, // 32MB로 조정
      liveBuffer: 1 << 25,
      quality: "highestaudio",
    });

    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
    });

    connection.subscribe(player);
    player.play(resource);

    // 에러 처리 개선
    stream.on("error", async (error) => {
      console.error("Stream error:", error);
      await handlePlaybackError(guildId, musics.id);
    });

    player.on(AudioPlayerStatus.Idle, async () => {
      try {
        await removeMusic(guildId, musics.id);
      } catch (e) {
        console.error("AudioPlayer Idle 상태 처리 중 오류:", e);
        await handlePlaybackError(guildId, musics.id);
      }
    });

    player.on("error", async (error) => {
      console.error("AudioPlayer 에러 발생:", error);
      await handlePlaybackError(guildId, musics.id);
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
    if (player) player.stop();
    if (connection) connection.destroy();
  }
}

async function handlePlaybackError(guildId: string, musicId: string) {
  try {
    await removeMusic(guildId, musicId, true);
    const connection = getVoiceConnection(guildId);
    if (connection) {
      connection.destroy();
    }
    await playMusic(guildId); // 다음 곡 재생 시도
  } catch (error) {
    console.error("Error handling playback error:", error);
  }
}
