"use scrict";

require("dotenv").config();
const { app,BrowserWindow,ipcMain } = require("electron");
const path = require('path');
let Twitter = require("twitter");
let mWindow;

let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let params = {
  screen_name: "crawler"
};

const createWindow = () => {
    mWindow = new BrowserWindow({
        width: 640,
        height: 480,
        show: true,
        frame: true,
        fullscreenable: false,
        resizable: false,
        transparent: false,
        webPreferences: {
            backgroundThrottling: false
        }
    });
    mWindow.openDevTools();
    mWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`);
 
};


app.on('ready', () => {
    createWindow();
});

ipcMain.on('tweets', (event) => {
    getTweetsBySearch('Transmilenio',(e)=>{
        event.returnValue = e;
    });
});

let getTweetsByStream = () => {
  let stream = client.stream("statuses/filter", { track: "Transmilenio" });
  stream.on("data", function(event) {
    console.dir(event.created_at);
    console.dir(event.text);
    if (event.geo) {
      console.dir(event.geo);
      console.dir(event.coordinates);
      console.dir(event.place);
    }
  });
  stream.on("error", function(error) {
    console.log(error);
  });
};

let getTweetsBySearch = (query,callback) => { 
  client.get("search/tweets.json", { q: query,result_type: "recent",count:100 }, function(error,tweets,response) {
    callback(tweets);
  }); 
};

// getTweetsByStream();
