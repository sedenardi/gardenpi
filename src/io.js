const rpio = require('rpio');
const config = require('../config.json');

const options = {
  gpiomem: true,
  mapping: 'physical',
  mock: config.rpio_mock
};
rpio.init(options);

const pumps = { ...config.io.pumps };
const MAX_SIMULTANEOUS_PUMPS = config.io.maxSimultaneousPumps;
const MAX_PUMP_RUNTIME = config.io.maxPumpRuntime;

const getPumpsStarted = function() {
  const numStarted = Object.keys(pumps)
    .filter((pumpName) => pumps[pumpName].started);
  return numStarted;
};

const checkMaxPumps = function() {
  if (!MAX_SIMULTANEOUS_PUMPS) { return; }
  const pumpsStarted = getPumpsStarted();
  if (pumpsStarted.length === MAX_SIMULTANEOUS_PUMPS) {
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

const getStatus = function() {
  return {
    pumps: { ...pumps },
    pumpLimitHit: config.io.maxSimultaneousPumps === getPumpsStarted().length
  };
};

const setup = function() {
  turnAllOff();

  if (!MAX_PUMP_RUNTIME) { return; }
  setInterval(() => {
    Object.keys(pumps).forEach((pumpName) => {
      const pump = pumps[pumpName];
      if (!pump.started) { return; }
      const runtime = Date.now() - pump.started;
      if (runtime > MAX_PUMP_RUNTIME) {
        turnOff(pumpName);
      }
    });
  }, 1000);
};

module.exports = {
  turnOff,
  turnOn,
  turnAllOff,
  setup,
  getStatus
};
