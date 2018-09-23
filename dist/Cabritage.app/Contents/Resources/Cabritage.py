#!/usr/bin/env pythonw


import objc
from Foundation import *
from AppKit import *
from PyObjCTools import AppHelper

import os
import yaml
import xml.etree.cElementTree as ET


def configure():
    return yaml.load(file('cabritage.yml', 'rb').read())

config = configure()




class Adobe:
    def __init__(self, filename, app):

        if not os.path.exists(app):
            print "app [{0}] not found".format(app)
            exit(1)
        self.app = app

        if not os.path.exists(filename):
            print "file [{0}] not found".format(filename)
            exit(1)
        self.file = filename

    def extract_trial_ts(self, tag, attr):
        tree = ET.ElementTree(file=self.file)
        for l1 in tree.getroot():
            for l2 in l1.iter():
                if l2.tag.lower() == tag:
                    if l2.attrib['key'] == attr:
                        return int(l2.text)

    def update_serial_file(self, current_ts, new_ts, tag, attr):
        # reading file content
        f1 = open(self.file, 'r')
        data = f1.read()
        f1.close()

        # replacing data content (too lazy to parse the XML)
        data = data.replace(str(current_ts), str(new_ts))

        # updating file content
        f2 = open(self.file, 'w')
        f2.write(data)
        f2.close()

    def update_trial(self):
        current_ts = self.extract_trial_ts(tag='data', attr='TrialSerialNumber')
        new_ts = current_ts + 1
        print 'current={0} and new={1}'.format(current_ts, new_ts)

        self.update_serial_file(current_ts, new_ts, tag='data', attr='TrialSerialNumber')
        print '{0} update with success'.format(self.file)

    def open_app(self):
        os.system('open -a %s' % self.app)

def run_sketch():
    user = os.environ['USER']
    command =  "/usr/bin/osascript -e 'do shell script \"./sketch.sh \'{0}\'\" with administrator privileges'".format(user)
    print command
    os.system(command)


class AppDelegate (NSObject):
    def applicationDidFinishLaunching_(self, aNotification):
        print("application started")

    def photoShop_(self, sender):
        print("photoshop")
        photoshop = Adobe(config['photoshop']['serial_file'],config['photoshop']['app'])
        photoshop.update_trial()
        photoshop.open_app()

    def illustrator_(self, sender):
        print("illustrator")
        illustrator = Adobe(config['illustrator']['serial_file'], config['illustrator']['app'])
        illustrator.update_trial()
        illustrator.open_app()

    def sketch_(self, sender):
        print("sketch")


        run_sketch()

def main():
    app = NSApplication.sharedApplication()

    # we must keep a reference to the delegate object ourselves,
    # NSApp.setDelegate_() doesn't retain it. A local variable is
    # enough here.
    delegate = AppDelegate.alloc().init()
    NSApp().setDelegate_(delegate)

    win = NSWindow.alloc()
    frame = ((200.0, 300.0), (400.0, 100.0))
    win.initWithContentRect_styleMask_backing_defer_ (frame, 15, 2, 0)
    win.setTitle_ ('Cabritage')
    win.setLevel_ (3)                   # floating window



    ps_btn = NSButton.alloc().initWithFrame_ (((10.0, 10.0), (80.0, 80.0)))
    win.contentView().addSubview_ (ps_btn)
    ps_btn.setBezelStyle_(6)
    ps_btn.setTitle_( 'PhotoShop!' )
    ps_btn.setTarget_( app.delegate() )
    ps_btn.setAction_( "photoShop:" )

    il_btn = NSButton.alloc().initWithFrame_(((100.0, 10.0), (80.0, 80.0)))
    win.contentView().addSubview_(il_btn)
    il_btn.setBezelStyle_(6)
    il_btn.setTitle_('Illustrator')
    il_btn.setTarget_(app.delegate())
    il_btn.setAction_("illustrator:")

    sk_btn = NSButton.alloc().initWithFrame_(((190.0, 10.0), (80.0, 80.0)))
    win.contentView().addSubview_(sk_btn)
    sk_btn.setBezelStyle_(6)
    sk_btn.setTitle_('Sketch')
    sk_btn.setTarget_(app.delegate())
    sk_btn.setAction_("sketch:")

    # beep = NSSound.alloc()
    # beep.initWithContentsOfFile_byReference_( '/System/Library/Sounds/Tink.Aiff', 1 )
    # ps_btn.setSound_( beep )

    bye = NSButton.alloc().initWithFrame_ (((280.0, 10.0), (80.0, 80.0)))
    win.contentView().addSubview_ (bye)
    bye.setBezelStyle_( 4 )
    bye.setTarget_ (app)
    bye.setAction_ ('stop:')
    bye.setEnabled_ ( 1 )
    bye.setTitle_( 'Quit!' )

    # adios = NSSound.alloc()
    # adios.initWithContentsOfFile_byReference_(  '/System/Library/Sounds/Basso.aiff', 1 )
    # bye.setSound_( adios )

    win.display()
    win.orderFrontRegardless()          ## but this one does

    AppHelper.runEventLoop()


if __name__ == '__main__' :
    main()