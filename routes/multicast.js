const linebot = require("linebot");
const request = require("request");
const moment = require("moment");
const { botconfig, ytkey } = require("../config");
const {getYtchSubscription} = require("../assets/dbTool");

const bot = linebot(botconfig);

module.exports.LatestVideo = LatestVideo;

module.exports.joeman = function() {
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
        const publishAt = moment(upload.snippet.publishedAt);
        const now = moment();
        if (now.diff(publishAt, "seconds") > 3600) {
          return;
        }

        bot.multicast(["U664b2ed942423006a6935237e790b641"], {
          type: "text",
          text: `https://www.youtube.com/watch?v=${upload.contentDetails.upload
            .videoId}`
        });
      } catch (err) {
        console.error(err);
      }
    }
  );
};

module.exports.top10 = function() {
  request(
    {
      url: "https://content.googleapis.com/youtube/v3/activities",
      qs: {
        maxResults: 10,
        channelId: "UCiIfXQzQUTQtHSgb4ce247g",
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
        const publishAt = moment(upload.snippet.publishedAt);
        const now = moment();
        if (now.diff(publishAt, "seconds") > 3600) {
          return;
        }

        bot.multicast(["U664b2ed942423006a6935237e790b641"], {
          type: "text",
          text: `https://www.youtube.com/watch?v=${upload.contentDetails.upload
            .videoId}`
        });
      } catch (err) {
        console.error(err);
      }
    }
  );
};

module.exports.howfun = function() {
  request(
    {
      url: "https://content.googleapis.com/youtube/v3/activities",
      qs: {
        maxResults: 10,
        channelId: "UCxUzQ3wu0oJP_8YLWt71WgQ",
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
        const publishAt = moment(upload.snippet.publishedAt);
        const now = moment();
        if (now.diff(publishAt, "seconds") > 3600) {
          return;
        }

        bot.multicast(
          [
            "U664b2ed942423006a6935237e790b641",
            "U0ec7ca60cc81417b9b34dd7a5f91a2ec"
          ],
          {
            type: "text",
            text: `https://www.youtube.com/watch?v=${upload.contentDetails
              .upload.videoId}`
          }
        );
        bot.push("C7d0ece56cc63402ca01b3c98942ca882", {
          type: "text",
          text: `https://www.youtube.com/watch?v=${upload.contentDetails.upload
            .videoId}`
        });
          bot.push("C28ae0a1edad0bdc82a5a9d02fbe426ef", {
          type: "text",
          text: `https://www.youtube.com/watch?v=${upload.contentDetails.upload
            .videoId}`
        });
          
      } catch (err) {
        console.error(err);
      }
    }
  );
};

function LatestVideo() {
  getYtchSubscription().then(result=>{
    return new Promise((resolve, reject)=>{
      resolve(result)
    })
  }).then(r=>{
    for(let o in r){
      request(
        {
          url: "https://content.googleapis.com/youtube/v3/activities",
          qs: {
            maxResults: 10,
            channelId: o,
            part: "snippet,contentDetails",
            key: ytkey
          }
        },
        function(error, response, body) {
          const result = JSON.parse(body);
          const now = moment();
          let upload = result.items.filter(function(g) {
            const publishAt = moment(g.snippet.publishedAt);
            return (
              g.snippet.type == "upload" &&
              now.diff(publishAt, "seconds") < 3600
            );
          });

          upload = upload.map(g => {
            return {
              type: "text",
              text: `https://www.youtube.com/watch?v=${g.contentDetails
                .upload.videoId}`
            };
          });

          bot.multicast(r[o], upload);
        }
      );
    }
  })
};