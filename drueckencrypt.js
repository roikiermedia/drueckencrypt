var fs = require('fs');
var child_process = require('child_process');

var letsEncrypt = "/root/letsencrypt/letsencrypt-auto";
var nginxConfPath = "/etc/nginx/conf.d/";

function renewCerts(domains) {
  //var domains = array of domains to be renewed
  if (domains == null) {
    //skip cert renewel w/ unsupported confs
    console.log("Skipping this Conf.");
  }
  else {
    var domainArg = domains.join(" -d ");
    var letsEncryptArg = letsEncrypt + " certonly --renew-by-default -d " + domainArg;

    child_process.execSync("service nginx stop");
    child_process.execSync(letsEncryptArg);
    child_process.execSync("service nginx start");

    console.log("Cert issued.");

  }

}

function parseDomains(nginxConf, callback) {
  //search "server_name example.com www.example.com" and extract domains
  //var nginxConf = string of single site conf
  var start = (nginxConf.indexOf("server_name") + 12);
  var end = (nginxConf.indexOf(";", start));

  if (nginxConf.indexOf("server_name") == -1) {
    //ignore all confs w/o domains
    var domains = null;
    callback(domains);

  }
  else {
    var server_name = nginxConf.substring(start, end);
    var domains = server_name.split(" ");

    if (server_name.indexOf("*") != -1) {
      //ignore all confs w/ unsupported wildcard domains
      console.log("Confs with Wildcard Domains (*.example.com) are ignored. Remove all Wildcards and restart the process.");
      var domains = null;
      callback(domains);

    }
    else {
      console.log("Domains:");
      domains.forEach(logArray);

      callback(domains);

    }

  }

}

function logArray(element, index) {
  console.log(element);
}

function main() {
  var nginxConfs = fs.readdirSync(nginxConfPath);

  console.log("nginx SiteConfs:");
  nginxConfs.forEach(logArray);

  nginxConfs.forEach(function (element, index) {
    fs.readFile(nginxConfPath + element, "utf8", function (err, data) {
      if (err) throw err;
      parseDomains(data, renewCerts);

    });

  });

}

main();
