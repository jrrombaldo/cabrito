const {ipcRenderer} = require('electron')


// outputing on the console as well
var nodeConsole = require('console');
var con = new nodeConsole.Console(process.stdout, process.stderr);


const sketchBtn = document.getElementById('sketchBtn')
sketchBtn.addEventListener('click', click_crack);
sketchBtn.targetPar = "sketch"

const psBtn = document.getElementById('psBtn')
psBtn.addEventListener('click', click_crack);
psBtn.targetPar = "photoshop"

const illBtn = document.getElementById('illBtn')
illBtn.addEventListener('click', click_crack);
illBtn.targetPar = "illustrator"


function click_crack(evt) {
  var target = evt.target.targetPar
  //con.log(target);
  ipcRenderer.send('crack-'+target)
  // ipcRenderer.send('open-dialog', target)
}


ipcRenderer.on('capture-result', (event, index) => {
  let message = 'You selected '
  if (index === 0) alert('you\'ve selected yes')
  else alert('you\'ve selected no')
})


// IP to capture crack result
ipcRenderer.on('crack-result', (event, result) => {
  if (result) alert ('successfully cracked')
  else alter('something went wrong :(')
})







