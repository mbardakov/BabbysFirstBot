import { Client } from 'discord.js'

class Bot {
    static client: Client = new Client();
    static settings = require('../config/settings.json');

    static prefix: string = "!";
    static swear_words: string[] = ["shit", "bitch", "fuck", "cyka", "blyat"];
    // this is probably the last thing I'd want an employer to see

    
    static init = () => {
        Bot.client.on('message', message => {
            // so the bot never responds to itself
            if (message.author.bot){
                return;
            }
            
            // flexible function to see if 'msg' contains 'target';
            // ignores whitespace and capitalization
            let flexContains = (target: string) => {
                return message.content.replace(/\s/g,'').toLowerCase().indexOf(target) >= 0;
            }

            Bot.swear_words.forEach((word)=>{
                if (flexContains(word)){
                    message.reply('You said: "' + word +'". Please do not swear in my server.')
                    return;
                }
            });
            
            // easter eggs
            if (flexContains('bot')){
                message.channel.send('new bot who dis');            
            }

            if (flexContains('omaewamoushinderu')){
                message.channel.send('NANI!?');
            }

            // commands
            if (message.content.charAt(0) === Bot.prefix){
                let name = message.content.split(' ')[0].slice(1);
                let args = message.content.split(' ').slice(1);
                if (name === 'queen'){
                    message.channel.send('https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju');
                }
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