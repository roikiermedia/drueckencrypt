var child_process = require('child_process');

var letsEncrypt = "/root/letsencrypt/letsencrypt-auto"

function renewCerts(domains, callback) {
  //var domains = array of domains to be renewed
  var domainArg = domains.join(" -d ");
  var letsEncryptArg = letsEncrypt + " certonly --renew-by-default -d " + domainArg;

  child_process.execSync(letsEncryptArg);
  callback();

}

function parseDomains(nginxConf, callback) {
  //search "server_name example.com www.example.com" and extract domains
  //var nginxConf = string of site conf in /etc/nginx/conf.d/
  var start = (nginxConf.indexOf("server_name") + 12);
  var end = (nginxConf.substring(start).indexOf(";"));

  var server_name = nginxConf.substring(start, end);
  var domains = server_name.split(" ");
  callback(domains);

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
