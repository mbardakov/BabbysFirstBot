// import { ZipCodeValidator } from "./ZipCodeValidator";

// let myValidator = new ZipCodeValidator();
import { Client } from 'discord.js'
class Bot {
    // private Discord = require('discord.js');
    // let Discord = new Discord();
    private client: Client = new /*this.Discord.*/Client();
    private settings = require('../config/settings.json');

    private prefix: string = "!";
    private swear_words: string[] = ["shit", "bitch", "fuck"]; // this is probably the last thing I'd want an employer to see

    // don't like doing everything in the ctor...
    constructor(){
        this.client.on('message', message => {
            // so the bot never responds to itself
            if (message.author.bot){
                return;
            }

            this.swear_words.forEach((word)=>{
                if (message.content.indexOf('bot') >= 0){
                    message.reply('You said: "' + word +'". Please do not swear in my server.')
                    return;
                }
            });
            
            if (message.content.indexOf('bot') >= 0){
                message.channel.send('new bot who dis');            
            }

            // individual commands (!foo)
            if (message.content.indexOf(this.prefix + 'queen') === 0) { // same as "startsWith"
                message.channel.send('https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju');
            }
            
        });

        this.client.on('ready', () => { 
            console.log('Bot online, waiting for input...');
        });

        this.client.login(this.settings.token);
    }
}

new Bot();

// TODO: some modularity? enable/disable listeners (or just make separate bots)