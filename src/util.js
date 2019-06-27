module.exports.wait = function(ms) {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(ms); }, ms);
  });
};
