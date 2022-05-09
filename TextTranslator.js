const express = require('express');
const app = express();
const port= 3000;
const cors = require('cors');
const axios = require('axios').default;
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

//swagger object
const doc = {
    swaggerDefinition: {
        info: {
        version: "1.0.0",
        title: "Text Translator",
        description: "<b>Microsoft Azure Text Translator service via REST API Using Swagger Documentation</b>."
        },
    host: "142.93.52.32:3000",
    basePath: '/',
    },
    apis: ['./TextTranslator.js']
};

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const specs = swaggerJsdoc(doc);
app.use('/docs',swaggerUi.serve, swaggerUi.setup(specs));

//Azure Key, Location and endpoint
const Key = "Azure Subscription Key";
const location = "eastus";
const endpoint = "https://api.cognitive.microsofttranslator.com/";

app.get('/',(req,res)=>{
    res.send("Azure Text Translator");
})

/**
 * @swagger
 * /language:
 *    get:
 *      description: Get All Langauge codes
 *      produces: 
 *          - application/json
 *      responses:
 *          '200':
 *              description: successful operation
 *          '400':
 *              description: Invalid inputs
 *          '500':
 *              description: Server Error
 */

 app.get('/language', (req, res) => {
    axios({
        baseURL: endpoint,
        url: "/languages",
        method: "get",
        headers: {
            'Ocp-Apim-Subscription-Key': Key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            "api-version": "3.0",
        },
        responseType: 'json'
    }).then(function(response){
        console.log(JSON.stringify(response.data, null, 4));
        res.status(200).send(JSON.stringify(response.data, null, 4));
    }).catch((error)=>{
        if(error.message){
            res.status(400).send("Invalid Input");
        }else{
            res.status(500).send("Sever Error");
        }
    })
})


/**
 * @swagger
 * /api/convert:  
 *  post:
 *      description: Translate the given source language text into the target language text
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  from:
 *                    type: string
 *                  to:
 *                    type: array
 *                    items:
 *                      type: string
 *                    uniqueItems: true                 
 *                  text:   
 *                    type: string
 *              required:
 *                  - from
 *                  - to
 *                  - text
 *              example:
 *                 from: en
 *                 to: hi
 *                 text: Hello
 *      responses:
 *          '200':
 *              description: successful operation
 *          '400':
 *              description: Invalid inputs
 *          '500':
 *              description: Server Error
 */

//The Text Translation API translates text between language pairs across all supported languages 
app.post('/api/convert',(req,res)=>{
    axios({
        baseURL: endpoint,
        url: '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': Key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'from': req.body.from,
            'to': req.body.to
        },
        data: [{
            'text': req.body.text
        }],
        responseType: 'json'
    }).then(function(response){
        console.log(JSON.stringify(response.data, null, 4));
        res.status(200).send(JSON.stringify(response.data, null, 4));
    }).catch((error)=>{
        if(error.message){
            res.status(400).send("Invalid Input");
        }else{
            res.status(500).send("Sever Error");
        }
    })
})


/**
 * @swagger
 * /api/identify:
 *  post:
 *      description: Detect source language without translation
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:               
 *                  text:   
 *                    type: string
 *              required:
 *                  - text
 *              example:
 *                 text: Hello
 *      responses:
 *          '200':
 *              description: successful operation
 *          '400':
 *              description: Invalid inputs
 *          '500':
 *              description: Server Error
 */


//Detect source language without translation

app.post('/api/identify',(req,res)=>{
    axios({
        baseURL: endpoint,
        url: '/detect',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': Key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0'
        },
        data: [{
            'text': req.body.text
        }],
        responseType: 'json'
    }).then(function(response){
        console.log(JSON.stringify(response.data, null, 4));
        res.status(200).send(JSON.stringify(response.data, null, 4))      
    }).catch((error)=>{
        if(error.message){
            res.status(400).send("Invalid Inputs");
        }else{
            res.status(500).send("Server Error");
        }
    })
})


/**
 * @swagger
 * /api/senlength:
 *  post:
 *      description: Get sentence length with translation
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:   
 *                  to:
 *                    type: array
 *                    items:
 *                      type: string
 *                    uniqueItems: true             
 *                  text:   
 *                    type: string
 *              required:
 *                  -to
 *                  - text
 *              example:
 *                  to: es
 *                  text: Can you tell me how to get to Penn Station?
 *      responses:
 *          '200':
 *              description: successful operation
 *          '400':
 *              description: Invalid inputs
 *          '500':
 *              description: Server Error
 */



//Get sentence length during translation

app.post('/api/senlength',(req,res)=>{
    axios({
        baseURL: endpoint,
        url: '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': Key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'to': req.body.to,
            'includeSentenceLength': true
        },
        data: [{
            'text': req.body.text
        }],
        responseType: 'json'
    }).then(function(response){
        console.log(JSON.stringify(response.data, null, 4));
        res.status(200).send(JSON.stringify(response.data, null, 4))
    }).catch((error)=>{
        if(error.message){
            res.status(400).send("Invalid Inputs");
        }else{
            res.status(500).send("Server Error");
        }
    })
})


/**
 * @swagger
 * /api/length:
 *  post:
 *      description: Get sentence length without translation
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:                
 *                  text:   
 *                    type: string
 *              required:
 *                  - text
 *              example:
 *                  text: Can you tell me how to get to Penn Station?
 *      responses:
 *          '200':
 *              description: successful operation
 *          '400':
 *              description: Invalid inputs
 *          '500':
 *              description: Server Error
 */

//Getting sentence length without translation
app.post('/api/length',(req,res)=>{
    axios({
        baseURL: endpoint,
        url: '/breaksentence',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': Key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',           
        },
        data: [{
            'text': req.body.text
        }],
        responseType: 'json'
    }).then(function(response){
        console.log(JSON.stringify(response.data, null, 4));
        res.status(200).send(JSON.stringify(response.data, null, 4))
    }).catch((error)=>{
        if(error.message){
            res.status(400).send("Invalid Inputs");
        }else{
            res.status(500).send("Server Error");
        }
    })
})


/**
 * @swagger
 * /api/transliterate:  
 *  post:
 *      description: Map source language script or alphabet to a target language script or alphabet.
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  to:
 *                    type: array
 *                    items:
 *                      type: string
 *                    uniqueItems: true  
 *                  toScript:
 *                    type: string               
 *                  text:   
 *                    type: string
 *              required:
 *                  - to
 *                  - toScript
 *                  - text
 *              example:
 *                 to: th
 *                 toScript: latn
 *                 text: Hello
 *      responses:
 *          '200':
 *              description: successful operation
 *          '400':
 *              description: Invalid inputs
 *          '500':
 *              description: Server Error
 */

//Transliterate with translation

app.post('/api/transliterate',(req,res)=>{
    axios({
        baseURL: endpoint,
        url: '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': Key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'to': req.body.to,
            'toScript': req.body.toScript
        },
        data: [{
            'text': req.body.text
        }],
        responseType: 'json'
    }).then(function(response){
        console.log(JSON.stringify(response.data, null, 4));
        res.status(200).send(JSON.stringify(response.data, null, 4))
    }).catch((error)=>{
        if(error.message){
            res.status(400).send("Invalid Inputs");
        }else{
            res.status(500).send("Server Error");
        }
    })
})

/**
 * @swagger
 * /api/notransliterate:  
 *  post:
 *      description: Transliterate without translation.
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  language:
 *                    type: string
 *                  fromScript:
 *                    type: array
 *                    items:
 *                      type: string
 *                    uniqueItems: true  
 *                  toScript:
 *                    type: string               
 *                  text:   
 *                    type: string
 *              required:
 *                  - language
 *                  - fromScript
 *                  - toScript
 *                  - text
 *              example:
 *                 language: th
 *                 fromScript: thai
 *                 toScript: latn
 *                 text: สวัสดี
 *      responses:
 *          '200':
 *              description: successful operation
 *          '400':
 *              description: Invalid inputs
 *          '500':
 *              description: Server Error
 */



//Transliterate without translation

app.post('/api/notransliterate',(req,res)=>{
    axios({
        baseURL: endpoint,
        url: '/transliterate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': Key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'language': req.body.language,
            'fromScript': req.body.fromScript,
            'toScript': req.body.toScript
        },
        data: [{
            'text': req.body.text
        }],
        responseType: 'json'
    }).then(function(response){
        console.log(JSON.stringify(response.data, null, 4));
        res.status(200).send(JSON.stringify(response.data, null, 4))
    }).catch((error)=>{
        if(error.message){
            res.status(400).send("Invalid Inputs");
        }else{
            res.status(500).send("Server Error");
        }
    })
})

/**
 * @swagger
 * /api/dlookup:  
 *  post:
 *      description: Dictionary lookup (alternate translations)
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  from:
 *                    type: string
 *                  to:
 *                    type: array
 *                    items:
 *                      type: string
 *                    uniqueItems: true                 
 *                  text:   
 *                    type: string
 *              required:
 *                  - from
 *                  - to
 *                  - text
 *              example:
 *                 from: en
 *                 to: es
 *                 text: shark
 *      responses:
 *          '200':
 *              description: successful operation
 *          '400':
 *              description: Invalid inputs
 *          '500':
 *              description: Server Error
 */

//Dictionary lookup

app.post('/api/dlookup',(req,res)=>{
    axios({
        baseURL: endpoint,
        url: '/dictionary/lookup',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': Key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',     
            'from': req.body.from, 
            'to': req.body.to 
        },
        data: [{
            'text': req.body.text
        }],
        responseType: 'json'
    }).then(function(response){
        console.log(JSON.stringify(response.data, null, 4));
        res.status(200).send(JSON.stringify(response.data, null, 4))
    }).catch((error)=>{
        if(error.message){
            res.status(400).send("Invalid Inputs");
        }else{
            res.status(500).send("Server Error");
        }
    })
})

/**
 * @swagger
 * /api/dexamples:  
 *  post:
 *      description: Dictionary Examples
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  from:
 *                    type: string
 *                  to:
 *                    type: array
 *                    items:
 *                      type: string
 *                    uniqueItems: true                 
 *                  text:   
 *                    type: string
 *                  translation:
 *                     type: string
 *              required:
 *                  - from
 *                  - to
 *                  - text
 *                  - translation
 *              example:
 *                 from: en
 *                 to: es
 *                 text: shark
 *                 translation: tiburón 
 *      responses:
 *          '200':
 *              description: successful operation
 *          '400':
 *              description: Invalid inputs
 *          '500':
 *              description: Server Error
 */

//Dictionary examples

app.post('/api/dexamples',(req,res)=>{
    axios({
        baseURL: endpoint,
        url: '/dictionary/lookup',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': Key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',     
            'from': req.body.from, 
            'to': req.body.to
        },
        data: [{
            'text': req.body.text,
            'translation' : req.body.translation
        }],
        responseType: 'json'
    }).then(function(response){
        console.log(JSON.stringify(response.data, null, 4));
        res.status(200).send(JSON.stringify(response.data, null, 4))
    }).catch((error)=>{
        if(error.message){
            res.status(400).send("Invalid Inputs");
        }else{
            res.status(500).send("Server Error");
        }
    })
})



app.listen(port, () => {
    console.log(`Azure TextTranslator API listening at https://142.93.52.32:${port}`);
});



