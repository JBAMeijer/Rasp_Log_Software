const mqtt = require('mqtt');
const fs = require('fs');
var LogFile = require('./LogFile.json');
const client = mqtt.connect('mqtt://192.168.68.30');

const MainTopic = 'PlantWaterer/';

var collection = {};

console.log(LogFile);

setInterval(() => {

}, 1800000)


client.on('connect', () => {
    console.log("Connected");
    console.log("Subscribing to topics!");

    for(var attribute in LogFile)
    {
        let topic = MainTopic + attribute;
        collection[attribute] = 0;

        setInterval((attribute) => {            
            if(collection[attribute] !== 0)
                LogFile[attribute].push(collection[attribute]);
            
            fs.writeFile('./LogFile.json', JSON.stringify(LogFile, null, 4), err => {
                if(err) throw err;
            });
        }, 1800000, attribute)

        client.subscribe(topic, (err) => {
            if(!err) {
                
                console.log("subscribed to:", topic);
            }
            else {
                console.log("Couldn't subscribe to:", topic);
            }
        });
    }
});

client.on('message', (topic, message) => {
    
    let subtopic = topic.replace(MainTopic, '');
    
    let date_ob = new Date();
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    
    let timestamp = "[" + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + "]";
    
    console.log(timestamp, "Message from topic:", topic);
    console.log("Value from topic:", message.toString());
    console.log();

    let LogObj = {
        "Timestamp": timestamp,
        "Value": message.toString()
    }
    
    collection[subtopic] = LogObj;
});