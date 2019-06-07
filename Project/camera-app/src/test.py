#coding=UTF-8

import sys
from pynput.keyboard import Key, Controller

def switch(arg):
    switcher = {
        'down': Key.down,
        'up': Key.up,
        'left': Key.left,
        'right': Key.right,
        'ctrl': Key.ctrl,
        'shift': Key.shift,
        'space': Key.space,
        'tab': Key.tab,
        'alt': Key.alt,
        'enter': Key.enter,
        'delete': Key.delete,
        'esc': Key.esc,
        'backspace': Key.backspace
    }
    return switcher.get(arg, arg)

keyboard = Controller()
key = switch(sys.argv[1])
keyboard.press(key)
keyboard.release(key)