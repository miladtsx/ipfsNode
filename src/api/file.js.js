const express = require('express');
const app = express();

const ipfs = require('../ipfs');

app.post('/upload/single', async (req, res, next) => {
    try {
        let rawFile = req.files.file;

        let saveResult = await ipfs.File.add(rawFile.name, rawFile.data);

        let responseToSend = {};
        responseToSend = {
            isSucceeded: !!saveResult,
            cid: saveResult.cid.toString()
        };

        res.status(201).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.post('/upload/multiple', async (req, res, next) => {
    try {

        const filesToUpload = [];
        const rawFiles = req.files.file;
        Object.keys(rawFiles).map(async fileIndex => {
            const theFile = rawFiles[fileIndex];
            filesToUpload.push(
                {
                    path: theFile.name,
                    content: theFile.data
                }
            );
        });

        const result = await ipfs.File.addMultiple(filesToUpload);

        const responseToSend = {
            isSucceeded: !!result,
            result
        };

        res.status(201).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.post('/upload/remote', async (req, res, next) => {
    try {
        const remoteFileURI = req.body.url;
        let uploadResult = await ipfs.File.addFromURL(remoteFileURI);

        let responseToSend = {};
        uploadResult ?
            responseToSend = {
                isSucceeded: uploadResult.isSucceed,
                cid: uploadResult.cid.toString(),
                fileName: uploadResult.fileName
            } :
            responseToSend = {
                isSucceeded: false
            };

        res.status(201).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.get('/info/:cid', async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const fileInfo = await ipfs.File.getMetaData(cid);

        const responseToSend = {
            isSucceeded: true,
            fileInfo
        };
        res.status(200).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.post('/rename/:cid', async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const newName = req.body.newName;

        const fileInfo = await ipfs.File.renameFile(cid, newName);

        const responseToSend = {
            isSucceeded: true,
            fileInfo
        };
        res.status(200).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.get('/delete/:cid', async (req, res, next) => {
    try {
        const cid = req.params.cid;

        ipfs.File.deleteFile(cid);

        const responseToSend = {
            isSucceeded: true
        };
        res.status(200).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.get('/list', async (req, res, next) => {
    try {

        const files = await ipfs.File.getListOfFiles();
        const listOfFiles = Object.entries(files).map(record => {
            return {
                cid: record[0],
                name: record[1]
            }
        })

        const responseToSend = {
            isSucceeded: true,
            listOfFiles
        };
        res.status(200).send(responseToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSucceeded: false,
            message: error
        });
    }
});

app.get('/download/:cid', async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const fileInfo = await ipfs.File.getFile(cid);

        const responseToSend = {
            isSucceeded: !!fileInfo,
            fileInfo
        };
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