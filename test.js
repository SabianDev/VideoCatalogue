// test-libs.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const ffmpeg = require('fluent-ffmpeg');
const chokidar = require('chokidar'); // opsional, kalau install

console.log("✅ Express, CORS, BodyParser, better-sqlite3, fluent-ffmpeg siap dipakai.");