var fs = require('fs');
const path = require('path')
var xpath = require('xpath')
var dom = require('xmldom').DOMParser
const exec = require('child_process').exec;
var BigNumber = require('big-number');
const { dialog } = require('electron')


module.exports = {
    crack_photoshop,
    crack_illustrator
}


const photostop2018_instalation = '/Applications/Adobe\ Photoshop\ CC\ 2018/Adobe\ Photoshop\ CC\ 2018.app/'
const photostop2019_instalation = '/Applications/Adobe\ Photoshop\ CC\ 2019/Adobe\ Photoshop\ CC\ 2019.app/'
const photostop2018_trial = '/Library/Application Support/Adobe/Adobe\ Photoshop\ CC\ 2018/AMT/application.xml'
const photostop2019_trial = "/Library/Application\ Support/Adobe/Adobe\ Photoshop\ CC\ 2019/AMT/application.xml"

const illustrator2018_instalation = '/Applications/Adobe\ Illustrator\ CC\ 2018/Adobe\ Illustrator.app/'
const illustrator2019_instalation = '/Applications/Adobe\ Illustrator\ CC\ 2019/Adobe\ Illustrator.app/'
const illustrator2018_trial = '/Applications/Adobe Illustrator CC 2018/Support Files/AMT/AI/AMT/application.xml'
const illustrator2019_trial = '/Applications/Adobe\ Illustrator\ CC\ 2019/Support\ Files/AMT/AI/AMT/application.xml'

// GLOBAL variables to define application, installation dir and trial file
let instalation = null
let trial_file = null
let app = null


function crack_photoshop() {
    app = 'photoshop'
    crack_adobe()
}
function crack_illustrator() {
    app = 'illustrator'
    crack_adobe()
}

function find_version() {
    if (app == 'photoshop') {
        if (fs.existsSync(photostop2018_instalation))
            instalation = photostop2018_instalation
        else if (fs.existsSync(photostop2019_instalation))
            instalation = photostop2019_instalation
        else
            console.log(app + "Installation not found, looked for: " + photostop2018_instalation + " and " + photostop2019_instalation)
    }
    if (app == 'illustrator') {
        if (fs.existsSync(illustrator2018_instalation))
            instalation = illustrator2018_instalation
        else if (fs.existsSync(illustrator2019_instalation))
            instalation = illustrator2019_instalation
        else
            console.log(app + " Installation not found, looked for: " + photostop2018_instalation + " and " + photostop2019_instalation)
    }
}

function find_trial() {
    if (app == 'photoshop') {
        if (fs.existsSync(photostop2018_trial))
            trial_file = photostop2018_trial
        else if (fs.existsSync(photostop2019_trial))
            trial_file = photostop2019_trial
        else
            console.log(app + " trial file not found, looked for: " + photostop2018_trial + " and " + photostop2019_trial)
    }
    if (app == 'illustrator') {
        if (fs.existsSync(illustrator2018_trial))
            trial_file = illustrator2018_trial
        else if (fs.existsSync(illustrator2019_trial))
            trial_file = illustrator2019_trial
        else
            console.log(app + " trial file not found, looked for: " + photostop2018_trial + " and " + photostop2019_trial)
    }
}

function crack_adobe() {
    try {

        find_version()
        if (!instalation) {
            dialog.showErrorBox(app + ' installation not found :(')
            return false
        }

        find_trial()
        if (!trial_file) {
            dialog.showErrorBox(app + ' trial file not found :(')
            return false
        }


        // reading current trial timestamp
        current_ts = get_current_trial(trial_file)

        // increasing current time stamp
        new_ts = BigNumber(current_ts, 10).plus(1)

        // updating trial file with the new timestamp
        update_file(trial_file, current_ts, new_ts.toString())

        // opening application
        open_app(instalation)

    } catch (e) {
        console.log('error: ' + e)
        return false
    }
    return true
}


function check_existence(filename, app) {
    if (fs.existsSync(filename)) {
        return true
    } else {
        dialog.showErrorBox(app + ' not found :(', "missing file " + filename + "")
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


function update_file(filename, current_ts, new_ts) {
    let current_content = fs.readFileSync(filename).toString('utf8')
    let new_content = current_content.replace(current_ts, new_ts);
    fs.writeFileSync(filename, new_content);
}

function open_app(application_location) {
    function Callback(err, stdout, stderr) {
        if (err) {
            console.log(`exec error: ${err}`);
            return;
        } else {
            console.log(`${stdout}`);
        }
    }
    res = exec('open "' + application_location + '"', Callback);
}
