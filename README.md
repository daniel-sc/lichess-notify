# lichess-notify

This is a simple notification service for pending games on [lichess](https://lichess.org).
It can be deployed on [Heroku](https://heroku.com) and should be run with the [heroku scheduler](https://devcenter.heroku.com/articles/scheduler) and hence only uses minimal dyno-hours (rather seconds ;-)).

## Deploying to Heroku


[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

.. and configure scheduler as described above.

or manually:

```
heroku create
git push heroku master
heroku config:set USERS=lichessuser:notification@mail.com;another_lichess_user:other@mail.com
heroku config:set SENDER=your_sender@mail.com
heroku config:set NOTIFY_HOURS_FROM_LAST_MOVE=1,5,25
heroku config:set NOTIFY_HOURS_TO_END=0,1,3,5
heroku addons:create sendgrid:starter
heroku addons:create scheduler:standard 
heroku addons:open scheduler # opens browser - configure job with command "node index.js"
```
