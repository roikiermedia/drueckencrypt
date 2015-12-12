var fs = require('fs');
var child_process = require('child_process');

var letsEncrypt = "/root/letsencrypt/letsencrypt-auto";
var nginxConfPath = "/etc/nginx/conf.d/";

function renewCerts(domains, callback) {
  //var domains = array of domains to be renewed
  var domainArg = domains.join(" -d ");
  var letsEncryptArg = letsEncrypt + " certonly --renew-by-default -d " + domainArg;

  child_process.execSync(letsEncryptArg);
  console.log("Cert issued.");

  callback();

}

function parseDomains(nginxConf, callback) {
  //search "server_name example.com www.example.com" and extract domains
  //var nginxConf = string of single site conf
  var start = (nginxConf.indexOf("server_name") + 12);
  var end = (nginxConf.substring(start).indexOf(";"));

  var server_name = nginxConf.substring(start, end);
  var domains = server_name.split(" ");

  console.log("Domains:");
  domains.forEach(logArray);

  callback(domains);

}

function nginx() {
  this.start = function() {
    child_process.execSync("service nginx start");
    console.log("nginx started");

  };
  this.stop = function() {
    child_process.execSync("service nginx stop");
    console.log("nginx stoped");

  };

}

function logArray(element, index) {
  console.log(element);
}

function main() {
  var nginxConfs = fs.readdirSync(nginxConfPath);

  console.log("nginx SiteConfs:");
  nginxConfs.forEach(logArray);

  nginx.stop;

  nginxConfs.forEach(function (element, index) {
    fs.readFile(nginxConfPath + element, "utf8", function (err, data) {
      if (err) throw err;
      parseDomains(data, renewCerts);

    });

  });

  nginx.start;
  console.log("Fin.");

}

main;
