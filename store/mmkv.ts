import { Storage } from 'redux-persist';
// Workaround for TypeScript identifying MMKV as a type-only module in some configs
const { MMKV } = require('react-native-mmkv');

const storage = new MMKV();

export const reduxStorage: Storage = {
    setItem: (key, value) => {
        storage.set(key, value);
        return Promise.resolve(true);
    },
    getItem: (key) => {
        const value = storage.getString(key);
        return Promise.resolve(value);
    },
    removeItem: (key) => {
        storage.delete(key);
        return Promise.resolve();
    },
};
