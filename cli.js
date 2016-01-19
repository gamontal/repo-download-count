var program = require('commander');
var chalk = require('chalk');
var ghUsername, ghRepo;

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var xmlHttp;
var httpGet = function(url) {
  xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', url, false);
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
};

module.exports = repoDc = {
  setUsername: function (username) { ghUsername = username; },
  setRepo: function (repository) { ghRepo = repository; },

  getDownloadCount: function (username, repo) {
    var url = 'https://api.github.com/repos/' + username + '/' + repo + '/releases/latest';
    var resp = httpGet(url);

    if (resp.message === 'Not Found') {
      return chalk.red('No releases for this repository');
    } else {
      return 'Downloads: ' + resp.assets[0].download_count;
    }
  }
};

program
  .version(require('./package').version)
  .description('')
  .option('-u, --user <username>', 'GitHub username', repoDc.setUsername)
  .option('-r, --repo <repoName>', 'GitHub repository name', repoDc.setRepo)
  .parse(process.argv);

if ((program.user) && (program.repo)) {
  console.log(repoDc.getDownloadCount(ghUsername, ghRepo));
} else {
  console.log('\ninvalid number of arguments');
  program.outputHelp();
  process.exit(0);
}
