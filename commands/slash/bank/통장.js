const comma = require('comma-number')
const Schema = require("../../models/계좌")
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('통장')
		.setDescription('자신의 통장을 확인할 수 있습니다.'),
	async execute(interaction) {
        const {client} = interaction
        const logs = await client.channels.cache.get(process.env.LogCh) //로그채널
        const Sublogs = await client.channels.cache.get(process.env.SubLogCh) //로그채널
        const user = interaction.user
        
        console.log('Schema',Schema)

        //계좌없음 임베드
        const embed1 = new EmbedBuilder() //임베드 생성
        .setTitle(`게좌가 없습니다.`) 
        .setDescription('"/계좌개설"을 사용해서 계좌를 만들어 보세요.')
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
        
        const finduser = await Schema.findOne({ Discord_ID: user.id })
        if (!finduser) {
            Sublogs.send(`**통장조회 실패** ${interaction.user.id}님이 계좌가 없어서 통장조회에 실패했습니다.`)
            return interaction.reply({ ephemeral: true,  embeds: [embed1] })
        }
        let i
         if (finduser.account == 0) i = "활성화됨"
         else if (finduser.account == 1) i = "비활성화됨"
         else if (finduser.account == 2) i = "N/A"
        //통장 정보 임베드
        const embed = new EmbedBuilder() //임베드 생성
        .setTitle(`${user.tag}님의 계좌 정보`) 
        .setURL("https://www.roblox.com/users/" + finduser.Roblox__ID + "/profile")
        .addFields(
            { name: `잔액`, value: `${comma(finduser.money)}원`, inline: true},
            { name: 'Discord_ID', value: finduser.Discord_ID, inline: true },
            { name: 'Roblox_ID', value: finduser.Roblox__ID, inline: true },
            { name: '계좌 상태', value: `${i}`, inline: true },
            { name: '계좌 개설일', value: finduser.date, inline: true },
        )
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
        await interaction.reply({ ephemeral: true,  embeds: [embed] })
	},
};