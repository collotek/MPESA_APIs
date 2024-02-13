const express = require('express');
const axios = require('axios');
const request = require('request')
const app = express();
const bodyParser = require('body-parser'); // Import body-parser module

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//routes
app.get('/', (req, res) => {
    res.send("You're home, Welcome")
});



const access = (req, res, next) => {
    //access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    const consumerKey = 'glNam1tlvvXoPQkRWOQa5qvzoecGpRUAuLr5LYG0gKsKhNeg';
    const consumerSecret = '5vz8QOASmSiqQ92oDnVLlmxS8oXrbfDO5dG54c95h4AP7S0NKJANlDF45UsNaZES';
    //Concatenate Consumer Key and Consumer Secret with a colon separator
    const credentials = `${consumerKey}:${consumerSecret}`;

    // Base64 encode the concatenated string
    const auth = Buffer.from(credentials).toString('base64');

    axios.get(url, {
        headers: {
            "Authorization": "Basic " + auth
        }
    })
        .then(response => {
            req.access_token = response.data.access_token;
            next()
        })

        .catch(error => {
            console.log(error);
            res.status(500).send("Internal Server Error");
        });

}
app.get('/access_token', access, (req, res) => {
    res.status(200).json({ access_token: req.access_token })
})
/*
app.get('/register', access, (req, resp)=>{
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer" + req.access_token

    request({
        url:url,
        method:"POST",
        headers: {"Authorization": auth},
        json: {
            "ShortCode": "600383",
            "ReponseType": "Complete",
            "ConfirmationURL": "http://197.254.50.242:801/confirmation",
            "ValidationURL": "http://197.254.50.242:801/validation_url"
        }

    },
    function (error, response, body){
        if (error) {console.log(error)}
        resp.status(200).json(body)
    })
})*/
app.get('/register', access, (req, res) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    let auth = "Bearer " + req.access_token;

    axios.post(url, {
        "ShortCode": "600383",
        "ResponseType": "Complete",
        "ConfirmationURL": "http://197.254.50.242:801/confirmation",
        "ValidationURL": "http://197.254.50.242:801/validation_url"
    }, {
        headers: {
            "Authorization": auth
        }
    })
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});
app.post('/validation', (req, res) => {
    console.log('Validation Request Body:', req.body)

})

app.post('/confirmation', (req, res) => {
    console.log('Confirmation Request Body:', req.body)

})
app.post('/validation', (req, res) => {
    console.log('Validation Request Body:', req.body)

})

app.get('/simulate', access, (req, res) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
    let auth = "Bearer " + req.access_token;

    axios.post(url, {
        ShortCode: "600982",
        CommandID: "CustomerPayBillOnline",
        Amount: "1",
        Msisdn: "254708374149",
        BillRefNumber: "lipa"
    }, {
        headers: {
            Authorization: auth
        }
    })
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});

app.get('/balance', access, (req, res) => {
    url = "https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query"
    auth = "Bearer " + req.access_token;

    axios.post(url, {
        "Initiator": "testapi",
        "SecurityCredential": "Xbw2AvnSvh0arLHjpDgmjbsfizVoMnZ7wGJpWIqM1ngIvTC6XU5nqOSVQJRzT8LMAKVcsAy0CfKLrLxN",
        "CommandID": "AccountBalance",
        "PartyA": "070033",
        "IdentifierType": "4",
        "Remarks": "please work",
        "QueueTimeOutURL": "https://mydomain.com/AccountBalance/queue/",
        "ResultURL": "https://mydomain.com/AccountBalance/result/",
    },
    {
        headers: { Authorization: auth }
    })
    .then(response =>{
        res.status(200).json(response.data)
        balanceInfo = response.data
        console.log(balanceInfo)
    }).catch(error=>{
        console.error(error);
        res.status(500).send("Internal Server Error");
    })
    
})
app.post('/timeout_url', (req, resp)=>{
    console.log('------- BalanceTimeOut Response -------')
    console.log(req.body)
})

app.post('/result_url', (req, resp)=>{
    console.log('------- Balance Response -------')
    console.log(req.body)
})
//listen
app.listen(8000, () => {
    console.log("Server running on port 8000");
});
// Route handler for M-Pesa confirmation URL

/*
app.listen(8000, (err, live) => {
    if (err) {
        console.error(err)
    }

    console.log("Server running on port 80")
});
*/