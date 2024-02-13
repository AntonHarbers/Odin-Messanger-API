var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index_routes');
var usersRouter = require('./routes/user_routes');
var messagesRouter = require('./routes/message_routes');
var groupsRouter = require('./routes/group_routes');

var helmet = require('helmet');
var compression = require('compression');
var RateLimit = require('express-rate-limit');

require('dotenv').config();

var app = express();

// Rate Limiting
const limiter = RateLimit({
  windowsMs: 1 * 60 * 1000, // 1 minute
  max: 240,
});

//mongoose setup
mongoose.set('strictQuery', false);
const mongoDB = process.env.MOGNO_URL_DEV;

connectToDb().catch((err) => console.log(err));
async function connectToDb() {
  await mongoose.connect(mongoDB);
}

app.set('trust proxy', 1);

// Middleware chain
if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
} else {
  app.use(logger('combined'));
}

app.use(limiter);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self", 'code.jquery.com', 'cdn.jsdelivr.net'],
    },
  })
);
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Router setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/groups', groupsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
