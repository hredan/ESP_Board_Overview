import re

test = "#define LED_BUILTIN    (13)"

matchBuildInLED = re.match(r"^.+ LED_BUILTIN +\((\d+)\)", test)
if matchBuildInLED:
    builtin_led_gpio = matchBuildInLED.group(1)
    print(builtin_led_gpio)
else:
    print("no match")