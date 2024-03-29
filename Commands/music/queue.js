const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const ytdl = require('ytdl-core');

var queueText = [];

function checkTitle(links) {
    links.forEach(element => {
        ytdl.getBasicInfo(element, (err, info) => {
            queueText.push(info.title)
        });
    });
}

module.exports = class Queue extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            aliases: ['queue'],
            group: 'music',
            memberName: 'queue',
            description: 'Listet alle Lieder auf, die sich momentan in der Queue befinden',
            guildOnly: true,
        });
    }

    run(msg) {
        var server = servers[msg.guild.id];

        // Überprüft, ob sich der Bot in einem VoiceChannel befindet
        if(msg.guild.voiceConnection){
            if(!server.queue[0]) {
                msg.reply('Es befinden sich momentan keine Lieder in der Queue.')
            }
            else {
                try {
                    // Für jeden Link in der Queue den Titel abfragen
                    // Rückwärts, da die Queue sonst verkehrt ausgegeben wird
                    server.queue.slice().reverse().forEach(element => {
                        ytdl.getBasicInfo(element, (err, info) => {
                            queueText.push(info.title);
                        });
                    });

                    // Eine Sekunde warten, bevor der Text ausgegeben wird
                    // YouTube-Abfragen benötigen eine gewisse Zeit, um Informationen bereitstellen zu können
                    setTimeout(() => {
                        var embedText = queueText.join('\n')

                        const embed = new Discord.RichEmbed()
                            .setColor(color)
                            .addField('Queue', embedText)

                        msg.channel.send(embed);

                        // Array zurücksetzen
                        queueText.length = 0;
                    }, 1000);
                } catch {
                    msg.reply('Ich kann den Titel von einem Link in dieser Liste nicht abfragen.\nScheinbar ist er nicht gültig.');
                }
                
            }
        }
        else msg.reply('Ich befinde mich momentan nicht in einem VoiceChannel.')
    }
}
