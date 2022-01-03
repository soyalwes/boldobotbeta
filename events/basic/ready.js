const Discord = require("discord.js");

module.exports = {
	name: 'ready',
	execute (client) {
    console.log(`Logeado en ${client.user.username} + ${process.version}`);

    client.user.setPresence({
      activities: [
        {
          name: "Renvoandome",
          type: "PLAYING",
        },
      ],
      status: "online",
    });

  }
}
