const token = "";
//cooldown = {};
const { REST, Routes, Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const commands = [
  {
    name: 'random',
    description: 'Retrieve a random image.',
  },

  {
    name: 'search',
    description: 'Search for an image.',
    options:[{name:"searchvalue",description:"Search..",type:3,required:true},{name:"searchrange",description:"Randomness (default 1000). Lower value = quicker search, higher value = more random.",type:3,required:false}]
  },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(""), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'random') {

    exampleEmbed = {
      color: 0x0099ff,
      title: 'Fetching...',
      timestamp: new Date(),
      footer: {
        text: 'Bot by Cedric#0591',
      },
    };

    await interaction.reply({ embeds: [exampleEmbed] });

    const url = 'https://rule34.xxx/index.php?page=post&s=view&id='+Math.floor(Math.random() * (6646430));

    let found = false;
    while (!found) {
        try {
          const response = await fetch(url);
          const html = await response.text();
          const $ = cheerio.load(html);
          element = $('#' + 'image').attr('src');
          if (element != null) {img = element; found = true;}
        } catch (error) {
          console.error(error);
        }
    }

    /*const myString = "";
    const lastSlashIndex = myString.lastIndexOf("?");
    const result = myString.substring(0, lastSlashIndex);
    console.log(result);*/
    
    exampleEmbed = {
      color: 0x0099ff,
      title: 'Rule34 Random Content:',
      image: {
        url: img,
      },
      timestamp: new Date(),
      footer: {
        text: 'Bot by Cedric#0591',
      },
    };

    await interaction.editReply({ embeds: [exampleEmbed] });
  }

  else if (interaction.commandName === 'search') {

    exampleEmbed = {
      color: 0x0099ff,
      title: 'Fetching...',
      description: 'If an image never show up then try searching differently.',
      timestamp: new Date(),
      footer: {
        text: 'Bot by Cedric#0591',
      },
    };

    await interaction.reply({ embeds: [exampleEmbed] });

    searchingRange = Math.floor(Math.random()*1000);
    try {
      if (interaction.options.get('searchrange').value != null) {
      searchingRange = parseInt(interaction.options.get('searchrange').value);
    }} catch(error) {};
    let found = false;
    while (!found) {
        try {
          var url = 'https://rule34.xxx/index.php?page=post&s=list&tags='+interaction.options.get('searchvalue').value.replaceAll(" ", "_")+'&pid='+searchingRange;
          const response = await fetch(url);
          const html = await response.text();
          const $ = cheerio.load(html);
          const numElements = $('.' + 'preview').length;
          element = $('.' + 'preview').eq(Math.floor(Math.random() * numElements)+1).parent().attr('href');
          if (element != null) {img = "https://rule34.xxx/"+element; found = true;}
        } catch (error) {
          console.error(error);
        }
    }

    url = img;
        try {
          response = await fetch(url);
          html = await response.text();
          $ = cheerio.load(html);
          element = $('#' + 'image').attr('src');
          img = element;
        } catch (error) {
          console.error(error);
        }

    /*const myString = "";
    const lastSlashIndex = myString.lastIndexOf("?");
    const result = myString.substring(0, lastSlashIndex);
    console.log(result);*/

    exampleEmbed = {
      color: 0x0099ff,
      title: 'Rule34 Random Content:',
      image: {
        url: img,
      },
      timestamp: new Date(),
      footer: {
        text: 'Bot by Cedric#0591',
      },
    };

    await interaction.editReply({ embeds: [exampleEmbed] });

  }

});client.login(token);
