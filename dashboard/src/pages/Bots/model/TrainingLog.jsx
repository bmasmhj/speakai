import { socket } from "../../Dashboard/socket";
import Instance from "../../../axios";

export default function Console({name}){
    function restartbot(){
      var train_in = document.getElementById("train_in");
      train_in.innerHTML = `<span class="output-cmd">Getting Entities</span>`;
      Instance.post('/bot/entities' ).then((response) => {
        train_in.innerHTML += `<span class="output-cmd">Starting Training</span>`;
        console.log(response.data);
        var e = 0;
        const entityenterval = setInterval(() => {
          train_in.innerHTML += `<span  class="output-cmd">Training : ${response.data[e].domain_name}.${response.data[e].intent_name}</span>`;
          e++;
          if(e === response.data.length){
            clearInterval(entityenterval);
            finishitup();
          }
        }
        , 10);

        function finishitup(){
          train_in.innerHTML += `<span class="output-cmd">Finalizing Training</span>`;
          socket.emit("restart-bot", 'restart');
        }

        socket.on("bot-restarted", (data) => {
          console.log(data);
          train_in.innerHTML += `<span class="output-cmd">Training Completed</span>`;
          setTimeout(() => {
            train_in.innerHTML = ``;
          }, 3000);
        });
        function timer(newid){
          var perc = 0;
          const perinterval = setInterval(() => {
            perc++ ;
            document.getElementById(newid).innerHTML = `${perc}%`;
            if(perc == 100){
              clearInterval(perinterval);
              document.getElementById(newid).innerHTML = `Completed ✔`; 
            }
          }, 10);
        }
      })
    }
    return(
        <>
          <div className="d-flex justify-content-between">
                <h5>Training Log</h5>        <button className="btn bg-gradient-success text-white border-0 " onClick={()=>restartbot()}>Start Training</button>
        </div>
        <div id="console">
            <div className="console p-0">
                <div className="console">
                    <div className="console-inner">
                        <div id="outputs">
                            Training Console
                        </div>
                        <div id="train_in">
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}