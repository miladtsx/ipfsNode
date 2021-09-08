const JSONdb = require('simple-json-db');
const db = new JSONdb('./src/db/db.json');
db.sync();

module.exports = {
    select: (key) => {
        try {
            const result = db.get(key);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    create: (key, value) => {
        try {
            db.set(key, value);
            const result = db.sync();
            return result;

        } catch (error) {
            console.error(error);
            return null;
        }
    },
    update: (key, newValue) => {
        try {
            const oldValue = db.get(key);
            db.delete(key);
            db.set(key, newValue);
            db.sync();
            return db.get(key);
        }
        catch (error) {
            console.error(error);
            return null;
        }
    },
    deleteKey: (key) => {
        try {
            db.delete(key);
            db.sync();
            return true;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    },
    getAll: () => {
        try {
            return db.JSON();
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
}