import { EmbedBuilder } from "discord.js";
import { VideoMetadataResult } from "yt-search";

export const getColorEmbed = () => new EmbedBuilder().setColor("#cf85ff");

export const getDefaultEmbed = () =>
  getColorEmbed()
    .setTitle("🎤 Let's sing together!")
    .setDescription(
      "Type song name that you wanna hear in this channel!" +
        "\nAnd you can skip if type `!s`"
    )
    .setImage("attachment://mari.jpg");

export const getFailEmbed = () =>
  getColorEmbed()
    .setTitle("Sorry! I can't find the song TwT")
    .setDescription("Can you try again?")
    .setImage("attachment://sadmari.jpg");

export const getMusicEmbed = (info: VideoMetadataResult) =>
  getColorEmbed()
    .setTitle(`🎤 Now singing`)
    .setDescription(`**Playing **\n[${info.title}](${info.url})`)
    .setThumbnail(info.thumbnail)
    .setFields([
      { name: "timestamp", value: info.timestamp, inline: true },
      { name: "channel", value: info.author.name || "", inline: true },
    ]);
