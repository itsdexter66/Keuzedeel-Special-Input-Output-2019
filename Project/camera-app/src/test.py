#coding=UTF-8

import sys
from pynput.keyboard import Key, Controller

keyboard = Controller()
keyboard.press(sys.argv[1])
keyboard.release(sys.argv[1])