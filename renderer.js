const ipc = require('electron').ipcRenderer;

const buttonCreated = document.getElementById('upload');
const openFileButtonCreated = document.getElementById('open-file');
const retrieveFileButtonCreated = document.getElementById('retrieve-file');

buttonCreated.addEventListener('click', function(event){

    ipc.send('open-file-dialog-for-file');

})

openFileButtonCreated.addEventListener('click', function(event){

    ipc.send('open-file-dialog-for-open-file');

})

retrieveFileButtonCreated.addEventListener('click', function(event){

    ipc.send('open-file-dialog-for-retrieve-file');

})

ipc.on('selected-file',function(event,path){
    
})

