var fetch = require('node-fetch');
var callback = (err, output) => {
  console.log('RESULT: ' + JSON.stringify(output));
  console.log('error: ' + JSON.stringify(err));
}
const firstReminderHours = process.env.FIRST_REMINDER_HOURS || 2;

let userToNotifyAdresses = {};
process.env.USERS.split(',').forEach(userAndAddress => {
  userAndAddressArray = userAndAddress.split(':');
  userToNotifyAdresses[userAndAddressArray[0]] = userAndAddressArray[1];
});

function notifyByMail(recipient, hours, url, total) {
  var helper = require('sendgrid').mail;
  var from_email = new helper.Email('daniel-schreiber@gmx.de');
  var to_email = new helper.Email(recipient);
  var subject = '[lichess-notify] Games pending!';
  var content = new helper.Content('text/plain', `Game ready (${hours} hours left): ${url}\n\nTotal pending games: ${total}`);
  var mail = new helper.Mail(from_email, subject, to_email, content);
  
  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });
  
  sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
}

for (let user in userToNotifyAdresses) {
  let url = `https://lichess.org/api/user/${user}/games?playing=1`;
  let userId = user;
  let address = userToNotifyAdresses[user];
  fetch(url)
    .then(function(res) {
      return res.text();
    }).then(body => {
      console.log('user: ' + userId);
      console.log('response: ' + body);
      let json = JSON.parse(body);
      let openGames = json['currentPageResults']
        .filter(g => g.perf == 'correspondence')
        .filter(g => g.status == 'started')
        .filter(g => (new Date(g.lastMoveAt)).getTime() < Date.now() - (1000 * 60 * 60 * firstReminderHours))
        .filter(g => (g.turns % 2) == (g.players.white.userId == userId ? 0 : 1));

      if(openGames.length > 0) {
        let g = openGames[0];
        console.log('last move: ' + new Date(g.lastMoveAt));
        let timeLeftMs = new Date(g.lastMoveAt).getTime() - Date.now() + (g.daysPerTurn*24*60*60*1000);
        let timeLeftHours =  Math.floor(timeLeftMs / (1000 * 60 * 60));
        console.log('open game: ' + g.url);
        console.log('time left: ' + timeLeftHours);

        notifyByMail(address, timeLeftHours, g.url, openGames.length);
        callback(null, {gamesPending: openGames.length});
      } else {
        callback(null, {gamesPending: 0});
      }
    })
    .catch(callback);
}
