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
		.setName('이체')
		.setDescription('원하는 사람에게 돈을 보냅니다')

        .addUserOption((data) =>
        data
          .setName("받는분")
          .setDescription("옵션을 선택해 주세요")
          .setRequired(true))

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
        const sendto = interaction.options.getUser("받는분");
        const betting = interaction.options.getInteger("금액");
        const findMe = await Schema.findOne({ Discord_ID: user.id })
        const findSend = await Schema.findOne({ Discord_ID: sendto.id })

        if (!findMe) {
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
        if (!findSend) {
          return interaction.reply({ ephemeral: true, embeds: [embed2]})}
        const money1 = parseInt(findMe.money)
        const money2 = parseInt(findSend.money)
        if (betting <= 0) {
          return interaction.reply({ ephemeral: true, embeds: [embed3]})}
        if (money1 < betting) {
          return interaction.reply({ ephemeral: true, embeds: [embed4]})}
        if (user == sendto) {
          return interaction.reply({ ephemeral: true, embeds: [embed5]})}
        if (!findMe.account == 0) {
          return interaction.reply({ ephemeral: true, embeds: [embed6]})}
        if (!findSend.account == 0) {
          return interaction.reply({ ephemeral: true, embeds: [embed7]})}
        await Schema.findOneAndUpdate({ Discord_ID: sendto.id }, {
            money: money2 + betting,
        })        
        await Schema.findOneAndUpdate({ Discord_ID: user.id }, { 
            money: money1 - betting,
        })
        const embed = new EmbedBuilder() //임베드 생성
        .setTitle("이체가 정상적으로 처리되었습니다")
        .setColor("#0ACF20")
        .setTimestamp()
        .addFields(
            { name: "받는분",value: sendto.tag, inline: true },
            { name: "거래금액",value: `${comma(betting)}원`, inline: true },
            { name: "내 잔액",value: `${comma(money1 - betting)}원`, inline: true }
        )
        const text = `**이체 알림**\n보내는분 : ${user.tag}\n거래금액 : ${comma(betting)}원\n내 잔액 : ${comma(money2 + betting)}원`

        const LogEmbed = new EmbedBuilder()
        .setTitle("이체 로그 (code:211)")
        .setColor("#0ACF20")
        .setDescription(`<@${user.id}> -> <@${sendto.id}>`)
        .addFields(
            { name: "거래금액", value: `${comma(betting)}원`, inline: true },
            { name: "보내는분 잔액", value: `${comma(money1)}원` + "→" + `${comma(money1 - betting)}원`, inline: true },
            { name: "받는분 잔액", value: `${comma(money2)}원` + "→" + `${comma(money2 + betting)}원`, inline: true },
          )
        .setTimestamp()
        await interaction.reply({ ephemeral: true, embeds: [embed]});
        client.users.send(sendto.id, text);
        logs.send({embeds: [LogEmbed]});
        await client.channels.cache.get('1130473894629871658').send({embeds: [LogEmbed]})
	},
};