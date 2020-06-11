/**
 * super tiny testing framework
 * 
 * @author Liu song <hi@lsong.org>
 * @github https://github.com/song940
 */

function color(str, c){
  return "\x1b[" + c + "m" + str + "\x1b[0m";
};

const describe = (title, suite) => {
  console.log(' - ', color(title, 36));
  suite();
  console.log();
};

let n = 0, e = 0;

const it = async (title, test) => {
  try {
    n++;
    await (test.length ? new Promise((resolve, reject) => {
      test(err => err ? reject(err) : resolve());
    }) : test());
    console.log(color(` ✔  ${title}`, 32));
  } catch (err) {
    e++;
    console.error(color(` ✘  ${title}`, 31));
    console.error();
    console.error(color(`   ${err.name}: ${err.message}`, 31));
    console.error(color(`   expected: ${err.expected}`, 32));
    console.error(color(`     actual: ${err.actual}`, 31));
    console.error();
  }
};

process.on('exit', () => {
  console.log();
  console.log(color(` All test case done (${n-e}/${n})`, e ? 31 : 32));
  console.log();
  if(e) process.exit(1);
});

module.exports = {
  describe,
  it
};