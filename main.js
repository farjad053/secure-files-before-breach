var app = require('electron').app;

var BrowserWindow = require('electron').BrowserWindow;

app.disableHardwareAcceleration();

const crypto = require('crypto');
const fs = require('fs');
const machineUUID = require('./utils/machineUUID/index.js');
const hexToBinary = require('./utils/hexToBinary/index.js');
const fse = require('fs-extra')

var {dialog} = require('electron');

var cron = require('node-cron');
const path = require('path')

var mainWindow = null;

var ipc = require('electron').ipcMain;

ipc.on('close-main-window',function() {
    app.quit();
})

function getCommandLine() {
    switch (process.platform) { 
       case 'darwin' : return 'open';
       case 'win32' : return 'start';
       case 'win64' : return 'start';
       default : return 'xdg-open';
    }
}

var exec = require('child_process').exec;


app.on('ready',function(){
    mainWindow = new BrowserWindow({
        resizable: true,
        height: 600,
        width: 800,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.loadFile('index.html');

    mainWindow.on('closed',function(){
        mainWindow = null;
    })

    ipc.on('open-file-dialog-for-file',function(event){
        dialog.showOpenDialog({
            properties:['openFile']
        }).then(async (files) => {
            if(!files.canceled && files.filePaths.length > 0){
                // console.log('files', files.filePaths[0].split('\\').pop());
                const uuid = await machineUUID()
                const key = hexToBinary(uuid);

                const fileName = files.filePaths[0].split('\\').pop();

                try {
                    var cipher = crypto.createCipher('aes-128-cbc', key);
                    var input = fs.createReadStream(files.filePaths[0]);
                    var output = fs.createWriteStream(fileName);
    
                    input.pipe(cipher).pipe(output);
    
                    output.on('finish', function() {
                        console.log('Encrypted file written to disk!');
                        fse.move(fileName, files.filePaths[0], { overwrite: true }, function (err) {
                            if (err) throw err
                            console.log('Successfully moved file!')
                        })
                    });
                } catch (err) {
                    console.log('err : ', err)
                }

                // event.sender.send('selected-file',files)
            }
        })
    })

    ipc.on('open-file-dialog-for-open-file',function(event){
        try {
            dialog.showOpenDialog({
                properties:['openFile']
            }).then(async (files) => {
                if(!files.canceled && files.filePaths.length > 0){
                    // console.log('files', files)
                    const uuid = await machineUUID()
                    const key = hexToBinary(uuid);
                    const fileExtension = files.filePaths[0].split('.').pop();
                    const timestamp = Date.now();
    
                    try {
                        var cipher = crypto.createDecipher('aes-128-cbc', key);
                        var input = fs.createReadStream(files.filePaths[0]);
                        var output = fs.createWriteStream('./temp/' + timestamp + '.' + fileExtension);
        
                        input.pipe(cipher).pipe(output);
    
                        exec(getCommandLine() + ' ' + './temp/' + timestamp + '.' + fileExtension);
                    } catch (err) {
                        console.log('err : ', err)
                    }
    
                    // event.sender.send('selected-file',files)
                }
            }).catch(err => {
                console.log('err : ', err);
            })
        } catch (err) {
            console.log('err : ', err);
        }
    })

    ipc.on('open-file-dialog-for-retrieve-file',function(event){
        try {
            dialog.showOpenDialog({
                properties:['openFile']
            }).then(async (files) => {
                if(!files.canceled && files.filePaths.length > 0){
                    // console.log('files', files)
                    const uuid = await machineUUID()
                    const key = hexToBinary(uuid);
                    
                    const fileName = files.filePaths[0].split('\\').pop();
    
                    try {
                        var cipher = crypto.createDecipher('aes-128-cbc', key);
                        var input = fs.createReadStream(files.filePaths[0]);
                        var output = fs.createWriteStream(fileName);
        
                        input.pipe(cipher).pipe(output);
    
                        output.on('finish', function() {
                            console.log('Encrypted file written to disk!');
                            fse.move(fileName, files.filePaths[0], { overwrite: true }, function (err) {
                                if (err) throw err
                                console.log('Successfully moved!')
                                exec(getCommandLine() + ' ' + files.filePaths[0]);
                            })
                        });
                    } catch (err) {
                        console.log('err : ', err)
                    }
    
                    // event.sender.send('selected-file',files)
                }
            }).catch(err => {
                console.log('err : ', err);
            })
        } catch (err) {
            console.log('err : ', err);
        }
    })
})

// process.on("uncaughtException", (err) => {
//     const messageBoxOptions = {
//         type: "error",
//         title: "Error in Main process",
//         message: "Something failed"
//     };
//     if (err.code == 'ERR_OSSL_BAD_DECRYPT') {
//     messageBoxOptions.message = 'Cannot Open File on this machine.'
//     }
//     dialog.showMessageBoxSync(messageBoxOptions);
// });

 var uploadsDir = __dirname + '/temp';

 cron.schedule('* * * * *', () => {
    console.log('running cron job');
    fs.readdir(uploadsDir, function(err, files) {
        console.log('files : ', files)
        files.forEach(function(file, index) {
            fs.stat(path.join(uploadsDir, file), function(err, stat) {
                var endTime, now;
                if (err) {
                return console.error(err);
                }
                now = new Date().getTime();
                endTime = new Date(stat.ctime).getTime() + 120000;
                if (now > endTime) {
                    return fs.unlink(path.join(uploadsDir, file), function(err) {
                        if (err) return console.error(err);
                      });
                }
            });
        });
      });
  });