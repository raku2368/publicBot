const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const comma = require("comma-number")
const Schema = require("../../models/계좌")
const dotenv = require("dotenv");
dotenv.config();

const embed1 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️이체 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`보내는분의 계좌가 없습니다.`)//임베드 설명

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
		.setName('개인에서법인이체')
		.setDescription('법인(경찰서, 소방서, xx카페 등)에게 돈을 보냅니다')
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
           .setDescription("옵션을 선택해 주세요")
           .setRequired(true)),

	async execute(interaction) {
        const {client} = interaction
        const logs = await client.channels.cache.get(process.env.LogCh) //로그채널
        const Sublogs = await client.channels.cache.get(process.env.SubLogCh) //로그채널
        const user = interaction.user
        const sendto = interaction.options.getString("받는분법인명")
        const betting = interaction.options.getInteger("금액")
        const findMe = await Schema.findOne({ Discord_ID: user.id }) // 데이터베이스에서 userid 가 메세지를 보낸사람의 id인것을 검색
        const findSend = await Schema.findOne({ Discord_ID: sendto })// 위에랑 비슷함 ( 데이터베이스에서 멘션한 유저를 검색)
        
        //자격 확인
        if (!findMe) {
            Sublogs.send(`**개인에서법인이체실패** <@${interaction.user.id}>님이 보내는분 계좌가 없어서 명령에 실패했습니다.`)
            return interaction.reply({ ephemeral: true, embeds: [embed1]})} // 데이터베이스에서 userid 가 메세지를 보낸사람의 id인것이 없다면 리턴
        if (!findSend) {
            Sublogs.send(`**개인에서법인이체실패** <@${interaction.user.id}>님이 받는분 계좌가 없어서 명령에 실패했습니다.`)
            return interaction.reply({ ephemeral: true, embeds: [embed2]})} // 위에꺼랑 비슷 (데이터베이스에서 멘션한 유저를 찾을 수 없으면 리턴)
        const money1 = parseInt(findMe.money) // money를 메세지를 보낸사람의 돈으로 지정
        const money2 = parseInt(findSend.money) // money2를 멘션한 유저의 돈으로 지정
        if (betting <= 0) {
            Sublogs.send(`**개인에서법인이체실패** <@${interaction.user.id}>님이 음수를 올바르지 않은 숫자를 명령에 실패했습니다.`)
            return interaction.reply({ ephemeral: true, embeds: [embed3]})} // 메세지 내용에 -가 포함되면 리턴
        if (money1 < betting) {
            Sublogs.send(`**개인에서법인이체실패** <@${interaction.user.id}>님이 가진돈보다 많이 입력해서 명령에 실패했습니다.`)
            return interaction.reply({ ephemeral: true, embeds: [embed4]})}
        if (sendto == user.id) {
            Sublogs.send(`**개인에서법인이체실패** <@${interaction.user.id}>님이 받는분에 본인을 입력해서 명령에 실패했습니다.`)
            return interaction.reply({ ephemeral: true, embeds: [embed5]})} // 맨션 한 유저가 메세지를 보낸유저와 아이디가 같다면 return
        if (!findMe.account == 0) {
            Sublogs.send(`**개인에서법인이체실패** <@${interaction.user.id}>님이 보내는분 계좌가 정지되어 있어서 명령에 실패했습니다.`)
            return interaction.reply({ ephemeral: true, embeds: [embed6]})}
        if (!findSend.account == 0) {
            Sublogs.send(`**개인에서법인이체실패** <@${interaction.user.id}>님이 받는분 계좌가 정지되어 있어서 명령에 실패했습니다.`)
            return interaction.reply({ ephemeral: true, embeds: [embed7]})}

        await Schema.findOneAndUpdate({ Discord_ID: sendto }, { // 데이터베이스를 검색하고 업데이트
            money: money2 + betting,
        })        
        await Schema.findOneAndUpdate({ Discord_ID: user.id }, { 
            money: money1 - betting,
        })

        let i
        if (sendto == "corp1") i = "서대문구청" 
        else if (sendto == "corp2") i = "DB손해보험"
        else if (sendto == "corp3") i = "SBS"
        else if (sendto == "corp4") i = "서대문은행"
        else if (sendto == "corp5") i = "이세계아이돌카페"
        else if (sendto == "corp6") i = "카페쉬는곳"
        else if (sendto == "corp7") i = "서대문경찰서"
        else if (sendto == "corp8") i = "서대문소방서"
        else if (sendto == "corp9") i = "도로교통공단"
        
        const embed = new EmbedBuilder() //임베드 생성
        .setTitle("이체가 정상적으로 처리되었습니다") // 임베드 제목
        .setColor("#0ACF20") // 임베드 색깔
        .setTimestamp() // 밑에쪽에 임베드가 생성된 시간 나타내기
        .addFields(
            { name: "받는분",value: i, inline: true },
            { name: "거래금액",value: `${comma(betting)}원`, inline: true },
            { name: "내 잔액",value: `${comma(money1 - betting)}원`, inline: true }
        )
        const text = `**법인이체 알림**\n보내는분 : ${user.tag}\n거래금액 : ${comma(betting)}원\n법인 잔액 : ${comma(money2 + betting)}원`

        const LogEmbed = new EmbedBuilder()
        .setTitle("이체 로그 (code:212)") // 임베드 제목
        .setColor("#0ACF20") // 임베드 색깔
        .setDescription(`<@${user.id}> -> ${i}`)//임베드 설명
        .addFields(
            { name: "거래금액", value: `${comma(betting)}원`, inline: true },
            { name: "보내는분 잔액", value: `${comma(money1)}원` + "→" + `${comma(money1 - betting)}원`, inline: true },
            { name: "받는분 잔액", value: `${comma(money2)}원` + "→" + `${comma(money2 + betting)}원`, inline: true },
          )
        .setTimestamp() // 밑에쪽에 임베드가 생성된 시간 나타내기
        await interaction.reply({ ephemeral: true, embeds: [embed]});
        client.users.send(findSend.Roblox__ID, text);
        logs.send({embeds: [LogEmbed]});
	},
};