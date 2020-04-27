### Set up environment
`npm install`

### Liner graph
`node service.js type=conversions period=weekly user_id=UID-zf5x8Do0DFzmiYVeGeVj width=830 height=270 output=graphfilename.png`

daily, weekly, monthly
### Map graph // TODO
`node service.js type=world_map period=weekly user_id=UID-zf5x8Do0DFzmiYVeGeVj width=830 height=270 output=graphfilename.png`

Params:

Report Type : [conversions|visitors|world_map]

user_id : the unique user ID from Adline DB

width and height - the size of the output graph in pixels

Period : [daily|weekly|monthly]; from current day - 1 and the subtract by by period

CONST daily = 1
CONST weekly = 7
VARIABLE monthly = check how many days in current month go back to the first day and calculate forward to current day - 1
