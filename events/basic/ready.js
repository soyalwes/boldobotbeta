const Discord = require("discord.js");

module.exports = {
  name: "ready",
  execute(client) {
    console.log(`Logeado en ${client.user.username} + ${process.version}`);

    let activitiesarray = [
      {
        name: "Hosteado",
        type: "WATCHING",
      },
      {
        name: `${client.guilds.cache.size} servers`,
        type: "WATCHING",
      },
      {
        name: "Por la verificacion",
        type: "COMPETING",
      },
    ];

    let activiti =
      activitiesarray[Math.floor(Math.random() * activitiesarray.length)];

    setInterval(() => {
      function presence() {
        client.user.setPresence({
          activities: [activiti],
          status: "online",
        });
      }
      presence();
    }, 120000);
  },
};
