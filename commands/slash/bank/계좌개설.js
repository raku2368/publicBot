const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require("dotenv");
dotenv.config();

const errorembed1 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️계좌 개설 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`로블록스 프로필링크가 올바른지 확인해 주세요.\n 예시 : https://www.roblox.com/users/963411363/profile`)//임베드 설명

const errorembed2 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️계좌 개설 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`이미 가입된 계정입니다.`)//임베드 설명

module.exports = {
	data: new SlashCommandBuilder()
		.setName('계좌개설')
		.setDescription('계좌를 개설해서 은행서비스를 이용해 보세요.')
        .addStringOption(option => option
            .setName("로블록스프로필링크")
            .setDescription('⚠️정확하게 입력하지 않을 시 시스템이 제대로 작동하지 않으며 은행에서 책임지지 않습니다.⚠️')
            .setRequired(true)),

    async execute(interaction) {
        const {client} = interaction
        const logs = await client.channels.cache.get(process.env.LogCh) //로그채널
        const Sublogs = await client.channels.cache.get(process.env.SubLogCh) //로그채널

        let rblxLink = interaction.options.getString("로블록스프로필링크")
        let a = rblxLink.startsWith('https://www.roblox.com/users/')
        let a2 =  rblxLink.startsWith('https://web.roblox.com/users/')
        let b = rblxLink.endsWith('/profile')
        let [a1, b1, c1, d1, rblxID] = (rblxLink.split('/', 5));
        const t = new Date()
        const date = t.getFullYear() + '.' + (t.getMonth()+1) + '.' + t.getDate();
        const schema = require("../../models/계좌")
        const DisID = await schema.findOne({ Discord_ID: interaction.user.id })
        const RblID = await schema.findOne({ Roblox__ID: rblxID })
        if (!a) {
            if (!a2) {
                Sublogs.send(`**계좌개설 실패** ${interaction.user.name}님이 올바르지 못한 프로필링크를 입력해 계좌개설이 거부당했습니다.`)
                return interaction.reply({ ephemeral: true, embeds: [errorembed1]});
            }
        } else if (!b) {
            Sublogs.send(`**계좌개설 실패** ${interaction.user.name}님이 올바르지 못한 프로필링크를 입력해 계좌개설이 거부당했습니다.`)
          return interaction.reply({ ephemeral: true, embeds: [errorembed1]});
        } else if (DisID) {
            Sublogs.send(`**계좌개설 실패** ${interaction.user.name}님은 이미 가입된 디스코드 계정이므로 계좌개설이 거부당했습니다.`)
            return interaction.reply({ ephemeral: true, embeds: [errorembed2]})
        } else if (RblID) {
            Sublogs.send(`**계좌개설 실패** ${interaction.user.name}님은 이미 가입된 로블록스 계정이므로 계좌개설이 거부당했습니다.`)
            return interaction.reply({ ephemeral: true, embeds: [errorembed2]})
        }
        let newData = new schema({
            Discord_ID: interaction.user.id,
            Roblox__ID: rblxID,
            money: parseInt(0),
            account: '0',
            date: date
        })
        newData.save()
        const user = interaction.user
        const welcomeembed = new EmbedBuilder() //임베드 생성
        .setTitle("**👋환영합니다!**") // 임베드 제목
        .setColor("#0ACF20") // 임베드 색깔
        .setDescription(`은행 계좌 개설이 완료되었습니다.\n해당 정보가 본인인지 확인하세요.\n여러가지 명령어와 도움말을 "/명령어", "/도움말"로 확인해 보세요!\n참고사항 : 만약 본인이 디스코드 설정에서 DM을 꺼놨다면 이체알림이 오지 않아요! DM설정은 선택이지만 키는걸 권장합니다.`)
        .addFields(
            { name: '로블록스 프로필 링크', value: rblxLink, inline: true },
            { name: '디스코드 태그', value: user.tag, inline: true },
        )
        await interaction.reply({ ephemeral: true,  embeds: [welcomeembed] })
        const LogEmbed = new EmbedBuilder()
        .setTitle("계좌개설 로그 (code:3)") // 임베드 제목
        .setColor("#FFFFFF") // 임베드 색깔
        .addFields(
            { name: "디스코드", value: `@${user.tag}`, inline: true },
            { name: "로블록스", value: rblxLink, inline: true },
          )
        .setTimestamp()
        logs.send({embeds: [LogEmbed]})
        await client.channels.cache.get('1130473894629871658').send({embeds: [LogEmbed]})
    }
}