import { Client } from 'discord.js'
import { Util } from './util.js'
import * as SpotifyWebApi from 'spotify-web-api-node'

class Bot {
    static client: Client = new Client();
    static settings = require('../config/settings.json');
    static spotify = new SpotifyWebApi({clientId: Bot.settings.clientId, clientSecret: Bot.settings.clientSecret, redirectUri: Bot.settings.redirectUri});

    static prefix: string = "!";
    static swear_words: string[] = ['shit', 'bitch', 'fuck', 'cyka', 'blyat'];
    static responses: string[] = ['new bot who dis', "don't @ me"]
    static access_token = '';
    // this is probably the last thing I'd want an employer to see

    static authorize = () => {
        var scopes = ['playlist-read-collaborative', 'playlist-modify-public'],
        clientId = Bot.settings.clientId,
        state = 'init';

        // Create the authorization URL
        var authorizeURL = Bot.spotify.createAuthorizeURL(scopes, state);
        // TODO: have to go to this URL, accept, then have it redirect to some listener
        console.log(authorizeURL);
    }

    static reset = () => {
        console.log('Bot online, waiting for input...');

        // given that tokens don't last very long, it may make sense to get one per request? or based on a timer?
        Bot.spotify.clientCredentialsGrant().then((res)=>{
            // console.log('client credentials granted: ', res);
            Bot.spotify.setAccessToken(res.body.access_token);
        }, (err) => {
            console.log('authentication went wrong: ', err);
        });
        Bot.client.user.setActivity('with your heart. <3', {"type":"PLAYING"}).catch(err => {console.log('could not set bot activity: ', err)});
    }

    static go = () => {
        Bot.client.login(Bot.settings.token);

        Bot.client.on('ready', () => { 
            Bot.reset();
        });

        Bot.client.on('message', message => {
            // so the bot never responds to itself
            if (message.author.bot){
                return;
            }

            // setting this as the highest priority (and returning when it's done) prevents users from putting swear words in their commands
            let swears_detected = [];
            Bot.swear_words.forEach((word)=>{
                if (Util.flexContains(message.content, word)){
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
                let args = Util.scanArgs(message.content);

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
                    case 'playlist':
                        // TODO: factor this out nicely into a separate module?
                        // don't like lumping everything together like this

                        // no args: just display playlist
                        if (args.length === 0){
                            Bot.spotify.getPlaylist('enigmers', '0NtXcfsedFjAwA66LpKstp').then((res)=>{
                                message.channel.send(res.body.external_urls.spotify);
                            });
                        // add a list of songs to the playlist
                        } else if (args.length >= 2 && args[0] === 'add'){
                            let parsed = Util.parseSong(args[1]);
                            let songs = args.slice(1).map((link)=>{Util.parseSong(link)});
                            return Bot.spotify.addTracksToPlaylist('enigmers', '0NtXcfsedFjAwA66LpKstp', songs);
                            // this currently rejects with a WebApierror: forbidden
                        }
                        // spotify:user:enigmers:playlist:0NtXcfsedFjAwA66LpKstp
                    case 'reset':
                        Bot.reset();
                        break;
                    case 'auth':
                        Bot.authorize();
                        break;
                    default:
                        message.reply("unknown command: " + name + ", with aruments: "+ args.join());
                }
                return;
            }

            // add more sass here
            if (message.isMentioned(Bot.client.user)){
                message.reply(Bot.responses[Math.floor(Math.random()*Bot.responses.length)]);
            }

            // easter eggs
            if (Util.flexContains(message.content, 'ur mum gay')){
                message.channel.send('no u');
            }
            if (Util.flexContains(message.content, 'omae wa mou shinderu')){
                message.channel.send('NANI!?');
            }

        });
    }
}

Bot.go();
// TODO: some modularity? enable/disable listeners (or just make separate bots)