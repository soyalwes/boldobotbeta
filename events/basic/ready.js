const Discord = require("discord.js");
const fetch = require("node-superfetch");

module.exports = {
  name: "ready",
  execute(client) {
    console.log(`Logeado en ${client.user.username} + ${process.version}`);

    setInterval(async function () {
  
      let userTwitch = `YoSoyAlwes`;

      const uptime = await fetch.get(
        `https://decapi.me/twitch/uptime/${userTwitch}`
      );
      const avatar = await fetch.get(
        `https://decapi.me/twitch/avatar/${userTwitch}`
      );
      const title = await fetch.get(
        `https://decapi.me/twitch/title/${userTwitch}`
      );
      const game = await fetch.get(
        `https://decapi.me/twitch/game/${userTwitch}`
      );
      const viewers = await fetch.get(
        `https://decapi.me/twitch/viewercount/${userTwitch}`
      );

      const twitchSchema = require("../../schema/twitch-schema");

      let datos = await twitchSchema.findOne({
        user: userTwitch,
        title: title.body,
      });


      if(uptime.body !== `${userTwitch} is offline`){

      const streamEmebed = new Discord.MessageEmbed()
        .setAuthor({ name: `${userTwitch}`, iconURL: `${avatar.body}` })
        .setTitle(`${title.body}`)
        .setThumbnail(`${avatar.body}`)
        .setURL(`https://twitch.tv/${userTwitch}`)
        .addField("Juego", `${game.body}`, true)
        .addField("Viewers", `${viewers.body}`, true)
        .setImage(
          `https://static-cdn.jtvnw.net/previews-ttv/live_user_${userTwitch}-620x378.jpg`
        )
        .setColor("RANDOM");

        if (!datos) {
          const newDatos = new twitchSchema({
            user: userTwitch,
            title: `${title.body}`,
          });

          await client.channels.cache
            .get(`925925137533005884`)
            .send({
              content: `Vayan a verlo \n**https://www.twitch.tv/${userTwitch}**`,
              embeds:[streamEmebed]
            });

          return await newDatos.save();
        }

      if (datos.title === `${title.body}`) return;

      await twitchSchema.findOneAndUpdate(
        { user: userTwitch },
        { title: title.body }
      );
      }
    }, 10000)

    let activitiesarray = [
      {
        name: "Mas codigos",
        type: "STREAMING",
        URL: "https://twitch.tv/yosoyalwes",
      },
      {
        name: `${client.guilds.cache.size} servers`,
        type: "PLAYING",
      },
      {
        name: "Por la verificacion",
        type: "COMPETING",
      },
      {
        name: "Slash commands",
        type: "WATCHING",
      },
      {
        name: "/botinfo",
        type: "PLAYING",
      },
      {
        name: "Visita nuestro suport",
        type: "WATCHING",
      },
      {
        name: "Boldo beta 0.0.1",
        type: "PLAYING"
      }
    ];

    const activitirandom =
      activitiesarray[Math.floor(Math.random() * activitiesarray.length)];

    setInterval(() => {
      function presence() {
        client.user.setPresence({
          activities: [activitirandom],
          status: "online",
        });
      }
      presence();
    }, 30000);
  },
};