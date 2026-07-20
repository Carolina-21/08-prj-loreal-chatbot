const chatBox = document.getElementById("chatBox");

const input = document.getElementById("userInput");

const sendBtn = document.getElementById("sendBtn");

const latest = document.getElementById("latestQuestion");


// Replace this with your real Cloudflare Worker URL
const endpoint = "YOUR_CLOUDFLARE_WORKER_URL";


const messages = [

  {
    role: "system",

    content: `
You are L'Oréal Beauty Assistant.

Only answer questions about:

- L'Oréal products
- Skincare
- Makeup
- Haircare
- Fragrances
- Beauty routines
- Beauty recommendations

Politely refuse unrelated questions.

When recommending products or routines, ask about the user's
skin type, hair type, concerns, or preferences when helpful.

Provide friendly, helpful, and concise responses.
`
  }

];


function addMessage(text, type) {

  const div = document.createElement("div");

  div.className = `message ${type}`;

  // Use textContent instead of innerHTML
  // so user input cannot insert HTML into the page
  div.textContent = text;

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;

}


async function sendMessage() {

  const question = input.value.trim();

  if (question === "") {
    return;
  }


  // Show the user's latest question
  latest.textContent = `Your Question: ${question}`;


  // Add user message bubble
  addMessage(question, "user");


  // Add question to conversation history
  messages.push({
    role: "user",
    content: question
  });


  // Clear input
  input.value = "";


  // Disable button while waiting
  sendBtn.disabled = true;

  sendBtn.textContent = "Thinking...";


  try {

    const response = await fetch(endpoint, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        messages: messages
      })

    });


    // Check if the request actually succeeded
    if (!response.ok) {

      throw new Error(
        `Request failed with status ${response.status}`
      );

    }


    const data = await response.json();


    console.log(
      "Worker response:",
      data
    );


    // Get OpenAI response
    const reply =
      data.choices?.[0]?.message?.content;


    if (!reply) {

      throw new Error(
        "No chatbot response was returned."
      );

    }


    // Save AI response in conversation history
    messages.push({

      role: "assistant",

      content: reply

    });


    // Display AI response
    addMessage(reply, "bot");

  }

  catch (error) {

    console.error(
      "Chatbot error:",
      error
    );


    addMessage(
      "Sorry, something went wrong. Please try again.",
      "bot"
    );

  }

  finally {

    // Turn button back on
    sendBtn.disabled = false;

    sendBtn.textContent = "Send";

    input.focus();

  }

}


// Send message when button is clicked
sendBtn.addEventListener(
  "click",
  sendMessage
);


// Send message when Enter is pressed
input.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Enter") {

      event.preventDefault();

      sendMessage();

    }

  }
); 