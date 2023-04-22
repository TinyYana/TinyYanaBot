import Discord, { EmbedBuilder, Guild, GuildMember } from "discord.js";
import * as fs from "fs";
import { BotConfig } from "../interfaces/BotConfig";

const config: BotConfig = JSON.parse(fs.readFileSync('config.json', {
    encoding: 'utf8'
}));

export default class MemberJoinService {
    async sendWelcomeMessage(member: GuildMember, guild: Guild) {
        const embed = new EmbedBuilder();
        const welcomeChannel = await guild.channels.fetch(config.welcome.channelId);
        if (!welcomeChannel?.isTextBased()) return;
        embed
            .setTitle(config.welcome.title)
            .setDescription(config.welcome.description)
            .setColor(Discord.Colors.LuminousVividPink)
            .setThumbnail(member.user.avatarURL());
        welcomeChannel.send({
            content: `<@${member.id}>`,
            embeds: [embed]
        });
        await member.roles.add('859107233702215690');
        await member.roles.add('872787716549529633');
    }

    async sendMemberCountMessage(guild: Guild) {
        const embed = new EmbedBuilder();
        const memberCountChannel = await guild.channels.fetch(config.memberCount.memberCountChannelId);
        if (!memberCountChannel?.isTextBased()) return;
        embed
            .setTitle("人數增加")
            .setDescription(guild.memberCount.toString())
            .setColor(Discord.Colors.Green);
        memberCountChannel.send({
            embeds: [embed]
        });
    }
}