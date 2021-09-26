const config = require("./botconfig/config.json");

const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./index.js', { 
        execArgv: ['--trace-warnings'],
	shardArgs: ['--ansi', '--color'],
        token: config.token 
});

manager.on('shardCreate', shard => console.log(`\nLaunched shard ${shard.id}`));

manager.spawn({ timeout: -1 })
  .then(shards => {
		shards.forEach(shard => {
			shard.on('message', message => {
				console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
			});
		});
	})
	.catch(console.error);