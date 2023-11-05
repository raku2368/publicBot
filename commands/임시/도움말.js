const { EmbedBuilder, SelectMenuBuilder, SlashCommandBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("도움말")
    .setDescription("은행과 관련된 도움말을 확인해 보세요."),
  async execute(interaction) {
    const row = new ActionRowBuilder()
    .addComponents(
        new SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("도움말을 선택하세요.")
        .addOptions([
         {
            label: "계좌 개설 방법",
            description: "계좌 개설 방법을 알아보세요.",
            value: "select1",
            emoji: { name: '💰' },
          },
          {
            label: "ATM(입금/출금) 방법",
            description: "입금과 출금을 하는 방법을 알아보세요.",
            value: "select2",
            emoji: { name: '🏧' },
          },
          {
            label: "이체 방법",
            description: "내 돈을 다른사람에게 이체하는 방법을 알아보세요.",
            value: "select3",
            emoji: { name: '📲' },
          },
          {
            label: "계정/계좌 관련",
            description: "로블록스, 디스코드 계정과 관련된것을 알아보세요.",
            value: "select4",
            emoji: { name: '🔒' },
          },
          {
            label: "기타 질문",
            description: "자주 찾는 질문입니다.",
            value: "select5",
            emoji: { name: '❓' },
          },
        ])
    );

    await interaction.reply({ content: "TEST", components: [row] });

    const filter = (interaction) => {
      return interaction.customId === "select";
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "select") {
        const selectedValue = interaction.values[0];
        if (selectedValue === "select1") {
          const embed1 = new EmbedBuilder()
              .setTitle("계좌 개설 방법")
              .setColor(0x00d8ff)
              .setDescription("KB국민은행 - 도움말")
              .addFields(
                { name: "📘계좌는 뭔가요?", value: "계좌는 통장과 같은 뜻입니다.", inline: false },
               
              )
              .setTimestamp(new Date());

          interaction.channel.send({ ephemeral: true, embeds: [embed1] });
          interaction.deferUpdate();
        } else if (selectedValue === "select2") {
          const embed1 = new EmbedBuilder()
              .setTitle("ATM(입금/출금) 방법")
              .setColor(0x00d8ff)
              .setDescription("KB국민은행 - 도움말")
              .addFields(
                { name: "📘계좌는 뭔가요?", value: "계좌는 통장과 같은 뜻입니다.", inline: false },

              )
              .setTimestamp(new Date());

          interaction.channel.send({ ephemeral: true, embeds: [embed1] });
          interaction.deferUpdate();
        } else if (selectedValue === "select3") {
          const embed1 = new EmbedBuilder()
              .setTitle("이체 방법")
              .setColor(0x00d8ff)
              .setDescription("KB국민은행 - 도움말")
              .addFields(
                { name: "📘계좌는 뭔가요?", value: "계좌는 통장과 같은 뜻입니다.", inline: false },

              )
              .setTimestamp(new Date());

          interaction.channel.send({ ephemeral: true, embeds: [embed1] });
          interaction.deferUpdate();
        } else if (selectedValue === "select4") {
          const embed1 = new EmbedBuilder()
              .setTitle("계정/계좌 관련")
              .setColor(0x00d8ff)
              .setDescription("계정 관련 도움말 입니다. 여기서 계정은 로블록스, 디스코드 계정을 말합니다.")
              .addFields(
                { name: "계정이 변경된 경우", value: "서버관리팀의 변경확인문서가 있다면 변경이 가능합니다.", inline: false },
                { name: "계정이 해킹당하거나 분실된 경우", value: "계정 해킹/분실로 인한 피해는 은행측에서 책임을 지지 않으며 서버관리팀의 변경확인문서가 있다면 계좌 잔액 복구가 가능할 수 있습니다.", inline: false },
                { name: "서버 또는 은행으로부터 밴을 당한 경우", value: "밴을 당하면 은행은 해당 회원을 탈퇴로 처리합니다.", inline: false },
                { name: "계좌가 비활성화된 경우", value: "서대문은행 이용약관 제14조1항에 의해 비활성화된 것입니다. 이에 대한 자세한 내용은 문의하기를 통해 확인해 주세요.", inline: false },
                { name: "오류가 있는 경우", value: "문의하기를 통해 신고해 주세요 서대문은행 이용약관 제**조에 따라 처리합니다.", inline: false },
              )
              .setTimestamp(new Date());

          interaction.channel.send({ ephemeral: true, embeds: [embed1] });
          interaction.deferUpdate();
        } else if (selectedValue === "select5") {
          const embed1 = new EmbedBuilder()
              .setTitle("기타 질문")
              .setColor(0x00d8ff)
              .setDescription("KB국민은행 - 도움말")
              .addFields(
                { name: "📘계좌는 뭔가요?", value: "계좌는 통장과 같은 뜻입니다.", inline: false },
                { name: "💰이자는 없나요?", value: "네 없습니다.", inline: false },
                { name: "🪙은행은 뭐하는 곳인가요?", value: "은행에 돈을 맡기면 그 돈을 은행이 보관해서 디스코드에서 유저끼리 거래가 가능하도록 만듭니다.", inline: false },
                { name: "💵돈은 어떻게 인출(출금)하나요?", value: "인게임 로블록스 맵에 있는 ATM기를 이용해서 인출 할 수 있습니다.", inline: false },
                { name: "👨‍💼직원 채용 계획은 없나요?", value: "네 직원 채용 계획은 지금도 앞으로도 계속 없을 예정입니다.", inline: false },
                { name: "📄서비스이용약관은 어디에 있나요?", value: "⚠️약관링크⚠️", inline: false },
              )
              .setTimestamp(new Date());

          interaction.channel.send({ ephemeral: true, embeds: [embed1] });
          interaction.deferUpdate();

        } else {
          interaction.reply({
            content: selectedValue + " 기능이 구현되지 않았어!",
            ephemeral: true,
          });
        }
      }
    });
  },
};