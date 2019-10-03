//===========================================
// SETUP A BASIC EXPRESS APP WITH MONGOOSE
//===========================================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const request = require("request");

//===========================================
// MIDDLEWARE
//===========================================
app.use(express.json());
app.use(express.static("public"));
app.use(
    session({
        secret: "helloworld",
        resave: false,
        saveUninitialized: false
    })
);

//===========================================
// CREATE CONSTANTS NECESSARY FOR OAUTH IN SERVER
//===========================================
const TOKEN_URL = "https://github.com/login/oauth/access_token";
const API_URL = "https://api.github.com/user";
const REDIRECT_URI = "http://localhost:3000/callback";

const CLIENT_ID = "6bd4fe34c7f29c380f10";
const CLIENT_SECRET = "30b43411eb36db905765f311bcac0e9ff6ab1496";

//===========================================
// FUNCTION TO GET DATA FROM GITHUB API
//===========================================
const getData = (res, req, access_token) => {
    request(
        {
            uri: `${API_URL}?access_token=${access_token}`,
            method: "GET",
            headers: {
                "User-Agent": "SampleOAuth"
            }
        },
        function(err, response, body) {
            console.log(body);
            req.session.currentUser = JSON.parse(body);
            res.redirect("/");
        }
    );
};

//===========================================
// ROUTES FOR SERVER - CALLBACK ROUTE
//===========================================
app.get("/callback", (req, res) => {
    const { code } = req.query;
    request(
        {
            uri: TOKEN_URL,
            method: "POST",
            form: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                redirect_uri: REDIRECT_URI
            }
        },
        function(err, response, body) {
            console.log(`Body is:`);
            console.log(body);
            //===========================================
            // RETRIEVE ACCESS TOKEN FROM BODY
            //===========================================
            const access_token = body.split("&")[0].split("=")[1];
            console.log(access_token);
            getData(res, req, access_token);
        }
    );
});

//===========================================
// SESSIONS ROUTE
//===========================================
app.get("/sessions", (req, res) => {
    res.json(req.session);
});

//===========================================
// SET UP APP LISTENER
//===========================================
app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});

mongoose.connect(
    "mongodb://localhost/githubOAuth",
    { useNewUrlParser: true }
);

mongoose.connection.once("open", () => {
    console.log(`mongoose connection has been established`);
});
