const express = require('express')
const app = express()
require("./index.js")

//Mongose DB connect
const mongoose = require("mongoose")
mongoose.connect(`보안요소삭제`,{  
}).then(console.log("데이터베이스 연결 완료"))

app.get("/", (request, response) => {
  response.send("Waiting");
});

//FIND-Discord
app.get("/FIND-Discord/:id", async (request, response) => {
  async function playerDataCheck() {
    const playerData = await Schema.findOne({ Discord_ID: `${request.params.id}` })

    if (playerData) {
      return playerData;

    } else {

      return "NO DATA";
    }
  }

  response.json(await playerDataCheck());
});

//FIND-Game
app.get("/FIND-game/:id", async (request, response) => {
  async function playerDataCheck() {
    const playerData = await Schema.findOne({ game__ID: `${request.params.id}` })

    if (playerData) {
      return playerData;

    } else {

      return "NO DATA";
    }
  }

  response.json(await playerDataCheck());
});

//입금
app.get("/PUT/:id/:money", async (request, response) => {
  
  const playerData = await Schema.findOne({ game__ID: request.params.id })
  
  const betting = request.params.money - playerData.money
  
  //webhook
    const { Webhook, MessageBuilder } = require('discord-webhook-node');
    const hook = new Webhook("보안요소삭제");
    
    const embed = new MessageBuilder()
      .setTitle('ATM 로그 (code:11)')
      .addField('사용자', `<@${playerData.Discord_ID}>`, true)
      .addField('거래금액', comma(betting) + "원", true)
      .addField('잔액변화', comma(playerData.money) + "원 -> " + comma(request.params.money) + "원", true)
      .setColor('#00b0f4')
      .setDescription('ATM입금')
      .setTimestamp();
      
    hook.send(embed);
  
  await Schema.findOneAndUpdate(
    { Roblox__ID: `${request.params.id}` },
    { $set: { money: `${request.params.money}` } }
  );
   console.log('requestParamsId', request.params.id);
  response.send("Updated Database.");
});


//출금
app.get("/OUT/:id/:money", async (request, response) => {
  
  const playerData = await Schema.findOne({ Roblox__ID: request.params.id })
  
  const betting = playerData.money - request.params.money
  
  //webhook
    const { Webhook, MessageBuilder } = require('discord-webhook-node');
    const hook = new Webhook("보안요소삭제");
    
    const embed = new MessageBuilder()
      .setTitle('ATM 로그 (code:12)')
      //.addField('서버', `<@${playerData.Discord_ID}>`, true)
      .addField('사용자', `<@${playerData.Discord_ID}>`, true)
      .addField('거래금액', comma(betting) + "원", true)
      .addField('잔액변화', comma(playerData.money) + "원 -> " + comma(request.params.money) + "원", true)
      .setColor('#00b0f4')
      .setDescription('ATM출금')
      .setTimestamp();
      
    hook.send(embed);
  
  await Schema.findOneAndUpdate(
    { Roblox__ID: `${request.params.id}` },
    { $set: { money: `${request.params.money}` } }
  );
   console.log('requestParamsId', request.params.id);
  response.send("Updated Database.");
});

//PORT
const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
