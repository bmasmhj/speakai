// importing express
const express = require('express'); 
// dotenv config
require('dotenv').config();
const app = express();
const http = require("http");
const server = http.createServer(app);
const axios = require('axios');
const bodyParser = require("body-parser");
const router = require('./route.js');
const {getallmychat , get_trained , add_chatbotmsg , train_to_db} = require('./controller.js');
//importing socket io
const { Server } = require("socket.io");
const io = new Server(server , {
    cors: {
      origin: '*',
    },
  });
const compromise = require('compromise');
// @nlp-basic dock 
app.use(express.static("public"));
// adding cors
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.get("/",  (req,res)=>{
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/login",  (req,res)=>{
    res.sendFile(__dirname + "/public/login.html");
});

app.use('/api', router);

const { dockStart } = require('@nlpjs/basic');

async function startNLP(){
    const dock = await dockStart({ use: ['Basic']});
    const nlp = dock.get('nlp');
    get_trained(async function (result) {
        const trained_data = JSON.parse(result);
    
        const corpus = {
          "name": "Corpus",
          "locale": "en-US",
          "data": trained_data
          };
        await nlp.addCorpus(corpus);
        await nlp.train();

        // function to calculate accuracy
        async function calculate_accuracy(){
          const testData = [
            { utterance: "hello friend", classification: "greetings.hello" },
            { utterance: "what is your age", classification: "agent.age" },
            { utterance: "I don't like you ", classification: "agent.bad" },
            { utterance: "go learn more", classification: "agent.beclever" },
            { utterance: "Who is your Boss", classification: "agent.boss" },
            { utterance: "please help me", classification: "agent.canyouhelp" },
            { utterance: "you mad boy", classification: "agent.crazy" },
            { utterance: "now you're dismissed", classification: "agent.fire" },
            { utterance: "you very good", classification: "agent.good" },
            { utterance: "you happy ?", classification: "agent.happy" },
            { utterance: "tell me your hobby", classification: "agent.hobby" },
            { utterance: "you hungry ?", classification: "agent.hungry" },
            { utterance: "what is your work", classification: "agent.occupation" },

          ];
          
          let correctPredictions = 0;
          let score = 0;
          let falseNegatives = 0;
          let falsePositives = 0;
          let trueNegatives = 0;
          let truePositives = 0;
          
          // Evaluate the model

          for (const data of testData) {
            const response = await nlp.process('en', data.utterance);
            const predictedIntent = response.intent;
            const predictedScore = response.score;
            // Check accuracy
            if (predictedIntent === data.classification) {
              correctPredictions++;
              truePositives++;
            }
            else {
              if(predictedIntent == 'None'){
                falseNegatives++;
              }
              else{
                falsePositives++;
              }
            }
            console.log(predictedScore + " " + predictedIntent)
            // add score 
            score = score + predictedScore;
          } 
          // Calculate accuracy,  precision  , recall , f1
          const accuracy = (correctPredictions / testData.length) * 100;
          const scores = (score / testData.length) * 100;
          const precision = (truePositives / (truePositives + falsePositives));
          const recall = (truePositives / (truePositives + falseNegatives));
          const f1 = (2 * precision * recall) / (precision + recall);
          console.log(`Accuracy : ${accuracy.toFixed(2)}%`);
          console.log(`Score : ${scores.toFixed(2)}%`);
          console.log(`Precision : ${precision.toFixed(2)}`); 
          console.log(`Recall : ${recall.toFixed(2)}`);
          console.log(`F1 : ${f1.toFixed(2)}`);
        }
       await calculate_accuracy();
      });
      async function retrain(){
        get_trained(async function (result) {
         const trained_data = JSON.parse(result);
         const corpus = {
           "name": "Corpus",
           "locale": "en-US",
           "data": trained_data
           };
         await nlp.addCorpus(corpus);
         await nlp.train();
       });
       }

       

    io.on("connection", (socket) => {
        socket.on("getmsg" , (uid) => {
            console.log(uid);
            getallmychat(function(result){
                socket.emit("getmsg", result);
            }
            , uid);
        })
        // on client msg
        socket.on("message", (msge) => {
            var msg = msge.message;
            var uid = msge.uid;
            if(msg.trim() == ""){
                socket.emit("message", "Hmm I didn't get you. Can you please say it again?");
            }else{
                add_chatbotmsg( uid , msg , 'outgoing' , new Date());
                // getting reply from nlp
                nlp.process('en' , msg).then(result => {
                    var replyText = result.answer 
                    if(replyText == 'websearch'){
                        // searching answer in web
                        axios.get('https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q='+msg+'&limit=10')
                        .then(response => {
                            var exdata = removeHtmlTags(response.data.pages[0].excerpt);
                            var desc = removeHtmlTags(response.data.pages[0].description);
                            const correctedText = exdata+ ' '+desc +'.';
                            socket.emit("message", correctedText);

                            var docx = compromise(msg);
                                var json = JSON.stringify(docx.nouns().text());
                                var intent = json.toLowerCase().trim().replaceAll('"', '').replaceAll(' ', '');
                                console.log(`Intent = ${intent} , utterances = ${msg} , answer =  ${correctedText}`)
                                nlp.addDocument('en', msg , `question.${intent}`);
                                nlp.addAnswer('en', `question.${intent}`, correctedText);
                                nlp.train();
                                var domain_id = 5;
                                train_to_db( domain_id , intent , msg , correctedText);
                                add_chatbotmsg( uid , correctedText , 'incoming' , new Date());

                            })
                    }else{
                        socket.emit("message", replyText);
                        add_chatbotmsg( uid , replyText , 'incoming' , new Date());
                    }
                    // adding msg to db
                })
            }
           
        });
        socket.on("restart-bot" , (data) => {
            retrain();
            random = Math.floor(Math.random())
            socket.emit("bot-restarted", random);
          });
        
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
}

function removeOutermostParentheses(inputString) {
    const parenthesesPattern = /\([^()]*\)/g;
  
    // Recursive function to remove the outermost set of parentheses
    function removeOutermost(input) {
      const match = input.match(parenthesesPattern);
      if (match) {
        const innerText = match[0].slice(1, -1); // Remove the outer parentheses
        const replaced = input.replace(match[0], removeOutermost(innerText));
        return replaced;
      }
      return input;
    }
  
    // Remove the outermost set of parentheses from the input string
    const cleanedString = removeOutermost(inputString);
  
    return cleanedString;
  }
  
  
  function removeHtmlTags(inputString) {
    // Regular expression to match HTML tags
    const htmlTagPattern = /<[^>]*>/g;
    
    // Regular expression to match content inside parentheses
    const parenthesesPattern = /\([^)]*\)/g;
  
    // Remove HTML tags from the input string
    let cleanedString = inputString.replace(htmlTagPattern, '');
    
    // Remove content inside parentheses from the updated string
    cleanedString = removeOutermostParentheses(cleanedString);
    cleanedString =  cleanedString.replace(parenthesesPattern , '');
    return cleanedString;
  }
  

startNLP();


server.listen(3000, () => {
    console.log("listening on *:3000");
})