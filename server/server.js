const express = require("express"); /* import express */

const app = express(); /* construtor do express  */

const mysql = require("mysql");

const cors = require("cors"); /* serve para poder fazer ligaçao com outras portas */

const jwt = require("jsonwebtoken"); /* permite me a utilizacao dos tokens*/

app.use(cors());
app.use(express.json());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
/* permite interpretar o body do resquest */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "react",
});

db.connect();
/* processo de conexao a db */

app.listen(5000);

app.post("/register", (req, res) => {
  db.query(
    "INSERT INTO users (email,password) VALUES (?,?)",
    [req.body.email, req.body.password],
    (err, result) => {
      if (err) console.log(err);
      else {
        console.log("USER ADDED INTO THE DATABASE");
        res.status(201).send("USER ADDED");
      }
    }
  );
});



app.post("/send",(req, res) =>{
  db.query(
    "INSERT INTO mensagens (user_name,mensagem)  VALUES (?,?)",
    [req.body.name, req.body.message],
    async function(err, result){
      if (err) console.log(err);
      else {
        var payload={
          notification: {
            title: req.body.name,
            body: req.body.message,
          },
          data: {
            message: req.body.name + ':' + req.body.message,
          },
        };
        console.log("MESSAGE ADDED INTO THE DATABASE");
        var teste= await sendMessage(registrationToken,payload);
        res.status(201).send(teste);
        //console.log(teste);
      }
    });
});

app.post("/login", (req, res) => {
  db.query(
    "SELECT * FROM `users` WHERE email = ?",
    [req.body.email],
    (err, result) => {
      if (err) console.log(err);
      else {
        if (result[0].password === req.body.password) {
          const token = jwt.sign(JSON.stringify(result[0]), "root");
          console.log("User Confirmed");
          console.log(result[0].email);
          res.status(200).send({ token: token });
        } else {
          console.log("User nao encontrado");
        }
      }
    }
  );
});

app.get("/getUsers", (req, res) => {
  db.query("SELECT * FROM users",(err,result) => {
    res.json({result:result});
  })
})

app.get("/getTasks", (req, res) => {
  db.query("SELECT task as title,inicio as start,fim as end FROM tasks",(err,result) => {
    res.json({result:result});
  })
})

app.get("/getmessages", (req, res) => {
  db.query("SELECT * FROM mensagens", (err, result) => {
    res.json({ result: result });
  });
});

/* funcçao que permite verificar a token */
app.get("/isUserAuth", authenticateToken, (req, res) => {
  res.json({
    authenticated: true,
    message: "User is authenticated",
    user: req.user,
  });
});

// Middleware function to verify if the token is valid
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "root", (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Token is not valid" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
}

var admin = require("firebase-admin");

var serviceAccount = require("./fir-cloudmessaging-a3d42-firebase-adminsdk-rkrf7-c3ccf8ca51.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//const firebaseDb=admin.firestore();
var registrationToken ='egV7ttGiP-ifiNnppI70CN:APA91bF741ZldL21fNjjXKgKOLtJ6wBEaqq-uWYXxgCICT-BRL6HpvLtvrRMPDkydB0KER0DNfENy6vgeCTaLLKjdwFvCh1rCYlveJL1yj2yxjJ-qVwt5kQZYA1P1PewEN17cSvxdHMd';

const uid = '164348972392';
admin
  .auth()
  .createCustomToken(uid)
  .then((customToken) => {
    //sendMessage(customToken);
  })
  
  .catch((err) => {
    console.log(err);
  });

var options = {
  priority: "normal",
  timeToLive: 60 * 60
};

var message={
  data:{
    mensagem: "new message added to the data base"
  },
  token:registrationToken
};

function sendMessage (customToken,payload){
return new Promise(function (resolve, reject) {admin.messaging().sendToDevice(customToken,payload,options)
  .then(function(response) {
    console.log("Successfully sent message:");
    resolve('valido');
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
    reject('invalido');
  });
})
}
