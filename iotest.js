const io = require('./src/io');
const { wait } = require('./src/util');

const singlePumpTest = async function() {
  try {
    io.setup();

    await wait(2000);
    console.log('turning on pump 1');
    io.turnOn('pump_1');

    await wait(2000);
    console.log('turning off pump 1');
    io.turnOff('pump_1');
  } catch(err) {
    console.log(err);
  }
  io.turnAllOff();
};

const multiPumpTest = async function() {
  try {
    io.setup();

    await wait(2000);
    console.log('turning on pump 1');
    io.turnOn('pump_1');

    await wait(2000);
    console.log('turning on pump 2');
    io.turnOn('pump_2');

    await wait(2000);
    console.log('turning off pump 1');
    io.turnOff('pump_1');

    await wait(2000);
    console.log('turning off pump 2');
    io.turnOff('pump_2');
  } catch(err) {
    console.log(err);
  }
  io.turnAllOff();
};

const maxPumpTest = async function() {
  try {
    io.setup();
    
    await wait(2000);
    console.log('turning on pump 1');
    io.turnOn('pump_1');
    
    await wait(2000);
    console.log('turning on pump 2');
    io.turnOn('pump_2');
    
    await wait(2000);
    console.log('turning on pump 3');
    io.turnOn('pump_3');
  } catch(err) {
    console.log(err);
  }
  io.turnAllOff();
};

maxPumpTest();
