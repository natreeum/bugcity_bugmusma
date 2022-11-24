const got = require('got');
const { api, bugcity, storageName } = require('../config');
const { log } = require('../utils/webhook');

const option = {
  prefixUrl: `${api}/v2`,
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Token': bugcity,
  },
};

const apiUrl = got.extend(option);

class BankManager {
  async depositBTC(user, amount) {
    if (!user || !amount) return;
    let depositRes;
    let depositResBody;
    try {
      //code here
      const body = {
        userId: user,
        point: amount,
        memo: 'sport_club deposit',
      };

      depositRes = await apiUrl.post(`storages/${storageName}/deposit`, {
        json: body,
      });
      depositResBody = JSON.parse(depositRes.body);
      log(
        `[SPORT_CLUB Deposit Success] <@${depositResBody.userId}> Deposit ${depositResBody.point.added} BTC`
      );
    } catch (e) {
      console.error(e);
      log(
        `[SPORT_CLUB Deposit Failed] <@${depositResBody.userId}> Deposit ${depositResBody.point.added} BTC`
      );
    }
  }
  async withdrawBTC(user, amount) {
    if (!user || !amount) return;
    let withdrawRes;
    let withdrawResBody;
    try {
      //code here
      const body = {
        userId: user,
        point: amount,
        memo: 'sport_club deposit',
      };

      withdrawRes = await apiUrl.post(`storages/${storageName}/withdraw`, {
        json: body,
      });
      withdrawResBody = JSON.parse(withdrawRes.body);
      log(
        `[SPORT_CLUB Withdraw Success] <@${withdrawResBody.userId}> Withdraw ${withdrawResBody.point.added} BTC`
      );
    } catch (e) {
      console.error(e);
      log(
        `[SPORT_CLUB Withdraw failed] <@${withdrawResBody.userId}> Withdraw ${withdrawResBody.point.added} BTC`
      );
    }
  }
  async getBTC(user) {}
}

module.exports = BankManager;
