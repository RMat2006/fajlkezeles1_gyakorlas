const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');
const { request } = require('http');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//*File olvasása
const readTextFile = async(filePath)=>{
    try{
        const text = await fs.readFile(filePath, 'utf8');
        return text;
    }catch(error){
        throw new Error("Olvasási error: ", error);
    }
};


//*file írása
const writeTextFile = async (filePath, content)=>{
    try{
        fs.writeFile(filePath, content, 'utf8');
        return 'A fájl sikeresen módosítva';
    }catch(error){
        throw new Error('Hiba az íráskor: ', error.message);
    }
};

//!Endpoints:
//?GET /api/test

//*2.feladat
let szamok = [];
for(let i=0;i<20;i++){
    let szam = Math.floor(Math.random() * 50) + 1;
    szamok.push(szam);
}

//*2.feladat writeFile() meghívása
writeTextFile('../files/szamok.txt', szamok.join());

//*1.feladat
router.get('/readfile', async (request,response)=>{
    try{
        const utvonal = path.join(__dirname, '../files/adatok.txt');
        const text = await readTextFile(utvonal);
        response.status(200).json({
            success: true,
            text:text
        })
    }catch(error){
        response.status(500).json({
            success:false
        })
    }
});

router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

module.exports = router;
