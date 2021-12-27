"use strict";
exports.__esModule = true;
exports.firebaseApp = void 0;
var app_1 = require("firebase/app");
var storage_1 = require("firebase/storage");
var firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    databaseURL: process.env.REACT_APP_DATABASE_URL
};
exports.firebaseApp = app_1.initializeApp(firebaseConfig);
var storage = storage_1.getStorage(exports.firebaseApp);
exports["default"] = storage;
