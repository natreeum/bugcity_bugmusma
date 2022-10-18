const { SlashCommandBuilder } = require('discord.js');

const CommandBuilder = new SlashCommandBuilder()
  .setName('벅머')
  .setDescription('BugMusma Commands')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('선수등록')
      .setDescription('register players')
      .addUserOption((o) =>
        o.setName('no1').setDescription('Select user').setRequired(true)
      )
      .addUserOption((o) => o.setName('no2').setDescription('Select user'))
      .addUserOption((o) => o.setName('no3').setDescription('Select user'))
      .addUserOption((o) => o.setName('no4').setDescription('Select user'))
      .addUserOption((o) => o.setName('no5').setDescription('Select user'))
      .addUserOption((o) => o.setName('no6').setDescription('Select user'))
      .addUserOption((o) => o.setName('no7').setDescription('Select user'))
      .addUserOption((o) => o.setName('no8').setDescription('Select user'))
      .addUserOption((o) => o.setName('no9').setDescription('Select user'))
  )
  .addSubcommand((s) => s.setName('리셋').setDescription('reset game data'))
  .addSubcommand((s) => s.setName('선수명단').setDescription('show playerlist'))
  .addSubcommand((s) =>
    s.setName('판매시작').setDescription('start sell ticket')
  )
  .addSubcommand((s) => s.setName('판매종료').setDescription('end sell ticket'))
  .addSubcommand((s) => s.setName('내티켓').setDescription('show my tickets'))
  .addSubcommand((s) =>
    s
      .setName('구매')
      .setDescription('buy ticket')
      .addIntegerOption((o) =>
        o
          .setName('선수번호')
          .setDescription('Choose a player number')
          .setRequired(true)
      )
      .addIntegerOption((o) =>
        o
          .setName('bet_amount')
          .setDescription('betting amount')
          .setRequired(true)
      )
  )
  .addSubcommand((s) =>
    s
      .setName('결과입력')
      .setDescription('Enter the result of game')
      .addIntegerOption((o) =>
        o
          .setName('winner_num')
          .setDescription(`enter winner player's num`)
          .setRequired(true)
      )
  );
module.exports = CommandBuilder;
