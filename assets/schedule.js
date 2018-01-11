const schedule = require("node-schedule");
const {joeman, top10, howfun, LatestVideo} = require("../routes/multicast");

// joeman();
// top10();
// howfun();
LatestVideo();
setInterval(()=>{
    // joeman();
    // top10();
    // howfun();
    LatestVideo();
}, 60*60*1000)
// var j = schedule.scheduleJob("30 * * * * *", function() {
//   top10();
// });
