const chatBox=document.getElementById("chatBox");

const input=document.getElementById("userInput");

const sendBtn=document.getElementById("sendBtn");

const latest=document.getElementById("latestQuestion");

const endpoint="YOUR_CLOUDFLARE_WORKER_URL";

const messages=[

{

role:"system",

content:`

You are L'Oréal Beauty Assistant.

Only answer questions about:

-L'Oréal

-Skincare

-Makeup

-Haircare

-Fragrances

-Beauty routines

-Beauty recommendations

Politely refuse any unrelated questions.

Provide friendly, helpful responses.

`

}

];

function addMessage(text,type){

const div=document.createElement("div");

div.className=`message ${type}`;

div.innerHTML=text;

chatBox.appendChild(div);

chatBox.scrollTop=chatBox.scrollHeight;

}

async function sendMessage(){

const question=input.value.trim();

if(question==="")return;

latest.innerHTML=`Your Question: ${question}`;

addMessage(question,"user");

messages.push({

role:"user",

content:question

});

input.value="";

try{

const response=await fetch(endpoint,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

messages

})

});

const data=await response.json();

const reply=data.choices[0].message.content;

messages.push({

role:"assistant",

content:reply

});

addMessage(reply,"bot");

}

catch{

addMessage("Sorry, something went wrong.","bot");

}

}

sendBtn.onclick=sendMessage;

input.addEventListener("keypress",e=>{

if(e.key==="Enter"){

sendMessage();

}

}); 