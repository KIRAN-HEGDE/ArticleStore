const express = require("express");
const path = require("path");
require('dotenv').config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const flash = require("connect-flash");
const expressMessages = require("express-messages");

// Initialise express instance.
const app = express();

//import the Article model
const article = require("./models/article");

//import session module
const session = require("express-session");

//connect to database
mongoose.connect("mongodb://localhost/articles");
let db = mongoose.connection;

// check connection
db.once("open", () => console.log("db connected/created"));

// if database error occurs
db.on("error", (error) => console.log(error));

// set view engine
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "pug");

//use  body parser
app.use(bodyParser.urlencoded({ extended: false }));

//use for json
app.use(express.json());

//Set Public folder
app.use(express.static(path.resolve(__dirname, "public")));

// Express session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// Express messages middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

// Express validator middleware

// Home route
app.get("/", (req, res) => {
  // fetch from data from the database using the find function
  article.find({}, (err, articles) => {
    //check for errors while finding the data
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles: articles,
      });
    }
  });
});

app.get("/articles/add", function (req, res) {
  res.render("add", {
    title: "Add Article",
  });
});

//Add submit post route
app.post(
  "/articles/add",
  body("title").custom((value) => {
    if (!value) return Promise.reject("Title  Field is Required");
    else return true;
  }),
  body("author").custom((value) => {
    if (!value) return Promise.reject("Author  Field is Required");
    else return true;
  }),
  body("body").custom((value) => {
    if (!value) return Promise.reject("Body  Field is Required");
    else return true;
  }),
  (req, res) => {
    const errors = validationResult(req);
    console.error(errors);
    if (!errors.isEmpty()) {
      res.render("add", {
        title: "Add Article",
        errors: errors.errors,
      });
    } else {
      let acl = new article();
      acl.title = req.body.title;
      acl.author = req.body.author;
      acl.body = req.body.body;

      acl.save((err) => {
        if (err) console.log(err);
        else {
          req.flash("success", "Article added!");
          res.redirect("/");
        }
      });
    }
  }
);

// Get single article
app.get("/article/:id", (req, res) => {
  article.findById(req.params.id, (err, acl) => {
    article.findOneAndUpdate(
      { _id: req.params.id },
      { meta: { visited: true } },
      (err, acl) => {
        if (err) console.log(err);
        else console.log("updated article with id: ", req.params.id, acl);
      }
    );
    res.render("article", {
      article: acl,
    });
    return;
  });
});

//Load edit form
app.get("/articles/edit/:id", (req, res) => {
  article.findById(req.params.id, (err, article) => {
    res.render("edit_article", {
      article: article,
    });
  });
});

//Provide Response when posted to edit
app.post("/articles/edit/:id", (req, res) => {
  let acl = {};
  acl.title = req.body.title;
  acl.author = req.body.author;
  acl.body = req.body.body;
  acl.meta = {};
  acl.meta.visited = false;

  let query = { _id: req.params.id };

  article.updateOne(query, acl, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

//delete an article
app.delete("/article/:id", (req, res) => {
  let query = { _id: req.params.id };

  article.deleteOne(query, (err) => {
    if (err) console.log(err);
    res.send("Success");
  });
});

//start the server
app.listen(3000, () => {
  console.log("Server started on : ", 3000);
});
