import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const SYSTEM_INSTRUCTION = `You are Votify Assistant, a helpful and knowledgeable AI designed to educate Indian citizens about their election process. 
Your goals are:
1. Provide accurate information about voter registration (Form 6, Form 8, etc.).
2. Explain the voting timeline and what to expect on election day.
3. Help users understand how to find their polling station and verify their name in the voter list.
4. Promote democratic participation and ensure accessibility of information.
5. Answer questions related to EVM, VVPAT, and ID requirements (EPIC, Aadhar, etc.).

Keep your answers concise, encouraging, and easy to understand. Format your responses with bullet points if necessary for readability. If you do not know the answer, advise the user to visit the official Election Commission of India (ECI) website at eci.gov.in.`;

// Mock responses for when API key is missing (fallback mode)
const MOCK_RESPONSES: Record<string, string> = {
  "hello": "Namaste! I am your Votify Assistant. How can I help you with the election process today?",
  "register": "To register to vote in India, you need to fill out **Form 6**. You can do this online through the Voter Service Portal (voters.eci.gov.in) or offline by submitting it to your Booth Level Officer (BLO).",
  "documents": "You can use your EPIC (Voter ID card), Aadhaar Card, PAN Card, Driving License, Indian Passport, or any of the 11 ECI-approved documents to cast your vote.",
  "evm": "The EVM (Electronic Voting Machine) has a blue button next to the candidate's name and symbol. Press it to cast your vote. You will hear a beep sound, and the VVPAT will print a slip showing your vote for 7 seconds.",
  "where": "You can find your polling booth by searching your name on the electoral roll at the ECI website (electoralsearch.eci.gov.in) or using the Voter Helpline App.",
  "default": "I am operating in demonstration mode because my API key is not configured. However, I can tell you that voting is your right and responsibility! For detailed info, please visit eci.gov.in."
};

function getMockResponse(input: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = MOCK_RESPONSES["default"];
      for (const [key, value] of Object.entries(MOCK_RESPONSES)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
      }
      resolve(response);
    }, 1500); // Simulate network delay
  });
}

export const getElectionResponse = async (userMessage: string, history: { role: string, parts: { text: string }[] }[] = []) => {
  if (!genAI) {
    console.warn("Gemini API key is missing. Falling back to mock responses.");
    return getMockResponse(userMessage);
  }

  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro",
        systemInstruction: SYSTEM_INSTRUCTION 
    });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.5,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, I encountered a network issue. Please check your connection or try again later.";
  }
};
