const Discord = require("discord.js");

const intents = new Discord.Intents(32767);

const client = new Discord.Client({ intents });

let { config } = require("dotenv")

config();

const Distube = require("distube")

client.distube = new Distube.default(client)

const fs = require("fs");

const { token } = require("./config");

const { DiscordTogether } = require('discord-together');

client.discordTogether = new DiscordTogether(client)

console.log(" ");
fs.readdirSync("./events").forEach(async (categorys) => {
  const eventFiles = fs
    .readdirSync(`./events/${categorys}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of eventFiles) {
    const event = require(`./events/${categorys}/${file}`);
    client.on(event.name, (...args) => event.execute(client, ...args));
    console.log(`Cargando eventos ${categorys} --- ${file}`)
  }
});
console.log(" ");

for(const file of fs.readdirSync("./eventsDistub")){
  const eventsDistu = require(`./eventsDistub/${file}`)
  client.distube.on(eventsDistu.name, (...args) => eventsDistu.execute(client, ...args))
  console.log(`Cargando eventos de distube ${file}`)

}

console.log(" ")

client.slashCommands = new Discord.Collection();

fs.readdirSync("./Slash").forEach(async (categorys) => {
  const slashCommands = fs
    .readdirSync(`./Slash/${categorys}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of slashCommands) {
    const slash = require(`./Slash/${categorys}/${file}`);
    console.log(`Cargendo Slashs ${categorys} --- ${file}`);
    client.slashCommands.set(slash.data.name, slash);
  }
});

process.on("unhandledRejection", (e) => {
  console.log(e);
});

client.on("shardError", (e) => {
  console.log(e);
});

require("./Handlers/MongoDB");

console.log(" ");

client.login(process.env.token);