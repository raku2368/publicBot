const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Schema = require("../../models/계좌")
const dotenv = require("dotenv");
dotenv.config();
const comma = require("comma-number")

const embed1 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️명령 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`관리자 권한이 없습니다.`)//임베드 설명

const embed2 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️명령 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`해당 계좌는 이미 활성화 또는 비활성화 되어있습니다.`)//임베드 설명

const embed3 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️입력 오류**") // 임베드 제목
.setColor("#F7F009") // 임베드 색깔
.setDescription(`개인 또는 법인란 하나만 입력해 주세요.`)//임베드 설명

const embed4 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️입력 오류**") // 임베드 제목
.setColor("#F7F009") // 임베드 색깔
.setDescription(`가입된 회원이 아닙니다.`)//임베드 설명

const embed5 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️이체 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`본인의 계좌가 비활성화 되었습니다.`)//임베드 설명

const embed6 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️이체 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`받는분의 계좌가 비활성화 되었습니다.`)//임베드 설명

module.exports = {
	data: new SlashCommandBuilder()
		.setName('강제이체')
		.setDescription('⚠️일반회원 사용 불가⚠️')
    .addUserOption((data) =>
      data
        .setName("보내는분")
        .setDescription("강제로 돈을 받을 계좌를 선택해 주세요.")
        .setRequired(true))

    .addUserOption((data) =>
      data
        .setName("받는분")
        .setDescription("강제로 돈을 받을 계좌를 선택해 주세요.")
        .setRequired(true))

    .addIntegerOption((data) =>
      data
        .setName("금액")
        .setDescription("강제로 이체시킬 금액을 입력해 주세요(음수 입력 가능)")
        .setRequired(true)),
           
	async execute(interaction) { 
    const {client} = interaction
    const logs = await client.channels.cache.get(process.env.LogCh) //로그채널
    const Sublogs = await client.channels.cache.get(process.env.SubLogCh) //로그채널
    const user = interaction.options.getUser("보내는분")
    const sendto = interaction.options.getUser("받는분");
    const betting = interaction.options.getInteger("금액");
    const findMe = await Schema.findOne({ Discord_ID: user.id }) // 데이터베이스에서 userid 가 메세지를 보낸사람의 id인것을 검색
    const findSend = await Schema.findOne({ Discord_ID: sendto.id })// 위에랑 비슷함 ( 데이터베이스에서 멘션한 유저를 검색)

    if (!interaction.member.roles.cache.some(role => role.id === '1129822550319452170')) return interaction.reply({ ephemeral: true, embeds: [embed1]})  //---------수정!! 접근 역할 ID⚠️
    if (!findMe) {
      Sublogs.send(`**이체 실패** <@${interaction.user.id}>님이 보내는분 계좌가 없어서 강제이체명령에 실패했습니다.`)
      return interaction.reply({ ephemeral: true, embeds: [embed1]})}
    if (!findSend) {
      Sublogs.send(`**이체 실패** <@${interaction.user.id}>님이 받는분 계좌가 없어서 강제이체명령에 실패했습니다.`)
      return interaction.reply({ ephemeral: true, embeds: [embed2]})}
    const money1 = parseInt(findMe.money) // money를 메세지를 보낸사람의 돈으로 지정
    const money2 = parseInt(findSend.money) // money2를 멘션한 유저의 돈으로 지정
    if (money1 < betting) {
      Sublogs.send(`**이체 실패** <@${interaction.user.id}>님이 가진돈보다 많이 입력해서 강제이체명령에 실패했습니다.`)
      return interaction.reply({ ephemeral: true, embeds: [embed4]})}

    await Schema.findOneAndUpdate({ Discord_ID: sendto.id }, { // 데이터베이스를 검색하고 업데이트
        money: money2 + betting,
    })        
    await Schema.findOneAndUpdate({ Discord_ID: user.id }, { 
        money: money1 - betting,
    })
    const embed = new EmbedBuilder() 
     .setTitle("**✅명령 성공**") 
     .setColor("#0ACF20") 
     .setDescription(`<@${user.id}>님에서 <@${sendto.id}>계좌로 ${comma(betting)}원을 변동했습니다.\n보내는분 잔액변동${comma(money1)}원 → ${comma(money1 - betting)}원\n받는분 잔액변동${comma(money2)}원 → ${comma(money2 + betting)}원`)
    const LogEmbed = new EmbedBuilder()
     .setTitle("명령 로그 (code:33)") 
     .setColor("#F7F009") 
     .setDescription(`강제이체`)
     .addFields(
     { name: "보내는분 계좌", value: `<@${user.id}>`, inline: true },
     { name: "받는분 계좌", value: `<@${sendto.id}>`, inline: true },
     { name: "실행한 사람", value: `<@${interaction.user.id}>`, inline: true },
     { name: "추가 금액", value: `${comma(betting)}원`, inline: true },
     { name: "보내는분 잔액 변동", value: `${comma(money1)}원 → ${comma(money1 - betting)}원`, inline: true }, 
     { name: "받는분 잔액 변동", value: `${comma(money2)}원 → ${comma(money2 + betting)}원`, inline: true }, 
     )
     .setTimestamp()

     const text1 = `⚠️강제이체 알림\n관리자가 명령어를 사용해 본인 계좌에서 강제로 돈을 보냈습니다.\n거래금액:${comma(betting)}원\n${comma(money1)}원 → ${comma(money1 - betting)}원`
     const text2 = `⚠️강제이체 알림\n관리자가 명령어를 사용해 본인 계좌에서 강제로 돈을 받았습니다.\n거래금액:${comma(betting)}원\n${comma(money2)}원 → ${comma(money2 + betting)}원`

    interaction.reply({ ephemeral: true, embeds: [embed]})
    client.users.send(user.id, text1)
    client.users.send(user.id, text2)
    logs.send({ ephemeral: true, embeds: [LogEmbed]})
    await client.channels.cache.get('1130473894629871658').send({embeds: [LogEmbed]})   
        
  }
}