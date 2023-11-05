const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const embed = new EmbedBuilder()
.setTitle("명령어 목록")
.setColor(0x00d8ff)
.setDescription("명령어 목록입니다.")
.addFields(
  { name: "/계좌개설", value: "이 명령어는 아직 계좌(통장)을 개설하지 않은 회원이 계좌를 만들때 사용하는 명령어 입니다. 한 번만 사용이 가능합니다.", inline: false },
  { name: "/이체", value: "이 명령어는 내 계좌 잔액을 다른 일반 유저에게 보내는 기능입니다.", inline: false },
  { name: "/통장", value: "이 명령어는 자신의 계좌정보를 확인할 수 있는 명령어 입니다. 잔액, 계좌 생성일, ID등을 확인할 수 있습니다.", inline: false },
)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("명령어")
    .setDescription("은행봇 명령어를 확인해 보세요."),
  async execute(interaction) {
    await interaction.reply({ ephemeral: true,  embeds: [embed] })
  },
};