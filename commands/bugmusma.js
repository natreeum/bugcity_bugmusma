const CommandBuilder = require(`../SlashCommandBuilders/CommandBuilder`);
const musmaGame = require(`../functions/musmagame`);
module.exports = {
  data: CommandBuilder,
  async execute(interaction) {
    await musmaGame(interaction);
  },
};
