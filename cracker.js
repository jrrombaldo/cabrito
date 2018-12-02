var fs = require('fs');
const path = require('path')
var xpath = require('xpath')
var dom = require('xmldom').DOMParser
const exec = require('child_process').exec;
var BigNumber = require('big-number');
const {dialog } = require('electron')


module.exports = {
    crack_photoshop,
    crack_illustrator
}


const photostop_location = '/Applications/Adobe\ Photoshop\ CC\ 2018/Adobe\ Photoshop\ CC\ 2018.app/'
const photoshop_file = '/Library/Application Support/Adobe/Adobe Photoshop CC 2018/AMT/application.xml'
var ps_tst = path.join(__dirname, "application.xml")

const illustrator_location = '/Applications/Adobe\ Illustrator\ CC\ 2018/Adobe\ Illustrator.app/'
const illustrator_file = '/Applications/Adobe Illustrator CC 2018/Support Files/AMT/AI/AMT/application.xml'


let instalation = null
let trial_file = null
let app = null


function crack_photoshop(){
    instalation = photostop_location
    trial_file = photoshop_file
    app = 'photoshop'
    crack_adobe()
}
function crack_illustrator() {
    instalation = illustrator_location
    trial_file = illustrator_file
    app = 'illustrator'
    crack_adobe()
}

function crack_adobe() {
    try{

        // checking if instalation exists
        if ( !check_existence(instalation, app)){
            console.log("Installation not fond, looked for: "+instalation)
            return false
        } 
        
        //checking for the trial file
        if (!check_existence(trial_file, app) ){
            console.log("trial file not found, looked for: "+trial_file)
            return false
        } 

        // reading current trial timestamp
        current_ts = get_current_trial(trial_file)

        // increasing current time stamp
        new_ts =  BigNumber(current_ts, 10).plus(1)

        // updating trial file with the new timestamp
        update_file(trial_file, current_ts, new_ts.toString())

        // opening application
        open_app(instalation)

    }catch (e){
        console.log ('error: '+e)
        return false
    }
    return true
}


function check_existence(filename, app){
    if (fs.existsSync(path)) {
        return true
    }else{
        dialog.showErrorBox(app+' not found :(', "missing file "+filename+"")
        return false
    }
}



function get_current_trial(filename) {
    let xmlContent = fs.readFileSync(filename).toString('utf8')

    var doc = new dom().parseFromString(xmlContent)
    var result = xpath.select(
        'string(//Data[@key="TrialSerialNumber"])',     // xpathExpression
        doc,                                            // contextNode
        null,                                           // namespaceResolver
        xpath.XPathResult.ANY_TYPE,                     // resultType
        null                                            // result
    )
    return result
}


function update_file(filename, current_ts, new_ts){
    let current_content =    fs.readFileSync(filename).toString('utf8')
    let new_content = current_content.replace(current_ts, new_ts);
    fs.writeFileSync(filename, new_content);
}

function open_app(application_location){
    function Callback(err, stdout, stderr) {
        if (err) {
            console.log(`exec error: ${err}`);
            return;
        }else{
            console.log(`${stdout}`);
        }
    }
    res = exec('open '+application_location, Callback);
}
