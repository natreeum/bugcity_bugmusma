const util = require("node:util");
const BankManager = require(`../bank/BankManager`);
const bankManager = new BankManager();
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=conditions-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
let canRegisterPlayer = true;
let canBuyTicket = false;

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=data-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
let totalBetAmount = 0;
const FEE_PERCENT = 10;
let totalBetAmountAfterFee = 0;
function calcFee(totalBet) {
  return (totalBetAmount * (100 - FEE_PERCENT)) / 100;
}

//ticketBuyers = [{
//   [interaction.user.id]: {
//     [playerId]: betAmount,
//   },
// }]
let ticketBuyers = [];

//players = [{playerid : player.id, amount : 0}]
let players = [];
let mulRate = [];
const admin = {
  나트리움: "251349298300715008",
  목조: "901812980944097300",
};

async function resetData() {
  players = [];
  canRegisterPlayer = true;
  canBuyTicket = false;
  totalBetAmount = 0;
  ticketBuyers = [];
  mulRate = [];
}

/////////--------==-=-=-=-=-=-=-=-=-=-=-=-=-=-=function=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
async function musmaGame(interaction) {
  //선수등록
  if (interaction.options.getSubcommand() === "선수등록") {
    //check ifAdmin
    if (!Object.values(admin).includes(interaction.user.id)) {
      await interaction.reply({
        content: `명령어를 사용할 권한이 없습니다.`,
        ephemeral: true,
      });
      return;
    }
    if (canRegisterPlayer) {
      let playersMsg = "버그머스마 선수 등록이 완료되었습니다.\n\n";
      for (let i = 1; i <= 8; i++) {
        let tmpPlayer = interaction.options.getUser(`no${i}`);
        if (tmpPlayer) {
          let tmp = {};
          tmp[tmpPlayer.id] = 0;
          players.push(tmp);
          playersMsg += `\`${i}번 선수\` : <@${tmpPlayer.id}>\n`;
        } else break;
      }
      await interaction.reply({ content: playersMsg, ephemeral: true });
      canRegisterPlayer = false;
    } else {
      await interaction.reply({
        content: `이미 등록된 선수명단이 있습니다.\n수정을 하시려면 \`/bugmusma reset_game\` 명령어 입력 후 선수를 재 등록해주시기 바랍니다.`,
        ephemeral: true,
      });
    }
  }

  //게임데이터 초기화
  else if (interaction.options.getSubcommand() === "리셋") {
    //check ifAdmin
    if (!Object.values(admin).includes(interaction.user.id)) {
      await interaction.reply({
        content: `명령어를 사용할 권한이 없습니다.`,
        ephemeral: true,
      });
      return;
    }
    await resetData();
    await interaction.reply({
      content: `게임데이터가 리셋되었습니다.`,
      ephemeral: true,
    });
  }

  //선수명단 조회
  else if (interaction.options.getSubcommand() === "선수명단") {
    if (canRegisterPlayer) {
      await interaction.reply({
        content: `선수명단이 등록되지 않았습니다.`,
        ephemeral: true,
      });
      return;
    }
    // let playerList = "버그머스마 선수명단\n\n";
    // let playerNum = 1;
    // for (let i of players) {
    //   let tmp = Object.keys(i);
    //   playerList += `\`${playerNum++}번 선수\` : <@${tmp[0]}>\n`;
    // }
    let msg = `총 티켓 판매금액(수수료 제외) : \`${totalBetAmountAfterFee} BTC\`\n\n`;
    mulRate = [];
    for (let i of players) {
      let tmpMsg = "";
      //key : 선수 id
      let key = Object.keys(i)[0];
      //amount : 베팅금액
      let amount = i[key] === 0 ? 1 : i[key];
      mulRate.push(Math.floor((totalBetAmountAfterFee / amount) * 100) / 100);
      tmpMsg += `<@${key}>\n\`${
        players.indexOf(i) + 1
      }번 선수\` 승리 시 베팅금액의 **x${
        mulRate[players.indexOf(i)]
      }**지급\n\n`;
      msg += tmpMsg;
      await interaction.reply(msg);
    }
    // else await interaction.reply(playerList);
  }

  //ticket판매시작
  else if (interaction.options.getSubcommand() === "판매시작") {
    //check ifAdmin
    if (!Object.values(admin).includes(interaction.user.id)) {
      await interaction.reply({
        content: `명령어를 사용할 권한이 없습니다.`,
        ephemeral: true,
      });
      return;
    }
    if (canRegisterPlayer) {
      await interaction.reply({
        content: `등록된 선수가 없습니다.`,
        ephemeral: true,
      });
      return;
    }
    if (canBuyTicket) {
      await interaction.reply({
        content: `이미 티켓 판매중입니다!`,
        ephemeral: true,
      });
      return;
    }
    let playerList = "";
    let playerNum = 1;
    for (let i of players) {
      let tmp = Object.keys(i);
      playerList += `\`${playerNum++}번 선수\` : <@${tmp[0]}>\n`;
    }
    await interaction.reply(
      `티켓 판매가 시작되었습니다.\n\`/벅머 구매\` 명령어로 티켓을 구매할 수 있습니다.\n\n\`\`========== 선수명단 ==========\`\`\n\n${playerList}`
    );
    canBuyTicket = true;
  }

  //마권판매종료
  else if (interaction.options.getSubcommand() === "판매종료") {
    //check ifAdmin
    if (!Object.values(admin).includes(interaction.user.id)) {
      await interaction.reply({
        content: `명령어를 사용할 권한이 없습니다.`,
        ephemeral: true,
      });
      return;
    }
    if (!canBuyTicket) {
      await interaction.reply({
        content: `티켓 판매가 시작되지 않았습니다.`,
        ephemeral: true,
      });
      return;
    }
    let msg = `티켓 판매가 종료되었습니다.\n\n총 티켓 판매금액(수수료 제외) : \`${totalBetAmountAfterFee} BTC\`\n\n`;

    mulRate = [];
    for (let i of players) {
      let tmpMsg = "";
      //key : 선수 id
      let key = Object.keys(i)[0];
      //amount : 베팅금액
      let amount = i[key] === 0 ? 1 : i[key];
      mulRate.push(Math.floor((totalBetAmountAfterFee / amount) * 100) / 100);
      tmpMsg += `<@${key}>\n\`${
        players.indexOf(i) + 1
      }번 선수\` 승리 시 베팅금액의 **x${
        mulRate[players.indexOf(i)]
      }**지급\n\n`;
      msg += tmpMsg;
    }

    await interaction.reply(msg);
    canBuyTicket = false;
  }

  //티켓구매
  else if (interaction.options.getSubcommand() === "구매") {
    let selection = interaction.options.getInteger("선수번호");
    const betAmount = interaction.options.getInteger("bet_amount");
    //canBuy Ticket check
    if (!canBuyTicket) {
      await interaction.reply({
        content: "아직 티켓을 구매할 수 없습니다.",
        ephemeral: true,
      });
      return;
    }
    //playercheck
    if (players.length < selection) {
      await interaction.reply({
        content: `해당 선수는 등록되지 않은 선수입니다.`,
        ephemeral: true,
      });
      return;
    }
    //ticket betAmountLimit
    if (betAmount > 2000 || betAmount < 1) {
      await interaction.reply({
        content: `베팅 가능 최소 금액 : 1 BTC\n베팅 가능 최대 금액 : 2000 BTC`,
        ephemeral: true,
      });
      return;
    }
    //ticket buyer exist check
    const buyers = [];
    for (let i of ticketBuyers) {
      buyers.push(Object.keys(i)[0]);
    }
    if (buyers.includes(interaction.user.id)) {
      await interaction.reply({
        content: `티켓은 한장밖에 구매할 수 없습니다!`,
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const beforeBetBalance = await bankManager.getBalance(interaction.user.id);
    if (betAmount > beforeBetBalance.point.current) {
      await interaction.editReply(`잔고가 부족합니다!`);
      return;
    }

    //ticket buy function
    // bank deposit
    await bankManager.depositBTC(interaction.user.id, String(betAmount));
    const balance = await bankManager.getBalance(interaction.user.id);
    // console.log(util.inspect(balance));
    let selectedPlayerData = players[selection - 1];
    const playerId = Object.keys(selectedPlayerData)[0];
    players[selection - 1][playerId] += betAmount;
    ticketBuyers.push({
      [interaction.user.id]: {
        [playerId]: betAmount,
      },
    });
    totalBetAmount += betAmount;
    totalBetAmountAfterFee = calcFee(totalBetAmount);
    // console.log(`totalbet = ${totalBetAmount}`);
    await interaction.editReply(
      `티켓 구매자 : <@${interaction.user.id}>\n선택 : \`${selection}번 선수\` <@${playerId}>\n구매 금액 : ${betAmount} BTC\n티켓 구매 후 잔액 : ${balance.point.current} BTC`
    );

    let msg = `<@${interaction.user.id}> 티켓 구매!\n\n총 티켓 판매금액(수수료 제외) : \`${totalBetAmountAfterFee} BTC\`\n\n`;

    mulRate = [];
    for (let i of players) {
      let tmpMsg = "";
      let key = Object.keys(i)[0];
      let amount = i[key] === 0 ? 1 : i[key];
      mulRate.push(Math.floor((totalBetAmountAfterFee / amount) * 100) / 100);
      tmpMsg += `<@${key}>\n\`${
        players.indexOf(i) + 1
      }번 선수\` 승리 시 베팅금액의 **x${
        mulRate[players.indexOf(i)]
      }**지급\n\n`;
      msg += tmpMsg;
    }
    await interaction.followUp(msg);
    // console.log(ticketBuyers);
  }

  //게임결과 입력
  else if (interaction.options.getSubcommand() === "결과입력") {
    //check ifAdmin
    if (!Object.values(admin).includes(interaction.user.id)) {
      await interaction.reply({
        content: `명령어를 사용할 권한이 없습니다.`,
        ephemeral: true,
      });
      return;
    }
    if (players.length == 0) {
      await interaction.reply({
        content: `등록된 게임이 없습니다.`,
        ephemeral: true,
      });
      return;
    } else if (canBuyTicket) {
      await interaction.reply({
        content: `티켓 판매가 종료되지 않았습니다.`,
        ephemeral: true,
      });
      return;
    }
    await interaction.deferReply();
    // result logic
    const winnerNum = interaction.options.getInteger("winner_num");
    const winnerIdx = winnerNum - 1;
    const winnerId = Object.keys(players[winnerIdx])[0];
    let msg = `이번 경기 승리자는 \`${winnerNum}번 선수\` <@${winnerId}> 입니다!🎉\n\n`;
    let buyers = [];
    for (let i of ticketBuyers) {
      buyers.push(Object.keys(i)[0]);
    }
    // console.log(`buyers : ${buyers}`);
    // console.log(`ticketBuyers : ${util.inspect(ticketBuyers)}`);
    for (let i of buyers) {
      // console.log(`i : ${i}`);
      for (let j of ticketBuyers) {
        // console.log(`j : ${util.inspect(j)}`);
        if (Object.keys(j)[0] == String(i))
          if (Object.keys(j[String(i)])[0] === winnerId) {
            await bankManager.withdrawBTC(
              String(i),
              Math.floor(j[String(i)][winnerId] * mulRate[winnerIdx] * 100) /
                100
            );
            msg += `<@${i}>\nㄴ베팅금액 : ${
              j[String(i)][winnerId]
            }BTC | 배당률 : x${mulRate[winnerIdx]} | 지급액 : ${
              Math.floor(j[String(i)][winnerId] * mulRate[winnerIdx] * 100) /
              100
            }BTC\n\n`;
          }
      }
    }
    const receiver = admin.나트리움;
    const receiver2 = admin.목조;
    const fee1 = Math.floor((totalBetAmount * 3) / 100);
    const fee2 = Math.floor((totalBetAmount * 7) / 100);
    await bankManager.withdrawBTC(receiver, String(fee1)); // 나트리움한테 3%
    await bankManager.withdrawBTC(receiver2, String(fee2)); // 목조한테 7%
    console.log(`수수료 ${fee1}BTC가 ${receiver} 에게 입급되었습니다.`);
    console.log(`수수료 ${fee2}BTC가 ${receiver2} 에게 입급되었습니다.`);
    resetData();
    console.log(`선수명단이 초기화 되었습니다.`);
    await interaction.editReply(msg);
  }

  //내 티켓 보기
  else if (interaction.options.getSubcommand() === "내티켓") {
    if (canRegisterPlayer) {
      await interaction.reply({
        content: `선수명단이 등록되지 않았습니다.`,
        ephemeral: true,
      });
      return;
    }
    const buyers = [];
    for (let i of ticketBuyers) {
      buyers.push(Object.keys(i)[0]);
    }
    if (!buyers.includes(interaction.user.id)) {
      await interaction.reply({
        content: `티켓을 구매하지 않았습니다!`,
        ephemeral: true,
      });
      return;
    }
    const myId = interaction.user.id;
    let tmp;
    for (let i of ticketBuyers) {
      if (Object.keys(i)[0] === myId) {
        tmp = i;
      }
    }
    if (tmp) {
      let myPick = Object.keys(tmp[myId])[0];
      let myBet = tmp[myId][Object.keys(tmp[myId])[0]];
      let msg =
        `<@${myId}>의 티켓\n\nPICK : <@` + myPick + `>\nBET :` + myBet + ` BTC`;

      await interaction.reply({ content: msg, ephemeral: true });
    }
  }
}

module.exports = musmaGame;
