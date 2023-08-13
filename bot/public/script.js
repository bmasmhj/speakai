const socket = io();

 function recognize() {
    $('#rec_btn').html(`Listening...`);
    $('#rec_btn').prop('disabled', true);

    var recognition = new ( window.SpeechRecognition 
    || window.webkitSpeechRecognition 
    || window.mozSpeechRecognition 
    || window.msSpeechRecognition)();

    var finalTranscript = ''; //initialize 

    recognition.interimResults = true; // Enable intermediate results
    recognition.onresult = function(event) {
        var interimTranscript = '';
        for (var i = event.resultIndex; i < event.results.length; i++) {
            var transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
    $('#input').removeClass('d-none')

        document.getElementById("input").innerHTML = interimTranscript;
         finalTranscript = event.results[0][0].transcript; 
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };
    recognition.start(); 
 
    recognition.onend = function() {
        console.log("You said: "+finalTranscript);
        if(finalTranscript.trim() == ""){
            speak("Hmm I didn't get you. Can you please say it again?");
            $('#rec_btn').html(`Start`);
            $('#rec_btn').prop('disabled', false);

        }else{
            $('#messages').append(`<div class="outgoing">
                                <p>${finalTranscript}</p>
                            </div>`);
            $('#rec_btn').html(`Processing...`);
            $('#input').addClass('d-none')
            socket.emit('message', {
                message: finalTranscript,
                uid: localStorage.getItem('access_id')
            });
        }
    };
}
function loaded(){
    setTimeout(()=> {
        $('.loading').addClass('d-none');
        $('.speaker').addClass('showup');
        checktutorial();
    }, 1000);
  }

socket.on('message', function(inputText) {
    $('#rec_btn').html(`Start`);
    $('#rec_btn').prop('disabled', false);
// disable button
    $('#input').addClass('d-none')
    if(inputText == 'null' || inputText == null){
        inputText = "Hmm I didn't get you. Can you please say it again?";
    }
    inputText = removeHtmlTags(inputText);
    speak(inputText);
});
if(!localStorage.getItem('access_token') || !localStorage.getItem('access_id')){
   
    window.location.href = '/login.html';
}else{
    socket.emit('getmsg', localStorage.getItem('access_id'));
}

socket.on('getmsg', function(result) {
    if(result.length > 0){
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            if(element.type == 'outgoing'){
                $('#messages').append(`<div class="outgoing">
                    <p>${element.message}</p>
                </div>`);
            }else{
                $('#messages').append(`<div class="incoming">
                    <p>${element.message}</p>
                </div>`);
            }
        }
    }
    $('#messages').scrollTop($('#messages').prop("scrollHeight"));

});

function speak(text){
    var voiceName = localStorage.getItem('voice');
    $('#messages').append(`<div class="incoming">
        <p>${text}</p>
    </div>`);
    // scroll to Bottom
    $('#messages').scrollTop($('#messages').prop("scrollHeight"));

    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.voice = window.speechSynthesis.getVoices()[voiceName];
    window.speechSynthesis.speak(msg);

}




function checktutorial(){
    setTimeout(() => {
    if(localStorage.getItem('tutorial')){
        console.log('tutorial already watched')
    }else{
        $('body').append(`
            <div class='popuup-main' >
            <div class="popuup">
                <!-- tutorial  -->
                <div id='clouseic' class="closeicon">
                    ❌ 
                </div>
            <div class="popup-inner">
                    <h5>Click Start or Press Space Bar to talk</h5>
            </div>
            </div>

            </div>`
        );
        $('#clouseic').click(function(){
            $('.popuup-main').remove();
            localStorage.setItem('tutorial', true);
        })
    }
    }, 1000);
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