# Secure Files Before Breach
This project is made for securing files in system with machine UUID.

## How to run this project : 
run.bat installs package and run the project.
To run this project manually following prerequisites and commands are used:

### Prerequisite
Download Nodejs from https://nodejs.org/en/download/
    Node.js : v18.13.0

### Commands
Run following command to  install all packages
    ```npm install```

Run following to run the project.
    ```npm run start```

## Project Description:
This is a desktop application build on electron.js.

### How Application works
After running the application you will see 3 following options:
* Open File to Secure
    * By clicking on this button a popup will open and you can select any file from your computer.
    * The original file will be replaced by encrypted file.
* Open File to Open
    * By clicking on this button a popup will open and you can select any file from your computer.
    * The file will be opened from temp folder.
* Open File to Retrieve
    * By clicking on this button a popup will open and you can select any file from your computer.
    * The encrypted file will be replaced by decrypted file.

### Technical description
This application encrypts original file with machine UUID and replace with original file.
Files are encrypted by AES-128-CBC Algorithm.
Files won't open on another machine as machine UUID is used.
* Open File to Secure
    * Selected file will be read.
    * Then will be encrpyted with machine UUID.
    * Then it will be replaced with the original file.
* Open File to Open
    * Selected file will be read.
    * Then will be decrpyted with machine UUID.
    * Then it will be stored in temp folder.
    * Then it will open with default system application.
* Open File to Retrieve
    * Selected file will be read.
    * Then will be decrpyted with machine UUID.
    * Then it will be replaced with the encrypted file.
* Cronjob
    * A cronjob is made to delete files in temp folder.
    * Cronjob will run in every 2 minutes.
    * Cronjob will delete files created before 2 minutes ago.
     
### Utilities

* Hex To Binary
This converts 32 bytes hexadecimal machine UUID 128 bits to be used in aes 128 cbc algorithm.

* Machine UUID
This returns machine UUID. code written for windows, linux and mac os.

### Libraries used

* fs: To read and write files.
* node-cron: To run cronjob after some interval of time.
* crypto: To encrypt and decrypt files by AES-128-CBC algorithm.