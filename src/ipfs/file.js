const IPFS = require('ipfs-core');
const { urlSource } = require('ipfs-core');
const { JSONDB: { select, update, deleteKey, create, getAll } } = require('../db');

module.exports = {
    add: async (name, content) => {
        try {

            const fileAdded = await global.IPFSNode.add({
                path: name,
                content: content
            });

            create(fileAdded.cid, name);

            return {
                isSucceed: !!fileAdded,
                cid: fileAdded.cid,
                fileName: fileAdded.path
            }
        } catch (error) {
            console.error(error);
            return {
                isSucceed: false,
                error: error,
            }
        }
    },
    addMultiple: async (arrayOfFiles) => {
        try {
            const result = await AddMultipleFilesWrappedByDirectory(arrayOfFiles);

            return {
                isSucceed: !!result,
                result
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    addFromURL: async (url) => {
        try {
            const fileAdded = await global.IPFSNode.add(urlSource(url));
            create(fileAdded.cid, fileAdded.path);
            return {
                isSucceed: true,
                cid: fileAdded.cid,
                fileName: fileAdded.path
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    renameFile: (cid, newName) => {
        return update(cid, newName);
    },
    deleteFile: (cid) => {
        return deleteKey(cid);
    },
    getListOfFiles: () => {
        return getAll();
    },
    getFile: async (cid) => {
        return await downloadFile(cid);
    },
    getMetaData: async (cid) => {
        return await getMetaData(cid);
    }
}

async function AddMultipleFilesWrappedByDirectory(files) {
    try {

        const uploadResult = []

        for await (const resultPart of global.IPFSNode.addAll(files, { wrapWithDirectory: true })) {
            uploadResult.push(resultPart)
        }

        return uploadResult.map(r => {

            create(r.cid.toString(), r.path);

            return {
                cid: r.cid.toString(),
                path: r.path,
                size: r.size,
                mode: r.mode
            }
        });
    } catch (error) {
        console.log(error);
    }
}

async function getMetaData(cid) {
    try {
        const listOfFiles = [];
        for await (const file of global.IPFSNode.ls(cid)) {
            listOfFiles.push({
                fileName: select(cid),
                file
            });
        }

        return listOfFiles;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function downloadFile(cid) {
    try {

        const uint8ArrayConcat = require('uint8arrays/concat')
        const chunks = []
        for await (const chunk of global.IPFSNode.cat(cid)) {
            chunks.push(chunk)
        }
        const fileInfo = uint8ArrayConcat(chunks).toString();

        return {
            fileName: select(cid),
            content: fileInfo
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}
