import { Client } from 'discord.js'

class Bot {
    static client: Client = new Client();
    static settings = require('../config/settings.json');

    static prefix: string = "!";
    static swear_words: string[] = ["shit", "bitch", "fuck"]; 
    // this is probably the last thing I'd want an employer to see
    static init = () => {
        Bot.client.on('message', message => {
            // so the bot never responds to itself
            if (message.author.bot){
                return;
            }

            Bot.swear_words.forEach((word)=>{
                if (message.content.toLowerCase().indexOf(word) >= 0){
                    message.reply('You said: "' + word +'". Please do not swear in my server.')
                    return;
                }
            });
            
            if (message.content.toLowerCase().indexOf('bot') >= 0){
                message.channel.send('new bot who dis');            
            }

            // individual commands (!foo)
            if (message.content.toLowerCase().indexOf(Bot.prefix + 'queen') === 0) { // same as "startsWith"
                message.channel.send('https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju');
            }
            
        });

        Bot.client.on('ready', () => { 
            console.log('Bot online, waiting for input...');
        });

        Bot.client.login(Bot.settings.token);
    }
}

Bot.init();
// TODO: some modularity? enable/disable listeners (or just make separate bots)