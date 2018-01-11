const request = require("request");
const cheerio = require("cheerio");
const moment = require("moment");
const { spawn } = require('child_process');
const { cseconfig, ytkey } = require("../config");
const { getYtchList, getYtchByUserId } = require("./dbTool");

module.exports.imgSearch = imgSearch;
module.exports.ytSearch = ytSearch;
module.exports.ytch = ytch;
module.exports.ytchSearch = ytchSearch;
module.exports.beautySearch = beautySearch;
module.exports.trainSearch = trainSearch;
module.exports.myYtch = myYtch;



function imgSearch(msg, regex) {
  let qmsg = msg.replace(regex, "");
  qmsg = encodeURIComponent(qmsg);
  const imgsize = "xlarge";
  const num = 10;

  return new Promise(function(resolve, reject) {
    request(
      {
        url: `https://content.googleapis.com/customsearch/v1?cx=${cseconfig.cseid}&searchType=image&imgSize=${imgsize}&num=${num}&q=${qmsg}&key=${cseconfig.apikey}`
      },
      function(error, response, body) {
        try {
          const result = JSON.parse(body);
          let r = result.items.filter(g => /^https:/.test(g.link));
          r = r[Math.round(Math.random() * (r.length - 1))];
          resolve({
            type: "image",
            originalContentUrl: r.link,
            previewImageUrl: r.image.thumbnailLink
          });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

function ytSearch(msg, regex) {
  let qmsg = msg.replace(regex, "");
  qmsg = encodeURIComponent(qmsg);
  const num = 1;
  return new Promise(function(resolve, reject) {
    request(
      {
        url: "https://www.googleapis.com/youtube/v3/search",
        qs: {
          part: "snippet",
          maxResults: 1,
          q: qmsg,
          key: ytkey
        }
      },
      function(error, response, body) {
        try {
          const result = JSON.parse(body);
          resolve({
            type: "text",
            text: `https://www.youtube.com/watch?v=${result.items[0].id
              .videoId}`
          });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

function ytch() {
  return new Promise((resolve, reject) => {
    try {
      getYtchList().then(result => {
          result = result.reduce((a, b) => {
            let msg = `${a}${b.CHANNEL_NAME_ZH}\n`;
            return msg;
          }, '');
          resolve({ type: "text", text: result });
        }, err => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
}

function ytchSearch(msg, regex) {
  let qmsg = msg.replace(regex, "");
  qmsg = encodeURIComponent(qmsg);
  const imgsize = "xlarge";
  const num = 10;
  return new Promise(function(resolve, reject) {
    request(
      {
        url: "https://content.googleapis.com/youtube/v3/activities",
        qs: {
          maxResults: 10,
          channelId: "UCPRWWKG0VkBA0Pqa4Jr5j0Q",
          part: "snippet,contentDetails",
          key: ytkey
        }
      },
      function(error, response, body) {
        try {
          const result = JSON.parse(body);
          const upload = result.items.find(function(ele, index, arr) {
            return ele.contentDetails.upload;
          });
          resolve({
            type: "text",
            text: `https://www.youtube.com/watch?v=${upload.contentDetails
              .upload.videoId}`
          });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

function myYtch(userId) {
  return new Promise(function(resolve, reject) {
    getYtchByUserId(userId).then(r => {
      r = r.reduce((a, b) => {
        let msg = `${a}${b.CHANNEL_NAME_ZH}\n`;
        return msg;
      }, "已訂閱頻道：\n");
      resolve({ type: "text", text: r });
    });
  });
}

function beautySearch(msg, regex) {
  return new Promise((resolve, reject) => {
    try {
      const beauty = spawn("node", ["./assets/beauty.js", msg, regex]);

      beauty.stdout.on("data", data => {
        resolve(JSON.parse(data.toString()))
      });

      beauty.stderr.on("data", err => {
        reject(err)
      });

    } catch (err) {
      reject(err)
    }
  });
}

function trainSearch(msg, regex) {
  return new Promise((resolve, reject) => {
    try {
      const train = spawn("node", ["./assets/train.js", msg]);

      train.stdout.on("data", data => {
        resolve(JSON.parse(data.toString()))
      });

      train.stderr.on("data", err => {
        reject(err)
      });

    } catch (err) {
      reject(err)
    }
  });
}
