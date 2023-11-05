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
		.setName('관리자전용')
		.setDescription('⚠️일반회원 사용 불가⚠️')
       .addStringOption((data) =>
        data
         .setName('명령')
         .setDescription('ㅇㅇ')
         .setRequired(true)
         .addChoices(
          { name: '계좌 정지', value: 'order1' },
          { name: '계좌 정지 해제', value: 'order2' },
          { name: '법인 대표 변경', value: 'order3' },
          { name: '잔액조회', value: 'order4' },
          { name: 'N/A', value: 'order5' },
          { name: '봇 종료', value: 'order6' },
        ))

      .addUserOption((data) =>
      data
        .setName("개인선택지")
        .setDescription("앞에서 선택한 항목에 따라 입력해 주세요")
        .setRequired(false))

      .addStringOption((data) =>
        data
         .setName('법인선택지')
         .setDescription('앞에서 선택한 항목에 따라 입력해 주세요')
         .setRequired(false)
         .addChoices(
        )),
           
	async execute(interaction) { 
    const {client} = interaction
    if (!interaction.member.roles.cache.some(role => role.id === '1129822550319452170')) return interaction.reply({ ephemeral: true, embeds: [embed1]})  //---------수정!! 접근 역할 ID⚠️
		const logs = await client.channels.cache.get(process.env.LogCh) //로그채널
    const MainCh = await client.channels.cache.get(process.env.MainCh) //로그채널
    const SubLogCh = await client.channels.cache.get(process.env.SubLogCh) //로그채널
    const user = interaction.user
    const personal = interaction.options.getUser("개인선택지")
    const corp = interaction.options.getString("법인선택지")
    const order = interaction.options.getString("명령")
    if (!personal && !corp) return interaction.reply({ ephemeral: true, embeds: [embed3]})//값 둘다 없음
    if (personal && corp) return interaction.reply({ ephemeral: true, embeds: [embed3]})//값 둘다 있음

    const text1F = `⚠️계좌정지 알림\n본인의 계좌가 정지되었습니다.\n자세한 내용은 문의하기를 통해 확인하세요.`
    const text1T = `✅계좌활성화 알림\n본인의 계좌가 활성화되었습니다.`
    const text2F = `⚠️계좌정지 알림\n본인의 법인계좌가 정지되었습니다.\n자세한 내용은 문의하기를 통해 확인하세요.`
    const text2T = `✅계좌활성화 알림\n본인의 법인계좌가 활성화되었습니다.`

    let i

      if (order == "order1") { //정지
        if (personal) {
          const findpersonal = await Schema.findOne({ Discord_ID: personal.id })
          if (!findpersonal) return interaction.reply({ ephemeral: true, embeds: [embed4]}) //계좌 없음
          if (findpersonal.account == 1) {return interaction.reply({ ephemeral: true, embeds: [embed2]})// 이미 정지됨
            } else {
              await Schema.findOneAndUpdate({ Discord_ID: personal.id }, { account : 1})
              const embed = new EmbedBuilder() 
               .setTitle("**✅명령 성공**") 
               .setColor("#0ACF20") 
               .setDescription(`<@${personal.id}>님을 계좌 비활성화 했습니다.`)
              const LogEmbed = new EmbedBuilder()
               .setTitle("명령 로그 (code:32F)") 
               .setColor("#F7F009") 
               .setDescription(`계좌 비활성화`)
               .addFields(
               { name: "대상 계좌", value: `<@${personal.id}>`, inline: true },
               { name: "실행한 사람", value: `<@${user.id}>`, inline: true },
               )
               .setTimestamp()
              interaction.reply({ ephemeral: true, embeds: [embed]})
              client.users.send(personal.id, text1F)
              logs.send({ ephemeral: true, embeds: [LogEmbed]})
              await client.channels.cache.get('1130473894629871658').send({embeds: [LogEmbed]})
            }
        } else {
          const findcorp = await Schema.findOne({ Discord_ID: corp })
          if (!findcorp) return interaction.reply({ ephemeral: true, embeds: [embed4]}) //계좌 없음
          if (findcorp.account == 1) {return interaction.reply({ ephemeral: true, embeds: [embed2]})// 이미 정지됨
           } else {
            await Schema.findOneAndUpdate({ Discord_ID: corp }, { account : 1})
            const embed = new EmbedBuilder() 
             .setTitle("**✅명령 성공**") 
             .setColor("#0ACF20") 
             .setDescription(`${i}님을 계좌 비활성화 했습니다.`)
            const LogEmbed = new EmbedBuilder()
             .setTitle("명령 로그 (code:32F)") 
             .setColor("#F7F009")
             .setDescription(`계좌 비활성화`)
             .addFields(
             { name: "대상 계좌", value: `${i}`, inline: true },
             { name: "실행한 사람", value: `<@${user.id}>`, inline: true },
             )
             .setTimestamp()
            interaction.reply({ ephemeral: true, embeds: [embed]})
            logs.send({ ephemeral: true, embeds: [LogEmbed]})
            await client.channels.cache.get('1130473894629871658').send({embeds: [LogEmbed]})
            client.users.send(findcorp.Roblox__ID, text2F)
          }
        }
      } else if (order == "order2") { //해제
        if (personal) {
          const findpersonal = await Schema.findOne({ Discord_ID: personal.id })
          if (!findpersonal) return interaction.reply({ ephemeral: true, embeds: [embed4]}) //계좌 없음
          if (findpersonal.account == 0) {return interaction.reply({ ephemeral: true, embeds: [embed2]})// 이미 해제됨
            } else {
              await Schema.findOneAndUpdate({ Discord_ID: personal.id }, { account : 0})
              const embed = new EmbedBuilder() 
               .setTitle("**✅명령 성공**") 
               .setColor("#0ACF20") 
               .setDescription(`<@${personal.id}>님을 계좌 활성화 했습니다.`)
              const LogEmbed = new EmbedBuilder()
               .setTitle("명령 로그 (code:32T)") 
               .setColor("#F7F009") 
               .setDescription(`계좌 활성화`)
               .addFields(
               { name: "대상 계좌", value: `<@${personal.id}>`, inline: true },
               { name: "실행한 사람", value: `<@${user.id}>`, inline: true },
               )
               .setTimestamp()
              interaction.reply({ ephemeral: true, embeds: [embed]})
              logs.send({ ephemeral: true, embeds: [LogEmbed]})
              await client.channels.cache.get('1130473894629871658').send({embeds: [LogEmbed]})
              client.users.send(personal.id, text1T)
            }
        } else {
          const findcorp = await Schema.findOne({ Discord_ID: corp })
          if (!findcorp) return interaction.reply({ ephemeral: true, embeds: [embed4]}) //계좌 없음
          if (findcorp.account == 0) {return interaction.reply({ ephemeral: true, embeds: [embed2]})// 이미 해제됨
           } else {
            await Schema.findOneAndUpdate({ Discord_ID: corp }, { account : 0})
            const embed = new EmbedBuilder() 
             .setTitle("**✅명령 성공**") 
             .setColor("#0ACF20") 
             .setDescription(`${corp}님을 계좌 활성화 했습니다.`)
            const LogEmbed = new EmbedBuilder()
             .setTitle("명령 로그 (code:32T)") 
             .setColor("#F7F009")
             .setDescription(`계좌 활성화`)
             .addFields(
             { name: "대상 계좌", value: `${i}`, inline: true },
             { name: "실행한 사람", value: `<@${user.id}>`, inline: true },
             )
             .setTimestamp()
            interaction.reply({ ephemeral: true, embeds: [embed]})
            logs.send({ ephemeral: true, embeds: [LogEmbed]})
            await client.channels.cache.get('1130473894629871658').send({embeds: [LogEmbed]})
            client.users.send(findcorp.Roblox__ID, text2T)
          }
        }
      } else if (order == "order3") { //변경
        const embed = new EmbedBuilder() 
        .setTitle("**🔒해당 명령은 자동으로 수행할 수 없습니다.**") 
        .setColor("#F7F009") 
        .setDescription(`해당 명령은 자동으로 수행할 수 없습니다. 직접 DB에 접근해 Roblox__ID항목을 수정해야 합니다.`)
        interaction.reply({ ephemeral: true, embeds: [embed]})
      } else if (order == "order4") { // 잔액조회
        if (personal) {
          const findpersonal = await Schema.findOne({ Discord_ID: personal.id })
          if (!findpersonal) return interaction.reply({ ephemeral: true, embeds: [embed4]}) //계좌 없음

        //통장 정보 임베드
        let i
        if (findpersonal.account == 0) i = "활성화됨"
        else if (findpersonal.account == 1) i = "비활성화됨"
        else if (findpersonal.account == 2) i = "N/A"
        const embed = new EmbedBuilder() //임베드 생성
        .setTitle(`${personal.tag}님의 계좌 정보`) 
        .setURL("https://www.roblox.com/users/" + findpersonal.Roblox__ID + "/profile")
        .setDescription('서대문은행')
        .addFields(
            { name: `잔액`, value: `${comma(findpersonal.money)}원`, inline: true},
            { name: 'Discord_ID', value: findpersonal.Discord_ID, inline: true },
            { name: 'Roblox_ID', value: findpersonal.Roblox__ID, inline: true },
            { name: '계좌 상태', value: `${i}`, inline: true },
            { name: '계좌 개설일', value: findpersonal.date, inline: true },
        )
        .setThumbnail(personal.displayAvatarURL())
        .setTimestamp()
        await interaction.reply({ ephemeral: true,  embeds: [embed] })
        } else {
          const findcorp = await Schema.findOne({ Discord_ID: corp })
          if (!findcorp) return interaction.reply({ ephemeral: true, embeds: [embed4]}) //계좌 없음
        //통장 정보 임베드
        let i
        if (findcorp.account == 0) i = "활성화됨"
        else if (findcorp.account == 1) i = "비활성화됨"
        else if (findcorp.account == 2) i = "N/A"
        let k
    const embed = new EmbedBuilder() //임베드 생성
        .setTitle(`${k}님의 계좌 정보`) 
        .setDescription('서대문은행')
        .addFields(
            { name: `잔액`, value: `${comma(findcorp.money)}원`, inline: true},
            { name: '대표 프로필', value: `<@${findcorp.Roblox__ID}>`, inline: true },
            { name: '계좌 상태', value: `${i}`, inline: true },
            { name: '계좌 개설일', value: findcorp.date, inline: true },
        )
        .setTimestamp()
        await interaction.reply({ ephemeral: true,  embeds: [embed] })
        }
      } else if (order == "order5") {
        EmbedCh.send({ ephemeral: true, embeds: [MyEmbed]})
      } else if (order == "order6") {
        const embed = new EmbedBuilder() 
        .setTitle("**✅명령 성공**") 
        .setColor("#0ACF20") 
        .setDescription(`봇이 30초 후에 종료됩니다. 재시작시 메인채널 메세지를 삭제해 주세요.`)
        const MainEmbed = new EmbedBuilder() 
        .setTitle("**⚠️명령어 사용을 멈춰주세요!⚠️**") 
        .setColor("#FE0000") 
        .setDescription(`봇이 30초 후에 종료됩니다. 은행 전산망에 피해가 가지 않도록 명령어 사용을 멈춰주세요! 이 메세지는 봇이 다시 시작될 때 자동으로 삭제됩니다.`)
        const LogEmbed = new EmbedBuilder()
        .setTitle("명령 로그 (code:5)") 
        .setColor("#F7F009")
        .setDescription(`봇이 30초 후에 종료됨`)
        .addFields(
        { name: "실행한 사람", value: `<@${user.id}>`, inline: true },
        )
        .setTimestamp()
       interaction.reply({ ephemeral: true, embeds: [embed]})
       logs.send({ ephemeral: true, embeds: [LogEmbed]})
       await client.channels.cache.get('1130473894629871658').send({embeds: [LogEmbed]})
       MainCh.send({ ephemeral: true, embeds: [MainEmbed]})
       setTimeout(() => {
        process.exit();
    }, 30000); 
      }
	},
};