const express = require('express');
const bodyParser = require("body-parser");
//Importamos la librería de mailchimp, previamente descargada con npm
const mailchimp = require("@mailchimp/mailchimp_marketing");

require('dotenv').config({path: 'vars/.env'});
const MAILCHIMP_APIKEY = process.env.MAILCHIMP_APIKEY;
const LIST_ID = process.env.LIST_ID;
const port = 3000;

const app = express();

//Declaramos que la carpeta public manejará todos nuestros archivos estaticos
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    // nos autenticamos con mailchimp
    mailchimp.setConfig({
        apiKey: MAILCHIMP_APIKEY,
        server: "us21",
    });

    
    //Enviamos los datos a mailchimp del nuevo usuario registrado
    const run = async () => {
        try {
            const response = await mailchimp.lists.setListMember(
                LIST_ID,
                "subscriber_hash",
                {
                    email_address: email,
                    status_if_new: "subscribed",
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
                }
            );
            res.sendFile(__dirname + "/success.html");
            // console.log(response);
        } catch (e) {
            res.sendFile(__dirname + "/failure.html");
            console.log(e);   
            console.log(e.status);   
        }
    };

    run();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// please do not forget to use your own API key as well as Audience key. Goodluck to all!