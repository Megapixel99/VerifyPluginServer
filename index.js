const app = require('express')();
const bodyParser = require('body-parser');

app.set('json spaces', 2);
app.use(require('helmet')());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(require('./router.js'));

app.use((req, res) => {
  res.status(404);

  if (req.accepts('json')) {
    res.json({
      status: 404,
      message: 'Page Not found',
    });
    return;
  }

  res.type('txt').send('Page Not found');
});

app.listen(3000);
