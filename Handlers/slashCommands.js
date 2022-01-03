const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const slashCommands = [];
const fs = require("fs");
let { config } = require("dotenv")

config();

fs.readdirSync("./Slash").forEach(async(categorys) => {
  const slashCommandsFiles = fs.readdirSync(`./Slash/${categorys}`).filter(file => file.endsWith(".js"))
  for(const file of slashCommandsFiles){
    const slash = require(`../Slash/${categorys}/${file}`)
    slashCommands.push(slash.data.toJSON())
  }
})

const rest = new REST({ version: "9" }).setToken(process.env.token)

createSlash()

async function createSlash(){
    try{
        await rest.put(
            Routes.applicationCommands(process.env.clientId), {
                body: slashCommands
            }
        )
        console.log(`Cargando Slash`)
    } catch (e) {
        console.log(e)
    }
}