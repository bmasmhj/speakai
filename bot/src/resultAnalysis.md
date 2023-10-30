data = DATA_FROM_DATASET 

// adding domains to db
data.forEach((item) => {
    let domain = item.intent.split('.')[0]
    if(!domains.includes(domain)){
        add_domain(domain)
    }
});

// adding intents to domain[intents]
domains.forEach((domain) => {
    domain_intent[domain] = []
    data.forEach((item) => {
        if(item.intent.split('.')[0] == domain){
            add_intent(domain , item.intent)
        }
    })
})

// adding utterances to domain[intent][utterances]
domains.forEach((domain) => {
    domain_utterances[domain] = {}
    domain_intent[domain].forEach((intent) => {
        domain_utterances[domain][intent] = []
        data.forEach((item) => {
            if(item.intent == intent){
                // add utterances to db
                item.utterances.forEach((utterance) => {
                    add_utterance(domain , intent , utterance)
                })
            }
        })
    })
})

// adding answers to domain[intent][answers]
domains.forEach((domain) => {
    domain_answers[domain] = {}
    domain_intent[domain].forEach((intent) => {
        domain_answers[domain][intent] = []
        data.forEach((item) => {
            if(item.intent == intent){
                // add answers to db
                item.answers.forEach((answer) => {
                    add_answer(domain , intent , answer)
                })
            }
        })
    })
})


async function calculate_accuracy(){
    const testData = [
      { utterance: "hello friend", classification: "greetings.hello" },
      { utterance: "what is your age", classification: "agent.age" },
      { utterance: "is your age 21", classification: "agent.age" },
      { utterance: "your age", classification: "agent.age" },
      { utterance: "how old are you", classification: "agent.age" },
      { utterance: "I don't like you ", classification: "agent.bad" },
      { utterance: "you should learn more", classification: "agent.beclever" },
      { utterance: "go learn more", classification: "agent.beclever" },
      { utterance: "Who is your Boss", classification: "agent.boss" },
      { utterance: "please help me", classification: "agent.canyouhelp" },
      { utterance: "are you robot", classification: "agent.chatbot" },
      { utterance: "are you crazy", classification: "agent.crazy" },
      { utterance: "you mad boy", classification: "agent.crazy" },
      { utterance: "now you're dismissed", classification: "agent.fire" },
      { utterance: "you very good", classification: "agent.good" },
      { utterance: "you happy ?", classification: "agent.happy" },
      { utterance: "tell me your hobby", classification: "agent.hobby" },
      { utterance: "you hungry ?", classification: "agent.hungry" },
      { utterance: "what is your work", classification: "agent.occupation" },
      { utterance: "what do you do", classification: "agent.occupation" },

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

