const express = require("express");
const fs = require('fs');
const fileType = require('file-type');
const router = express.Router();
const linebot = require("linebot");
const { botconfig } = require("../config");
const {
  imgSearch,
  ytSearch,
  ytch,
  ytchSearch,
  beautySearch,
  trainSearch,
  myYtch
} = require("../assets/search");
const { ytchSubscription, addYtch } = require("../assets/subscription");
const bot = linebot(botconfig);
const linebotParser = bot.parser();

router.post("/", linebotParser);

bot.on("message", function(event) {
  const {userId} = event.source;
  const {type, text} = event.message
  switch (true) {
    case /^#\s*/.test(text):
      imgSearch(event.message.text, /^#\s*/).then(function(result) {
          event.reply(result);
        }, function(reject) {
          res404(event, reject);
        });
      break;
    case text ==='ytch':
      ytch().then(function(result) {
          event.reply(result);
        }, function(reject) {
          res404(event, reject);
        });
      break;
      case text ==='myytch':
      myYtch(userId).then(function(result) {
          event.reply(result);
        }, function(reject) {
          res404(event, reject);
        });
      break;
      case /^ytcha\s*/.test(text):
      const qmsg = text.replace(/^ytcha\s*/, '').split(' ');
      addYtch(qmsg[0], qmsg[1]).then(function(result) {
          event.reply(result);
        }, function(reject) {
          res404(event, reject);
        });
      break;
    case /^ytch\s*/.test(text):
      ytchSubscription(event.message.text, /^ytch\s*/, event.source.userId).then(function(result) {
          event.reply(result);
        }, function(reject) {
          res404(event, reject);
        });
      break;
    case /^yt\s*/.test(text):
      ytSearch(event.message.text, /^yt\s*/).then(function(result) {
          event.reply(result);
        }, function(reject) {
          res404(event, reject);
        });
      break;
    case /^火車\s*/.test(text):
      trainSearch(event.message.text, /^火車\s*/).then(function(result) {
          event.reply(result);
        }, function(reject) {
          res404(event, reject);
        });
      break;
    case /^呵/.test(text):
      beautySearch(event.message.text, "呵").then(function(result) {
          event.reply(result);
        }, function(reject) {
          console.error(reject.toString());
          res404(event, reject);
        });
      break;
    // case /image/.test(type):
    //   const id = event.message.id;
    //   const stream = bot.getMessageContent(id);
    //   stream.then(chunk => {
    //     const ext = fileType(chunk).ext;
    //     fs.appendFile(`./upload/image/${id}.${ext}`, new Buffer(chunk), function(err) {
    //       if (err) {
    //         res404(event, err);
    //       } else {
    //         event.reply({ type: "text", text: "Gotcha" });
    //       }
    //     });
    //   });
    //   break;
    default:
      // res404(event);
      break;
  }
});

function res404(event, reject) {
  console.error(reject);
  event.reply("看不懂啦~~咚!!");
}

module.exports = router;
