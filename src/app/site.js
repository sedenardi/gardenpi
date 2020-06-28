let status;
const PUMP_NODES = { };

const postReq = function(url, pumpName) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ pumpName })
  });
};

const getPumpInfo = function(pumpName) {
  return status && status.pumps && status.pumps[pumpName];
};

const setupPump = function(pumpName) {
  let row = document.getElementById(pumpName);
  if (row) {
    return;
  }

  const pumpControl = document.querySelector('#templates')
    .querySelector('.pump')
    .cloneNode(true);
  pumpControl.id = pumpName;
  document.querySelector('#controls').appendChild(pumpControl);
  row = document.getElementById(pumpName);

  PUMP_NODES[pumpName] = {
    row: row,
    name: row.querySelector('.pump-name'),
    description: row.querySelector('.pump-description'),
    btnOn: row.querySelector('.pump-turn-on'),
    btnOff: row.querySelector('.pump-turn-off'),
    status: row.querySelector('.pump-status')
  };
  PUMP_NODES[pumpName].name.innerText = `${pumpName}:`;
  PUMP_NODES[pumpName].btnOn.addEventListener('click', async () => {
    const pumpInfo = getPumpInfo(pumpName);
    if (!pumpInfo) { return; }
    try {
      await postReq('/pump/on', pumpName);
      await fetchStatus();
    } catch(err) {
      console.log(err);
    }
  });
  PUMP_NODES[pumpName].btnOff.addEventListener('click', async () => {
    const pumpInfo = getPumpInfo(pumpName);
    if (!pumpInfo) { return; }
    try {
      await postReq('/pump/off', pumpName);
      await fetchStatus();
    } catch(err) {
      console.log(err);
    }
  });
};

const setupPumps = function() {
  if (!status) {
    return;
  }
  Object.keys(status.pumps).forEach(setupPump);
};

const displayDuration = function(duration) {
  const diff = Math.floor(duration / 1000);
  const hours = Math.floor(diff / 60 / 60);
  const min = Math.floor(diff / 60) % 60;
  const sec = diff % 60;
  return `${hours}h ${min}m ${sec}s`;
};

const refreshPump = function(pumpName) {
  const pumpInfo = getPumpInfo(pumpName);
  if (!pumpInfo) { return; }
  const nodes = PUMP_NODES[pumpName];
  if (pumpInfo.started) { // pump is on
    nodes.row.classList.add('on');
    nodes.btnOn.disabled = true;
    nodes.btnOff.disabled = false;
    nodes.status.innerText = `Pump has been on for ${displayDuration(Date.now() - pumpInfo.started)}.`;
  } else { // pump is off
    nodes.row.classList.remove('on');
    nodes.btnOn.disabled = status.pumpLimitHit;
    nodes.btnOff.disabled = true;
    if (pumpInfo.lastRun) {
      const ago = displayDuration(Date.now() - pumpInfo.lastRun.started);
      const howLong = displayDuration(pumpInfo.lastRun.ended - pumpInfo.lastRun.started);
      nodes.status.innerText = `Last run ${ago} ago for ${howLong}.`;
    } else {
      nodes.status.innerText = '';
    }
  }
  if (pumpInfo.description) {
    nodes.description.innerText = pumpInfo.description;
  }
};

const refreshPumps = function() {
  Object.keys(status.pumps).forEach(refreshPump);
  
  const debugInfo = JSON.stringify(status, null, 2);
  document.getElementById('status').innerText = debugInfo;
};

const fetchStatus = async function() {
  try {
    const res = await fetch('/pumps');
    status = await res.json();
    setupPumps();
    refreshPumps();
  } catch(err) {
    console.log(err);
  }
};

window.addEventListener('load', () => {
  fetchStatus();
  setInterval(() => {
    fetchStatus();
  }, 2000);
});
