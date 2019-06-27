const rpio = require('rpio');
const config = require('../config.json');

const options = {
  gpiomem: true,
  mapping: 'physical',
  mock: config.rpio_mock
};
rpio.init(options);

const MAX_PUMPS = 2;

const pumps = { ...config.pumps };

const getPumpsStarted = function() {
  const numStarted = Object.keys(pumps)
    .filter((pumpName) => pumps[pumpName].started);
  return numStarted;
};

const checkMaxPumps = function() {
  const pumpsStarted = getPumpsStarted();
  if (pumpsStarted.length === MAX_PUMPS) {
    throw new Error(`Maximum number of pumps already running: ${pumpsStarted.join(', ')}.`);
  }
};

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
  checkMaxPumps();
  if (pump.started) {
    throw new Error(`Pump ${pumpName} already running.`);
  }
  rpio.open(pump.pin, rpio.OUTPUT, rpio.LOW);
  pump.started = Date.now();
};

const turnAllOff = function() {
  for (const pumpName in pumps) {
    turnOff(pumpName);
  }
};

module.exports = {
  turnOff,
  turnOn,
  turnAllOff,
  setup: turnAllOff
};
