const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const comma = require("comma-number")
const Schema = require("../../models/계좌")
const dotenv = require("dotenv");
dotenv.config();

const embed1 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️이체 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`해당 계좌에 권한이 없습니다.`)//임베드 설명

const embed2 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️이체 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`받는분의 계좌가 없습니다.`)//임베드 설명

const embed3 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️입력 오류**") // 임베드 제목
.setColor("#F7F009") // 임베드 색깔
.setDescription(`금액이 양의 정수가 아닙니다.`)//임베드 설명

const embed4 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️이체 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`보내는분의 잔액이 부족합니다.`)//임베드 설명

const embed5 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️입력 오류**") // 임베드 제목
.setColor("#F7F009") // 임베드 색깔
.setDescription(`본인에게 이체할 수 없습니다.`)//임베드 설명

const embed6 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️이체 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`본인의 계좌가 비활성화 되었습니다.`)//임베드 설명

const embed7 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️이체 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`받는분의 계좌가 비활성화 되었습니다.`)//임베드 설명

module.exports = {
	data: new SlashCommandBuilder()
		.setName('법인에서법인으로이체')
		.setDescription('⚠️일반회원 사용 불가⚠️')
       .addStringOption((data) =>
        data
         .setName('보내는분법인명')
         .setDescription('보내는분의 법인명을 선택해 주세요.')
         .setRequired(true)
         .addChoices(
          { name: '서대문구청', value: 'corp1' },
          { name: 'DB손해보험', value: 'corp2' },
          { name: 'SBS', value: 'corp3' },
          { name: '서대문은행', value: 'corp4' },
          { name: '이세계아이돌카페', value: 'corp5' },
          { name: '카페쉬는곳', value: 'corp6' },
          { name: '서대문경찰서', value: 'corp7' },
          { name: '서대문소방서', value: 'corp8' },
          { name: '도로교통공단', value: 'corp9' },
        ))

        .addStringOption((data) =>
        data
         .setName('받는분법인명')
         .setDescription('받는분의 법인명을 선택해 주세요.')
         .setRequired(true)
         .addChoices(
          { name: '서대문구청', value: 'corp1' },
          { name: 'DB손해보험', value: 'corp2' },
          { name: 'SBS', value: 'corp3' },
          { name: '서대문은행', value: 'corp4' },
          { name: '이세계아이돌카페', value: 'corp5' },
          { name: '카페쉬는곳', value: 'corp6' },
          { name: '서대문경찰서', value: 'corp7' },
          { name: '서대문소방서', value: 'corp8' },
          { name: '도로교통공단', value: 'corp9' },
        ))

        .addIntegerOption((data) =>
        data
           .setName("금액")
           .setDescription("금액을 숫자로 입력해 주세요")
           .setRequired(true)),
           
	async execute(interaction) {
        const {client} = interaction
        const logs = await client.channels.cache.get(process.env.LogCh) //로그채널
        const Sublogs = await client.channels.cache.get(process.env.SubLogCh) //로그채널
        const user = interaction.user
        const corp = interaction.options.getString("보내는분법인명")
        const sendto = interaction.options.getString("받는분법인명")
        const betting = interaction.options.getInteger("금액")
        
        const findMe = await Schema.findOne({ Discord_ID: corp }) // 데이터베이스에서 userid 가 메세지를 보낸사람의 id인것을 검색
        const findSend = await Schema.findOne({ Discord_ID: sendto })// 위에랑 비슷함 ( 데이터베이스에서 멘션한 유저를 검색)

      //법인 권한 확인
      if (corp == "corp1") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550480642445422')) {
          Sublogs.send(`**법인에서법인이체 실패** <@${interaction.user.id}>님이 서대문구청 권한이 없어서 명령에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp2") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550491723796480')) {
          Sublogs.send(`**법인에서법인이체 실패** <@${interaction.user.id}>님이 DB손해보험 권한이 없어서 명령에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp3") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550494278123630')) {
          Sublogs.send(`**법인에서법인이체 실패** <@${interaction.user.id}>님이 SBS 권한이 없어서 명령에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp4") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550495674847243')) {
          Sublogs.send(`**법인에서법인이체 실패** <@${interaction.user.id}>님이 서대문은행 권한이 없어서 명령에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp5") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550497017020507')) {
          Sublogs.send(`**법인에서법인이체 실패** <@${interaction.user.id}>님이 이세계아이돌카페 권한이 없어서 명령에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp6") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550817537347634')) {
          Sublogs.send(`**법인에서법인이체 실패** <@${interaction.user.id}>님이 카페쉬는곳 권한이 없어서 명령에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp7") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068551495190065202')) {
          Sublogs.send(`**법인에서법인이체 실패** <@${interaction.user.id}>님이 서대문경찰서 권한이 없어서 명령에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp8") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068551452382986381')) {
          Sublogs.send(`**법인에서법인이체 실패** <@${interaction.user.id}>님이 서대문소방서 권한이 없어서 명령에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp9") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068551336427257917')) {
          Sublogs.send(`**법인에서법인이체 실패** <@${interaction.user.id}>님이 도로교통공단 권한이 없어서 명령에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      }

      //기타 조건 확인
      if (corp == sendto) {
        Sublogs.send(`**이체 실패** <@${interaction.user.id}>님이 받는분에 본인을 입력해서 명령에 실패했습니다.`)
        return interaction.reply({ ephemeral: true, embeds: [embed5]})}
      if (!findMe) {
        Sublogs.send(`**이체 실패** <@${interaction.user.id}>님이 보내는분 계좌가 없어서 실패했습니다.`)
        return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      if (!findSend) {
        Sublogs.send(`**이체 실패** <@${interaction.user.id}>님이 받는분 계좌가 없어서 명령에 실패했습니다.`)
        return interaction.reply({ ephemeral: true, embeds: [embed2]})}
      if (betting <= 0) {
        Sublogs.send(`**이체 실패** <@${interaction.user.id}>님이 올바르지 않은 숫자를 입력해서 명령에 실패했습니다.`)
        return interaction.reply({ ephemeral: true, embeds: [embed3]})}
      const money1 = parseInt(findMe.money)
      const money2 = parseInt(findSend.money)
      if (money1 < betting) {
        Sublogs.send(`**이체 실패** <@${interaction.user.id}>님이 가진돈보다 많이 입력해서 명령에 실패했습니다.`)
        return interaction.reply({ ephemeral: true, embeds: [embed4]})}
      if (!findMe.account == 0) {
        Sublogs.send(`**이체 실패** <@${interaction.user.id}>님이 보내는분 계좌가 정지되어 있어서 명령에 실패했습니다.`)
        return interaction.reply({ ephemeral: true, embeds: [embed6]})}
      if (!findSend.account == 0) {
        Sublogs.send(`**이체 실패** <@${interaction.user.id}>님이 받는분 계좌가 정지되어 있어서 명령에 실패했습니다.`)
        return interaction.reply({ ephemeral: true, embeds: [embed7]})}

      await Schema.findOneAndUpdate({ Discord_ID: sendto }, { // 데이터베이스를 검색하고 업데이트
          money: money2 + betting,
       })        
       await Schema.findOneAndUpdate({ Discord_ID: corp }, { 
           money: money1 - betting,
       })

        let i
        if (corp == "corp1") i = "서대문구청" 
        else if (corp == "corp2") i = "DB손해보험"
        else if (corp == "corp3") i = "SBS"
        else if (corp == "corp4") i = "서대문은행"
        else if (corp == "corp5") i = "이세계아이돌카페"
        else if (corp == "corp6") i = "카페쉬는곳"
        else if (corp == "corp7") i = "서대문경찰서"
        else if (corp == "corp8") i = "서대문소방서"
        else if (corp == "corp9") i = "도로교통공단"

        let k
        if (sendto == "corp1") k = "서대문구청" 
        else if (sendto == "corp2") k = "DB손해보험"
        else if (sendto == "corp3") k = "SBS"
        else if (sendto == "corp4") k = "서대문은행"
        else if (sendto == "corp5") k = "이세계아이돌카페"
        else if (sendto == "corp6") k = "카페쉬는곳"
        else if (sendto == "corp7") k = "서대문경찰서"
        else if (sendto == "corp8") k = "서대문소방서"
        else if (sendto == "corp9") k = "도로교통공단"

        const embed = new EmbedBuilder() //임베드 생성
        .setTitle("이체가 정상적으로 처리되었습니다") // 임베드 제목
        .setColor("#0ACF20") // 임베드 색깔
        .setTimestamp() // 밑에쪽에 임베드가 생성된 시간 나타내기
        .addFields(
            { name: "받는분",value: k, inline: true },
            { name: "거래금액",value: `${comma(betting)}원`, inline: true },
            { name: "법인 잔액",value: `${comma(money1 - betting)}원`, inline: true }
        )

        const text1 = `**법인이체 알림**\n보내는분 : ${i}\n실행한 사람 : ${user.tag}\n거래금액 : ${comma(betting)}원\n법인 잔액 : ${comma(money1 - betting)}원`
        const text2 = `**법인이체 알림**\n보내는분 : ${i}\n실행한 사람 : ${user.tag}\n거래금액 : ${comma(betting)}원\n법인 잔액 : ${comma(money2 + betting)}원`

        const LogEmbed = new EmbedBuilder()
        .setTitle("이체 로그 (code:222)") // 임베드 제목
        .setColor("#0ACF20") // 임베드 색깔
        .setDescription(`${i} (${user.tag})> -> ${k}`)//임베드 설명
        .addFields(
            { name: "거래금액", value: `${comma(betting)}원`, inline: true },
            { name: "보내는분 잔액", value: `${comma(money1)}원` + "→" + `${comma(money1 - betting)}원`, inline: true },
            { name: "받는분 잔액", value: `${comma(money2)}원` + "→" + `${comma(money2 + betting)}원`, inline: true },
          )
        .setTimestamp() // 밑에쪽에 임베드가 생성된 시간 나타내기
        await interaction.reply({ ephemeral: true, embeds: [embed]});
        client.users.send(findMe.Roblox__ID, text1)
        client.users.send(findSend.Roblox__ID, text2)
        logs.send({embeds: [LogEmbed]});
	},
};