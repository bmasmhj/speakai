import 'quill/dist/quill.snow.css'; // For the Snow theme
import Quill from 'quill';
import { useEffect, useRef, useState } from 'react';
import Instance from '../../../axios';
import { useNotification } from '../../hook/useNotification';
export default function TrainedForm({name , domain , intent , onRefresh , refresh }){
    const { showNotificationMessage } = useNotification();
    const editorRef = useRef(null);
    const tagsRef = useRef(); 
    const [utterance , setutterance] = useState('');
    useEffect(() => {
        setutterance('');
        initialize();
    }, [name , domain , intent , refresh]);

      
    function initialize(){
        const tagsElement = tagsRef.current;
        document.getElementById("texteditor").innerHTML = '<div id="editor"></div>';
        let editorInitialized = false; // Flag variable to track initialization status
        if (!editorInitialized) {
          const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            ];
          
          const editor = new Quill('#editor', {
            theme: 'snow',
            modules: {
              toolbar: toolbarOptions
            }
          });
          appendbutton();
          editorInitialized = true;
          editorRef.current = editor;

        }
      
      }

      function appendbutton(){
            var btnstyle=`<button id='qlnewline' class="m-0 p-0 ql-custom ">N</button>`;
            document.getElementsByClassName('ql-toolbar')[0].children[0].innerHTML += btnstyle;
            document.getElementById('qlnewline').addEventListener('click', function() {
                var range = editorRef.current.getSelection(true);
                editorRef.current.insertText(range.index, '\n !----NEWLINE----! \n');
                editorRef.current.setSelection(range.index + 1);
            }
            );
      }

  
      function addutterances(){
        console.log(utterance)
        
        if(utterance.trim() === ''){
            document.getElementsByName('utterance')[0].classList.add('is-invalid');
            return false;
        }
        Instance.post('/bot/addutterances' , {
            domain_id : domain,
            intent_id : intent,
            utterance : utterance
        }).then((response) => {
            if(response.data.status === "success"){
                showNotificationMessage("Utterance Added Successfully")
                setutterance('');
                onRefresh();
            }
        })
      }

      function addanswer(){
        console.log(editorRef.current.root.innerHTML)
        if(domain.trim() === '' || domain == 0 ){
            showNotificationMessage("Please select domain")
            return false;
        }
        if(intent.trim() === '' || intent == 0 ){
            showNotificationMessage("Please select intent")
            return false;
        }
        if(editorRef.current.root.innerHTML.trim() === '' || editorRef.current.root.innerHTML.trim() === '<p><br></p>'){
            showNotificationMessage("Please add answer")
            return false;
        }
        Instance.post('/bot/addanswer' , {
            domain_id : domain,
            intent_id : intent,
            answer : editorRef.current.root.innerHTML
        }).then((response) => {
            if(response.data.status === "success"){
                showNotificationMessage("Answer Added Successfully")
                setutterance('');
                onRefresh();
            }
        })
      }
      function changeUtterance(e){
        setutterance(e.target.value);
        e.target.classList.remove('is-invalid');
      }
    return(
        <>
            <div>
                <label htmlFor="">Utterance</label>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" name='utterance' value={utterance} onChange={(e)=>changeUtterance(e)} placeholder="Utterance Eg: hello" />
                    <button className="btn bg-gradient-info border-0 text-white" onClick={addutterances}>Add Utterance</button>
                </div>
                <div>
                    <label htmlFor="">Answer</label>
                    <div id="texteditor"></div>
                    <div className='text-end'>
                        <button onClick={()=>addanswer()} className='btn bg-gradient-success border-0 text-white mt-2'>Add answer</button>
                    </div>
                </div>
            </div>
        </>
    )
}