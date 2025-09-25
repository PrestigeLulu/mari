import { EmbedBuilder } from "discord.js";
import { VideoMetadataResult } from "yt-search";

export const getColorEmbed = () => new EmbedBuilder().setColor("#cf85ff");

export const getDefaultEmbed = () =>
  getColorEmbed()
    .setTitle("🎤 같이 노래할사람!")
    .setDescription(
      "여기다가 원하는 곡의 제목을 적어줘!" +
        "\n스킵을 하고싶다면 이 명령어를 적어줘 `!s`"
    )
    .setImage("attachment://mari.jpg");

export const getFailEmbed = () =>
  getColorEmbed()
    .setTitle("Sorry! I can't find the song TwT")
    .setDescription("Can you try again?")
    .setImage("attachment://sadmari.jpg");

export const getMusicEmbed = (
  title: string,
  url: string,
  thumbnail: string,
  timestamp: string,
  author: string
) =>
  getColorEmbed()
    .setTitle(`🎤 노래 부르는중`)
    .setDescription(`**앙기모찌 **\n[${title}](${url})`)
    .setThumbnail(thumbnail)
    .setFields([
      { name: "시간", value: timestamp, inline: true },
      { name: "채널", value: author, inline: true },
    ]);
