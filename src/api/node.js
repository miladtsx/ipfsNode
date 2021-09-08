
const express = require('express');
const app = express();

const ipfs = require('../ipfs');

app.get('/start', async (req, res, next) => {

    try {
        const nodeInfo = await ipfs.Node.StartNode();

        const responseToSend = ({
            isSucceeded: !!nodeInfo,
            nodeInfo: nodeInfo
        });

        res.status(200).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.get('/stop', async (req, res, next) => {
    try {

        await ipfs.Node.StopNode();

        const responseToSend = ({
            isSucceeded: true
        });

        res.status(200).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.get('/stats', async (req, res, next) => {
    try {

        const stats = await ipfs.Node.GetStats();

        const responseToSend = ({
            isSucceeded: true,
            stats: {
                rateIn: stats.rateIn.toString(),
                rateOut: stats.rateOut.toString(),
                totalIn: stats.totalIn.toString(),
                totalOut: stats.totalOut.toString(),
            }
        });

        res.status(200).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.get('/configs', async (req, res, next) => {
    try {

        const currentConfiguration = await ipfs.Node.GetConfig();

        const responseToSend = ({
            isSucceeded: !!currentConfiguration,
            currentConfiguration
        });

        res.status(200).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.get('/peers', async (req, res, next) => {
    try {

        const peers = await ipfs.Node.ConnectedPeers();

        const responseToSend = ({
            isSucceeded: !!peers,
            peers
        });

        res.status(200).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.get('/bitswap/stat', async (req, res, next) => {
    try {

        const stat = await ipfs.Node.BitSwapStatus();

        const responseToSend = ({
            isSucceeded: true,
            peers: stat.peers,
            blocksSent: stat.blocksSent.toString(),
            blocksReceived: stat.blocksReceived.toString(),
            dataSent: stat.dataSent.toString(),
            dataReceived: stat.dataReceived.toString(),
            wantList: stat.wantlist
        });

        res.status(200).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

module.exports = app;