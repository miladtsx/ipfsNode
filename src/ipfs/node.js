const IPFS = require('ipfs-core');

module.exports = {
    StartNode: async () => {
        if (global.IPFSNode && global.IPFSNode.isOnline()) return null;

        const repoPath = `ipfs-${Math.random()}`
        global.IPFSNode = await IPFS.create({
            repo: repoPath,
            config: require('../config/config')
        });

        const multiAddrs = await global.IPFSNode.swarm.localAddrs()
        multiAddrs.map(add => console.log(`Local Address ${add.toString()}`));

        const peerInfos = await global.IPFSNode.swarm.addrs()

        peerInfos.forEach(async info => {
            let peers = [];
            info.addrs.forEach(async addr => {
                try {
                    await global.IPFSNode.swarm.connect(addr);
                    console.log(`Connected to ${addr}`);
                } catch (error) {
                    // console.error(error);
                }
            });
        })

        return global.IPFSNode.isOnline() ? await IPFSNode.id() : false;
    },
    StopNode: async () => {
        await global.IPFSNode.stop();
    },
    GetStats: async () => {
        try {
            const result = [];
            for await (const stat of global.IPFSNode.stats.bw()) {
                result.push(stat);
            }
            return result[0];

        } catch (error) {
            console.error(error);
            return null;
        }
    },
    GetConfig: async () => {
        try {
            return await global.IPFSNode.config.getAll()
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    ConnectedPeers: async () => {
        try {
            const peerInfos = await global.IPFSNode.swarm.addrs()

            const peers = [];
            peerInfos.forEach(info => {
                info.addrs.forEach(addr => {
                    peers.push(addr);
                });
            })
            return peers;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    BitSwapStatus: async () => {
        try {
            const stats = await global.IPFSNode.bitswap.stat()
            return stats;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}