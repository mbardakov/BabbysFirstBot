const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('../config/settings.json');

client.on('ready', () => { 
    console.log('Hello World!');
});

var prefix = "!";
var swear_words = ["shit", "bitch", "fuck"]; // this is probably the last thing I'd want an employer to see
client.on('message', message =>  {
    // so the bot never responds to itself
    if (message.author === client.user){
        return;
    }
    swear_words.forEach((word)=>{
        if (message.content.includes(word)){
            message.reply('You said: "' + word +'". Please do not swear in my server.')
            return;
        }
    });
    if (message.content.includes('bot')){
        message.channel.send('new bot who dis');
    }
})

client.login(settings.token);