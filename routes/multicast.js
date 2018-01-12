const linebot = require("linebot");
const request = require("request");
const moment = require("moment");
const { botconfig, ytkey } = require("../config");
const { getYtchSubscription } = require("../assets/dbTool");

const bot = linebot(botconfig);

module.exports.LatestVideo = LatestVideo;
module.exports.top10 = top10;

function top10(timeLag) {
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
        const now = moment();
        const upload = result.items.find(function(g) {
          const publishAt = moment(g.snippet.publishedAt);
          return (
            /Top\s\d+\sPlays/.test(g.snippet.title) &&
            now.diff(publishAt, "seconds") < timeLag
          );
          // return g.contentDetails.upload && now.diff(publishAt, "seconds") < timeLag
        });
        if (!upload) {
          return;
        }
        bot.multicast(
          ["U664b2ed942423006a6935237e790b641", "U7083fbe43e5df686e6d349bdf80f4616", "U10f7463f4cbe51e288ed2ad2889884b6"],
          [
            {
              type: "text",
              text: `${upload.snippet
                .title}\nhttps://www.youtube.com/watch?v=${upload.contentDetails
                .upload.videoId}`
            },
            {
              type: "template",
              altText: "o(^▽^)o",
              template: {
                type: "carousel",
                columns: [
                  {
                    thumbnailImageUrl: upload.snippet.thumbnails.medium.url,
                    imageBackgroundColor: "#FFFFFF",
                    text: upload.snippet.title.slice(0, 40),
                    actions: [
                      {
                        type: "uri",
                        label: "前往",
                        uri: `https://www.youtube.com/watch?v=${upload
                          .contentDetails.upload.videoId}`
                      }
                    ],
                    imageAspectRatio: "rectangle",
                    imageSize: "cover"
                  }
                ]
              }
            }
          ]
        );
      } catch (err) {
        console.error(err);
      }
    }
  );
}

function LatestVideo(timeLag) {
  getYtchSubscription()
    .then(result => {
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    })
    .then(r => {
      for (let o in r) {
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
                now.diff(publishAt, "seconds") < timeLag
              );
            });
            if (upload.length == 0) {
              return;
            }
            upload = upload.slice(0, 4);

            const txt = upload.reduce((a, b) => {
              return `${a}${b.snippet
                .title}\nhttps://www.youtube.com/watch?v=${b.contentDetails
                .upload.videoId}\n`;
            }, `${upload[0].snippet.channelTitle}\n`);

            const carousel = upload.map(g => {
              return {
                thumbnailImageUrl: g.snippet.thumbnails.high.url,
                imageBackgroundColor: "#FFFFFF",
                text: g.snippet.title.slice(0, 40),
                actions: [
                  {
                    type: "uri",
                    label: "前往",
                    uri: `https://www.youtube.com/watch?v=${g.contentDetails
                      .upload.videoId}`
                  }
                ]
              };
            });

            bot.multicast(r[o], [
              { type: "text", text: txt },
              {
                type: "template",
                altText: "o(^▽^)o",
                template: {
                  type: "carousel",
                  columns: carousel,
                  imageAspectRatio: "rectangle",
                  imageSize: "cover"
                }
              }
            ]);
          }
        );
      }
    });
}
