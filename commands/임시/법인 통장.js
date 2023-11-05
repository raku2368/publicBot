const comma = require('comma-number')
const Schema = require("../models/1003883610996219914")
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

const embed1 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️확인 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`해당 계좌에 권한이 없습니다.`)//임베드 설명

module.exports = {
	data: new SlashCommandBuilder()
		.setName('법인통장')
		.setDescription('⚠️일반회원 사용 불가⚠️')
            .addStringOption((options) =>
            options
                .setName('확인할법인명')
                .setDescription('정보를 확인할 법인명을 선택해 주세요.')
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
                )
            ),
	async execute(interaction) {
        const {client} = interaction
        const logs = await client.channels.cache.get(process.env.LogCh) //로그채널
        const Sublogs = await client.channels.cache.get(process.env.SubLogCh) //로그채널
        const user = interaction.user
        const corp = interaction.options.getString("확인할법인명")
        const finduser = await Schema.findOne({ Discord_ID: corp })
      //법인 권한 확인
      if (corp == "corp1") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550480642445422')) {
          Sublogs.send(`**법인에서개인이체 실패** <@${interaction.user.id}>님이 서대문구청 권한이 없어서 법인통장 조회에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp2") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550491723796480')) {
          Sublogs.send(`**법인에서개인이체 실패** <@${interaction.user.id}>님이 DB손해보험 권한이 없어서 법인통장 조회에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp3") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550494278123630')) {
          Sublogs.send(`**법인에서개인이체 실패** <@${interaction.user.id}>님이 SBS 권한이 없어서 법인통장 조회에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp4") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550495674847243')) {
          Sublogs.send(`**법인에서개인이체 실패** <@${interaction.user.id}>님이 서대문은행 권한이 없어서 법인통장 조회에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp5") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550497017020507')) {
          Sublogs.send(`**법인에서개인이체 실패** <@${interaction.user.id}>님이 이세계아이돌카페 권한이 없어서 법인통장 조회에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp6") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550817537347634')) {
          Sublogs.send(`**법인에서개인이체 실패** <@${interaction.user.id}>님이 카페쉬는곳 권한이 없어서 법인통장 조회에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp7") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068551495190065202')) {
          Sublogs.send(`**법인에서개인이체 실패** <@${interaction.user.id}>님이 서대문경찰서 권한이 없어서 법인통장 조회에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp8") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068551452382986381')) {
          Sublogs.send(`**법인에서개인이체 실패** <@${interaction.user.id}>님이 서대문소방서 권한이 없어서 법인통장 조회에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      } else if (corp == "corp9") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068551336427257917')) {
          Sublogs.send(`**법인에서개인이체 실패** <@${interaction.user.id}>님이 도로교통공단 권한이 없어서 명령에 실패했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [embed1]})}
      }

      let k
      if (corp == "corp1") k = "서대문구청" 
      else if (corp == "corp2") k = "DB손해보험"
      else if (corp == "corp3") k = "SBS"
      else if (corp == "corp4") k = "서대문은행"
      else if (corp == "corp5") k = "이세계아이돌카페"
      else if (corp == "corp6") k = "카페쉬는곳"
      else if (corp == "corp7") k = "서대문경찰서"
      else if (corp == "corp8") k = "서대문소방서"
      else if (corp == "corp9") k = "도로교통공단"

    let i
    if (finduser.account == 0) i = "활성화됨"
    else if (finduser.account == 1) i = "비활성화됨"
    else if (finduser.account == 2) i = "N/A"
    
    //통장 정보 임베드
    const embed = new EmbedBuilder() //임베드 생성
    .setTitle(`${k}님의 계좌 정보`) 
        .setDescription('서대문은행')
        .addFields(
            { name: `잔액`, value: `${comma(finduser.money)}원`, inline: true},
            { name: '대표 디코 프로필', value: `<@${finduser.Roblox__ID}>`, inline: true },
            { name: '계좌 상태', value: `${i}`, inline: true },
            { name: '계좌 개설일', value: finduser.date, inline: true },
        )
        //.setThumbnail(finduser.img)
        .setTimestamp()
        await interaction.reply({ ephemeral: true,  embeds: [embed] })
	},
};