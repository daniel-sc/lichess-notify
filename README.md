# lichess-notify

This is a simple notification service for pending games on [lichess](https://lichess.org).
It can be deployed on [Heroku](https://heroku.com) and should be run with the [heroku scheduler](https://devcenter.heroku.com/articles/scheduler) and hence only uses minimal dyno-hours (rather seconds ;-)).

## Deploying to Heroku

```
heroku create
git push heroku master
heroku config:set USERS=lichessuser:notification@mail.com;another_lichess_user:other@mail.com
heroku config:set FIRST_REMINDER_HOURS=2 # optional
heroku addons:create scheduler:standard 
heroku addons:open scheduler # opens browser - configure job with command "node index.js"
heroku addons:create sendgrid:starter
heroku addons:open sendgrid # opens browser - create (and remember) sendgrid api key
heroku config:set SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY # see line above
```
or

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

+ configure correct env `SENDGRID_API_KEY` and scheduler as described above.
