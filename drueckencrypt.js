var child_process = require('child_process');

function renewCerts(domains, callback) {
  //var domains = array of domains to be renewed
  var domainArg = domains.join(" -d ");
  var letsEncryptArg = "/root/letsencrypt/letsencrypt-auto certonly --renew-by-default -d " + domainArg;

  child_process.execSync(letsEncryptArg);
  callback();

}
function nginx() {
  this.start = function() {
    child_process.execSync(service nginx start);
    console.log("nginx started");

  };
  this.stop = function() {
    child_process.execSync(service nginx stop);
    console.log("nginx stoped");

  };

}
