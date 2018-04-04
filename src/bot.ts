import { Client } from 'discord.js'

class Bot {
    static client: Client = new Client();
    static settings = require('../config/settings.json');

    static prefix: string = "!";
    static swear_words: string[] = ["shit", "bitch", "fuck", "cyka", "blyat"];
    // this is probably the last thing I'd want an employer to see

    static reset = () => {
        console.log('Bot online, waiting for input...');
        Bot.client.user.setActivity('with your heart. <3', {"type":"PLAYING"}).catch(err => {console.log('could not set bot activity: ', err)});
    }

    static go = () => {
        Bot.client.login(Bot.settings.token);

        Bot.client.on('ready', () => { 
            Bot.reset();
        });

        Bot.client.on('message', message => {
            // helper functions:
            // I don't like how these are hard-coded to use message.content, given that they're simple string manipulations.
            // might make more sense to put them in another library, and possibly wrap them

            // flexible function to see if 'msg' contains 'target';
            // ignores whitespace and capitalization
            let flexContains = (target: string) => {
                return message.content.replace(/\s/g,'').toLowerCase().indexOf(target.replace(/\s/g,'')) >= 0;
            }

            let scanArgs = () => {
                // https://stackoverflow.com/questions/23582276/split-string-by-comma-but-ignore-commas-inside-quotes/23582323
                let res = message.content.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/);
                return res.map(word=>word.replace(/"/g,'')).slice(1); // first thing is still the name
            }

            // actual code:
            // so the bot never responds to itself
            if (message.author.bot){
                return;
            }

            // setting this as the highest priority (and returning when it's done) prevents users from putting swear words in their commands
            let swears_detected = [];
            Bot.swear_words.forEach((word)=>{
                if (flexContains(word)){
                    swears_detected.push(word);
                }
            });
            if (swears_detected.length > 0){
                message.reply('You said: ' + swears_detected.join(', ') + '. please do not swear in my server.');
                return;
            }
            
            // commands
            if (message.content.charAt(0) === Bot.prefix){
                let name = message.content.split(' ')[0].slice(1);
                // let args = message.content.split(' ').slice(1);
                let args = scanArgs();

                switch (name){
                    case 'queen':
                        message.channel.send('https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju');
                        break;
                    case 'game':
                        console.log("setting game to: " + args[0]);
                        Bot.client.user.setActivity(args[0], {type: "PLAYING"}).catch((err) => {
                            message.channel.send("something went wrong: ", err);
                        });
                        break;
                    case 'reset':
                        Bot.reset();
                        break;
                    default:
                        message.reply("unknown command: " + name + ", with aruments: "+ args.join());
                }
                return;
            }

            // easter eggs
            if (flexContains('bot')){
                message.channel.send('new bot who dis');            
            }
            if (flexContains('ur mum gay')){
                message.channel.send('no u');
            }
            if (flexContains('omae wa mou shinderu')){
                message.channel.send('NANI!?');
            }
        });
    }
}

Bot.go();
// TODO: some modularity? enable/disable listeners (or just make separate bots)