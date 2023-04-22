import Discord, {Client, GatewayIntentBits} from "discord.js";
import * as fs from "fs";
import MemberJoinService from "./events/MemberJoinService";
import MemberQuitService from "./events/MemberQuitService";
import EmbedSender from "./commands/EmbedSender";
import DynamicVoiceChannelManager from "./events/DynamicVoiceChannelManager";

const Token: { token: string } = JSON.parse(fs.readFileSync('token.json', {
    encoding: 'utf8'
}));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const dynamicVoiceChannelManager = new DynamicVoiceChannelManager();

//Events
const welcomeService = new MemberJoinService();
const quitService = new MemberQuitService();

//Commands
const embedSenderCommand = new EmbedSender(client);

client.on('ready', async () => {
    client.user?.setPresence({
        activities: [{name: `:D`, type: Discord.ActivityType.Listening}],
        status: 'dnd'
    });
    console.log("Bot 啟動完成");
});

client.on('guildMemberAdd', (member) => {
    welcomeService.sendWelcomeMessage(member, member.guild);
    welcomeService.sendMemberCountMessage(member.guild);
});

client.on('guildMemberRemove', (member) => {
    quitService.sendQuitMessage(member, member.guild);
    quitService.sendMemberCountMessage(member.guild);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    dynamicVoiceChannelManager.handleDyanmicVoiceChannel(oldState, newState);
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        switch (interaction.commandName) {
            case "embed":
                await embedSenderCommand.openEmbedSenderModal(interaction);
                break;
            default:
                break;
        }
        return;
    }

    if (interaction.isModalSubmit()) {
        switch (interaction.customId) {
            case "embedSender":
                await embedSenderCommand.handleMessageSending(interaction);
                break;
            default:
                break;
        }
        return;
    }
});

client.on('error', (error) => {
    console.log(error)
});
process.on('unhandledRejection', (rejection) => {
    console.log(rejection)
});
process.on('uncaughtException', (exception) => {
    console.log(exception)
});

client.login(Token.token);
