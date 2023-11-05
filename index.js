const dotenv = require("dotenv");
dotenv.config();
const { Client, Collection, REST, Routes } = require("discord.js");
const client = (module.exports = new Client({ intents: [131071] }));
client.login(process.env.TOKEN);//테스트용 ID변경
const fs = require("fs");
module.exports = client;

//몽고 DB
const mongoose = require("mongoose")
mongoose.connect(`보안요소삭제`,{  
}).then(console.log("데이터베이스 연결 완료"))

//메세지 커맨드 핸들링
const prefix = process.env.prefix

client.commands = new Collection()

const commandsFile = fs.readdirSync('./MessageCommand').filter(file => file.endsWith('.js'))

for(const file of commandsFile){
    const command = require(`./MessageCommand/${file}`)
    client.commands.set(command.name , command)
}

client.on('messageCreate' , message=>{
    if(!message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift()
    const command = client.commands.get(commandName)
    if (!command) return
    try{
        command.execute(message,args)
    } catch (error) {
        console.error(error)
    }
})

//슬래쉬 커맨드 핸들링
client.commands = new Collection();
const commands_json = [];
const commandsCategoryPath = "./commands/slash";
const commandsCategoryFiles = fs.readdirSync(commandsCategoryPath);
for (const category of commandsCategoryFiles) {
  const commandsPath = `./commands/slash/${category}`;
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandsFiles) {
    const command = require(`./commands/slash/${category}/${file}`);
    client.commands.set(command.data.name, command);
    commands_json.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
rest
  .put(Routes.applicationCommands(process.env.ID), { body: commands_json })//테스트용 ID변경
  .then((command) => console.log(`${command.length}개의 커맨드를 푸쉬했습니다`))

//이벤트 핸들링
const eventsPath = "./events";
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = `./${eventsPath}/${file}`;
  const event = require(filePath);
  if (event.once == true) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

//오류무시
const errlogs = client.channels.cache.get(process.env.errLogCh) //로그채널
process.on('uncaughtException', function (err) {
 const date = new Date();
 const date1 = date.getFullYear() + '.' + (date.getMonth()+1) + '.' + date.getDate() + " / " + date.getHours() + '시' + date.getMinutes(); + '분' + date.getSeconds() + '초'
 //errlogs.send(`**신규오류!**\n${err}\n${date1}`)
 console.log("--------error--------" + err + "/" + date1);
});