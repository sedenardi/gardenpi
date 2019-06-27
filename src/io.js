const rpio = require('rpio');
const config = require('../config.json');

const options = {
  gpiomem: true,
  mapping: 'physical',
  mock: config.rpio_mock
};
rpio.init(options);

const pumps = { ...config.pumps };

const turnOff = function(pumpName) {
  const pump = pumps[pumpName];
  if (!pump) {
    throw new Error(`Pump ${pumpName} doesn't exist.`);
  }
  rpio.open(pump.pin, rpio.OUTPUT, rpio.HIGH);
  if (pump.started) {
    pump.lastRun = {
      started: pump.started,
      ended: Date.now()
    };
  }
  pump.started = null;
};

const turnOn = function(pumpName) {
  const pump = pumps[pumpName];
  if (!pump) {
    throw new Error(`Pump ${pumpName} doesn't exist.`);
  }
  if (pump.started) {
    throw new Error(`Pump ${pumpName} already running.`);
  }
  rpio.open(pump.pin, rpio.OUTPUT, rpio.LOW);
  pump.started = Date.now();
};

const setup = function() {
  for (const pumpName in pumps) {
    turnOff(pumpName);
  }
};

module.exports = {
  turnOff,
  turnOn,
  setup
};
