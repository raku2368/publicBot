const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const comma = require("comma-number")
const Schema = require("../../models/계좌")
const dotenv = require("dotenv");
dotenv.config();

const embed1F = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️설정 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`대상이 이미 해당 법인에 권한이 없습니다.`)//임베드 설명

const embed1T = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️설정 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`대상이 이미 해당 법인에 권한이 있습니다.`)//임베드 설명

const embed3 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️설정 실패**") // 임베드 제목
.setColor("#F7F009") // 임베드 색깔
.setDescription(`권한설정을 할 권한이 없습니다.`)//임베드 설명

const embed6 = new EmbedBuilder() //임베드 생성
.setTitle("**⚠️이체 실패**") // 임베드 제목
.setColor("#FE0000") // 임베드 색깔
.setDescription(`법인계좌가 비활성화 되었습니다.`)//임베드 설명

module.exports = {
	data: new SlashCommandBuilder()
		.setName('법인권한설정')
		.setDescription('⚠️일반회원 사용 불가⚠️')
       .addStringOption((data) =>
        data
         .setName('본인법인명')
         .setDescription('본인의 법인 이름을 선택하세요.')
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

        .addUserOption((data) =>
        data
          .setName("설정대상")
          .setDescription("권한을 설정할 대상을 선택하세요")
          .setRequired(true))

       .addStringOption((data) =>
        data
         .setName('권한설정')
         .setDescription('권한을 부여할지 박탈할지 선택하세요.')
         .setRequired(true)
         .addChoices(
          { name: '권한부여', value: 'set1' },
          { name: '권한박탈', value: 'set2' },
        )),
           
	async execute(interaction) {
        const {client} = interaction
		    const logs = await client.channels.cache.get(process.env.LogCh) //로그채널
        const user = interaction.user
        const corp = interaction.options.getString("본인법인명")
        const target = interaction.options.getUser("설정대상")
        const set = interaction.options.getInteger("권한설정")
        
        const findCorp = await Schema.findOne({ Discord_ID: corp }) // 데이터베이스에서 userid 가 메세지를 보낸사람의 id인것을 검색
      if (!findCorp.Roblox__ID == user.id) return //권한 없다는 내용
      if (!findCorp.account == 1) return //정지
      if (user)
      //법인 권한 확인
      if (corp == "corp1") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550480642445422')) return interaction.reply({ ephemeral: true, embeds: [embed1]})  //---------수정!! 법인별 접근 역할 ID⚠️
      } else if (corp == "corp2") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550491723796480')) return interaction.reply({ ephemeral: true, embeds: [embed1]})  //---------수정!! 법인별 접근 역할 ID⚠️
      } else if (corp == "corp3") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550494278123630')) return interaction.reply({ ephemeral: true, embeds: [embed1]})  //---------수정!! 법인별 접근 역할 ID⚠️
      } else if (corp == "corp4") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550495674847243')) return interaction.reply({ ephemeral: true, embeds: [embed1]})  //---------수정!! 법인별 접근 역할 ID⚠️
      } else if (corp == "corp5") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550497017020507')) return interaction.reply({ ephemeral: true, embeds: [embed1]})  //---------수정!! 법인별 접근 역할 ID⚠️
      } else if (corp == "corp6") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068550817537347634')) return interaction.reply({ ephemeral: true, embeds: [embed1]})  //---------수정!! 법인별 접근 역할 ID⚠️
      } else if (corp == "corp7") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068551495190065202')) return interaction.reply({ ephemeral: true, embeds: [embed1]})
      } else if (corp == "corp8") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068551452382986381')) return interaction.reply({ ephemeral: true, embeds: [embed1]})
      } else if (corp == "corp9") {
        if (!interaction.member.roles.cache.some(role => role.id === '1068551336427257917')) return interaction.reply({ ephemeral: true, embeds: [embed1]})
      }

      //기타 조건 확인
      if (!findMe) return interaction.reply({ ephemeral: true, embeds: [embed1]}) // 데이터베이스에서 userid 가 메세지를 보낸사람의 id인것이 없다면 리턴
      if (!findSend) return interaction.reply({ ephemeral: true, embeds: [embed2]}) // 위에꺼랑 비슷 (데이터베이스에서 멘션한 유저를 찾을 수 없으면 리턴)
      if (betting <= 0) return interaction.reply({ ephemeral: true, embeds: [embed3]}) // 메세지 내용에 -가 포함되면 리턴
      const money1 = parseInt(findMe.money) // money를 메세지를 보낸사람의 돈으로 지정
      const money2 = parseInt(findSend.money) // money2를 멘션한 유저의 돈으로 지정
      if (money1 < betting) return interaction.reply({ ephemeral: true, embeds: [embed4]})
      if (!findMe.account == 0) return interaction.reply({ ephemeral: true, embeds: [embed6]})
      if (!findSend.account == 0) return interaction.reply({ ephemeral: true, embeds: [embed7]})



      await Schema.findOneAndUpdate({ Discord_ID: sendto.id }, { // 데이터베이스를 검색하고 업데이트
          money: money2 + betting,
       })        
       await Schema.findOneAndUpdate({ Discord_ID: corp }, { 
           money: money1 - betting,
       })
        const embed = new EmbedBuilder() //임베드 생성
        .setTitle("이체가 정상적으로 처리되었습니다") // 임베드 제목
        .setColor("#0ACF20") // 임베드 색깔
        .setTimestamp() // 밑에쪽에 임베드가 생성된 시간 나타내기
        .addFields(
            { name: "받는분",value: sendto.tag, inline: true },
            { name: "거래금액",value: `${comma(betting)}원`, inline: true },
            { name: "법인 잔액",value: `${comma(money1 - betting)}원`, inline: true }
        )

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

        const text1 = `**법인이체 알림**\n보내는분 : ${i}\n실행한 사람 : ${user.tag}\n거래금액 : ${comma(betting)}원\n법인 잔액 : ${comma(money1 - betting)}원`
        const text2 = `**이체 알림**\n보내는분 : ${i}\n거래금액 : ${comma(betting)}원\n내 잔액 : ${comma(money2 + betting)}원`

        const LogEmbed = new EmbedBuilder()
        .setTitle("이체 로그 (code:221)") // 임베드 제목
        .setColor("#0ACF20") // 임베드 색깔
        .setDescription(`${i} (${user.tag})> -> <@${sendto.id}>`)//임베드 설명
        .addFields(
            { name: "거래금액", value: `${comma(betting)}원`, inline: true },
            { name: "보내는분 잔액", value: `${comma(money1)}원` + "→" + `${comma(money1 - betting)}원`, inline: true },
            { name: "받는분 잔액", value: `${comma(money2)}원` + "→" + `${comma(money2 + betting)}원`, inline: true },
          )
        .setTimestamp() // 밑에쪽에 임베드가 생성된 시간 나타내기
        await interaction.reply({ ephemeral: true, embeds: [embed]});
        client.users.send(findMe.Roblox__ID, text1);
        client.users.send(sendto.id, text2);
        logs.send({embeds: [LogEmbed]});
	},
};