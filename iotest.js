const io = require('./src/io');
const { wait } = require('./src/util');

(async function() {
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
})();
