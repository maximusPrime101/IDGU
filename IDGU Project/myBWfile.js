const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config()
const fs = require("fs");
const readline = require('readline');


const myBw = async () => {
    // Make sure to include these imports:
    // import { GoogleGenerativeAI } from "@google/generative-ai";
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    function fileToGenerativePart(path, mimeType) {
        return {
            inlineData: {
                data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                mimeType,
            },
        };
    }



    const prompt = "my image should be grayscale, is it? also describe whats in it";
    const imagePart = fileToGenerativePart(
        `cypress/screenshots/myImageBw.png`,
        "image/png",
    );

    const result = await model.generateContent([prompt, imagePart])
        .then((result) => {
            // Wrap the Promise to make Cypress wait for the API response
            return cy.wrap(result.response.text());
        })
        .then((text) => {
            cy.writeFile('cypress/outputs/myOutput.txt', text, { flag: 'a+' });
        });
    console.log(result.response.text());
}

myBw();