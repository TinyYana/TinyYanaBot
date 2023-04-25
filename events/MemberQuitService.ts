import Discord, {Guild, GuildMember, PartialGuildMember} from "discord.js";
import {BotConfig} from "../interfaces/BotConfig";
import * as fs from "fs";

const config: BotConfig = JSON.parse(fs.readFileSync('config.json', {
    encoding: 'utf8'
}));

export default class MemberQuitService {
    async sendQuitMessage(member: GuildMember | PartialGuildMember, guild: Guild): Promise<void> {
        const quitMessage = `:wave: ${member.user.tag} 離開了彼岸花社群`;
        const quitMessageChannel = await guild.channels.fetch('859089963181670410');
        if (!quitMessageChannel?.isTextBased()) return;
        quitMessageChannel.send({
            content: quitMessage
        });
    }

    async sendMemberCountMessage(guild: Guild) {
        const embed = new Discord.EmbedBuilder();
        const memberCountChannel = await guild.channels.fetch(config.memberCount.memberCountChannelId);
        if (!memberCountChannel?.isTextBased()) return;
        embed
            .setTitle("人數減少")
            .setDescription(guild.memberCount.toString())
            .setColor(Discord.Colors.Red);
        memberCountChannel.send({
            embeds: [embed]
        });
    }
}