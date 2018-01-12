const mysql = require("mysql");
const { mysqlConfig } = require("../config");
const conn = mysql.createConnection(mysqlConfig);

module.exports.getYtchList = getYtchList;
module.exports.subscripeYtch = subscripeYtch;
module.exports.getYtchSubscription = getYtchSubscription;
module.exports.poYtch = poYtch;
module.exports.getYtch = getYtch;
module.exports.getYtchByUserId = getYtchByUserId;
module.exports.getNBATop10U = getNBATop10U;

function getYtchList() {
  return new Promise((resolve, reject) => {
    conn.query("SELECT CHANNEL_NAME_ZH FROM ytChannel ORDER BY CHANNEL_NAME_ZH", (err, results) => {
      if (err) reject(err);
      resolve(results)
    });
  });
}

function subscripeYtch(ytch_zh, userId) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO ytSubscription (USER_ID, CHANNEL_ID, CHANNEL_NAME_ZH) 
                  SELECT * FROM (SELECT '${userId}' AS USER_ID, ytChannel.CHANNEL_ID, CHANNEL_NAME_ZH FROM ytChannel WHERE CHANNEL_NAME_ZH = '${ytch_zh}') AS A
                  WHERE NOT EXISTS (SELECT ID FROM ytSubscription WHERE USER_ID = '${userId}' AND CHANNEL_NAME_ZH = '${ytch_zh}')`;

    conn.query(query, (err, results) => {
      if (err) reject({
        type:"text",
        text: "訂閱失敗...(~_~;)"
      });
      if(results.affectedRows === 1){
        resolve({
          type:"text",
          text: "訂閱OK的唷~o(^▽^)o"
        })
      }else{
        resolve({
          type:"text",
          text: "已經訂閱囉 ( ´▽｀)"
        })
      }
    });
  });
}

function getYtchSubscription() {
  return new Promise((resolve, reject) => {
    const query = `SELECT USER_ID, CHANNEL_ID FROM ytSubscription;`;
    conn.query(query, (err, results) => {
      if (err) reject(err);
      let obj = {};
      results.forEach(g => {
        if(!obj[g.CHANNEL_ID]){
          obj[g.CHANNEL_ID] = [g.USER_ID]
        }else{
          obj[g.CHANNEL_ID].push(g.USER_ID)
        }
      });
      resolve(obj);
    });
  });
}

function poYtch(id, name, zh) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO ytChannel (CHANNEL_ID, CHANNEL_NAME, CHANNEL_NAME_ZH)
                  SELECT * FROM (SELECT '${id}' AS CHANNEL_ID, '${name}' AS CHANNEL_NAME, '${zh}' AS CHANNEL_NAME_ZH) AS tmp
                  WHERE NOT EXISTS
                  (SELECT ID FROM ytChannel WHERE CHANNEL_ID = '${id}' AND CHANNEL_NAME = '${name}');`;
    conn.query(query, (err, results) => {
      if (err) reject(err);
      results.id = id
      resolve(results);
    });
  });
}

function getYtchByUserId(id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT CHANNEL_NAME_ZH FROM ytSubscription WHERE USER_ID = '${id}'`;
    conn.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}

function getYtch(id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT CHANNEL_ID, CHANNEL_NAME, CHANNEL_NAME_ZH FROM ytChannel WHERE CHANNEL_ID = '${id}'`;
    conn.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}

function getNBATop10U() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT USER_ID FROM nbaTop10';
    conn.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}