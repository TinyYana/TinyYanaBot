import Discord, {
    BaseInteraction,
    Client,
    EmbedBuilder,
    ModalSubmitInteraction,
    SlashCommandBuilder
} from "discord.js";
import EmbedSenderModal from "../modals/EmbedSenderModal";

export default class EmbedSender {
    constructor(client: Client) {
        client.once('ready', () => {
            const builder = new SlashCommandBuilder();
            builder
                .setName("embed")
                .setDescription("發送 Embed 訊息");
            client?.application?.commands.create(builder);
        });
    }

    async openEmbedSenderModal(interaction: BaseInteraction) {
        if (!interaction.isCommand()) return;
        const emberSenderModal = new EmbedSenderModal();
        const modal = await emberSenderModal.createModal();
        interaction.showModal(modal);
    }

    async handleMessageSending(interaction: ModalSubmitInteraction) {
        const title = interaction.fields.getTextInputValue('titleInput');
        const description = interaction.fields.getTextInputValue('descriptionInput');
        const imageUrl = interaction.fields.getTextInputValue('imageUrl');
        const channelToSend = interaction.fields.getTextInputValue('channelSend');
        const notify = interaction.fields.getTextInputValue('notify');

        if (!title || !description || !channelToSend) {
            await interaction.reply({
                content: "請填寫必要的資訊（標題、內文、目標頻道ID）",
                ephemeral: true,
            });
            return;
        }

        const channel = await interaction?.guild?.channels.fetch(channelToSend);

        if (!channel || !channel.isTextBased()) {
            await interaction.reply({
                content: "無效頻道ID",
                ephemeral: true
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(Discord.Colors.Purple);

        if (imageUrl) {
            embed.setImage(imageUrl);
        }

        if (this.convertToBoolean(notify)) {
            await channel.send({
                content: `${await interaction?.guild?.roles.fetch('964122410402054174')}`,
                embeds: [embed]
            });
        } else {
            await channel.send({embeds: [embed]});
        }

        await interaction.reply({
            content: "Embed 訊息已被發送"
        });
    }

    convertToBoolean(input: string): boolean {
        const truthy: string[] = ["true", "True", "1"];
        return truthy.includes(input);
    }
}