const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');
const fsSync = require('fs');

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

//*2.feladat
const generateTxt = () => {
    let szamok = [];
    for (let i = 0; i < 20; i++) {
        let szam = Math.floor(Math.random() * 50) + 1;
        szamok.push(szam);
    }
    //*2.feladat writeFile() meghívása
    //await writeTextFile('../files/szamok.txt', szamok.join()); => Szinkron fájl írást
    //console.log(szamok);
    fsSync.writeFileSync(path.join(__dirname, '../files/szamok.txt'), szamok.join(), 'utf8');
};
generateTxt();

//*File beolvasás
const ReadTextFile = async (filepath) => {
    try {
        const text = await fs.readFile(filepath, 'utf8');
        return text;
    } catch (error) {
        throw new Error('Olvasási hiba: ', error.message);
    }
};

//!Endpoints:
//?GET /api/test

//*Összeg
router.get('/osszeg', async (request,response)=>{
    try{
        let osszeg = 0;
        
        let tomb = [];
        const utvonal = path.join(__dirname, '../files/szamok.txt');

        const content = await ReadTextFile(utvonal);
        for(let i=0;i<20;i++){
            tomb.push(parseInt(content.split(',')[i]))
        }

        for(let i=0;i<tomb.length;i++){
            osszeg+=tomb[i];
        }

        
        response.status(200).json({
            success:true,
            osszeg:osszeg
        })
        
    }catch(error){
        response.status(!200).json({
            success:false
        })
        
    }
});

//*Szorzat
router.get('/szorzat', async(request,response)=>{
    try{
        let tomb = [];
        let szorzat = 0;
        const utvonal = path.join(__dirname, '../files/szamok.txt');
        const content = await ReadTextFile(utvonal);
        for(let i=0;i<20;i++){
            tomb.push(parseInt(content.split(',')[i]))
        }
        szorzat = tomb[0]*tomb[tomb.length-1]

        response.status(200).json({
            success:true,
            szorzat:szorzat
        })
    }catch(error){
        response.status(!200).json({
            success:false
        })
        
    }
});

//*Átlag
router.get('/atlag', async (request,response)=>{
    try{
        let tomb = [];
        let atlag = 0;
        let osszeg = 0;
        const utvonal = path.join(__dirname, '../files/szamok.txt');
        const content = await ReadTextFile(utvonal);
        for(let i=0;i<20;i++){
            tomb.push(parseInt(content.split(',')[i]))
        }
        for(let i=0;i<tomb.length;i++){
            osszeg+=tomb[i]
        }
        atlag = osszeg/tomb.length
        response.status(200).json({
            success:true,
            atlag: atlag
        })
        
    }catch(error){
        response.status(500).json({
            success:false
        })
    }
});

//*Minimum
router.get('/min', async (request,response)=>{
    try{
        let tomb = [];
        let min = 0;
        const utvonal = path.join(__dirname, '../files/szamok.txt');
        const content = await ReadTextFile(utvonal);
        for(let i=0;i<20;i++){
            tomb.push(parseInt(content.split(',')[i]));
        }
        for(let i=1;i<tomb.length;i++){
            if(tomb[min]>tomb[i]){
                min = i
            }
        }
        response.status(200).json({
            success:true,
            min:tomb[min]
        })
    }catch(error){
        response.status(500).json({
            success:false
        })
    } 
});

router.get('/max', async (request,response)=>{
    try{
        const utvonal = path.join(__dirname, '../files/szamok.txt');
        const content = await ReadTextFile(utvonal);
        let tomb = [];
        let max = 0;
        for(let i=0;i<20;i++){
            tomb.push(parseInt(content.split(',')[i]));
        }
        for(let i=1;i<tomb.length;i++){
            if(tomb[max]<tomb[i]){
                max = i;
            }
        }
        response.status(200).json({
            success:true,
            max:tomb[max]
        })
    }catch(error){
        response.status(500).json({
            success:false
        })
        
    }
});

router.get('/rendezes', async (request,response)=>{
    try{
        const utvonal = path.join(__dirname, '../files/szamok.txt');
        const content = await ReadTextFile(utvonal);
        let tomb = [];
        
        for(let i=0;i<20;i++){
            tomb.push(parseInt(content.split(',')[i]));
        }
        let rendeztomb = [];
        rendeztomb = tomb.sort((a,b)=>a-b);

        response.status(200).json({
            success:true,
            sort:rendeztomb
        });
    }catch(error){
        response.status(500).json({
            success:false
        })
    }
})

//*Beolvasás
router.get('/beolvas', async (request, response) => {
    try {
        const utvonal = path.join(__dirname, '../files/szamok.txt');
        const content = await ReadTextFile(utvonal);

        response.status(200).json({
            sucess: true,
            content: content
        });
    } catch (error) {
        response.status(!200).json({
            success: false
        });
    }
});

// router.get('/test', (request, response) => {
//     response.status(200).json({
//         message: 'Ez a végpont működik.'
//     });
// });

// //?GET /api/testsql
// router.get('/testsql', async (request, response) => {
//     try {
//         const selectall = await database.selectall();
//         response.status(200).json({
//             message: 'Ez a végpont működik.',
//             results: selectall
//         });
//     } catch (error) {
//         response.status(500).json({
//             message: 'Ez a végpont nem működik.'
//         });
//     }
// });

module.exports = router;
