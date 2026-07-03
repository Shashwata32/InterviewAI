// const { GoogleGenAI } = require("@google/genai");
// const {z} = require("zod");
// const {zodToJsonSchema} = require("zod-to-json-schema");

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY,
// });

// const interviewReportSchema = z.object({
//     matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe."),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("Technical question to that can be asked in the interview."),
//         intention: z.string().describe("The intention of the interviewer behind the question."),
//         answer: z.string().describe("How to answer the question, what points to cover, what approach to take.")
//     })).describe("Technical questions that can be asked in the interview, along with their intention and answer."),
//     behaviouralQuestions: z.array(z.object({
//         question: z.string().describe("Behavioural question to that can be asked in the interview."),
//         intention: z.string().describe("The intention of the interviewer behind the question."),
//         answer: z.string().describe("How to answer the question, what points to cover, what approach to take.")
//     })).describe("Behavioural questions that can be asked in the interview, along with their intention and answer."),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("Skill that the candidate is lacking."),
//         severity: z.enum(["low", "medium", "high"]).describe("Severity of the skill gap.")
//     })).describe("List of skills the candidate is lacking, along with their severity."),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe("Day number of the preparation plan starting from 1."),
//         focus: z.string().describe("The main focus of the day, what to do, what to learn, what to practice."),
//         tasks: z.array(z.string()).describe("List of tasks to be done each day for the preparation plan.")
//     })).describe("A day wise preparation plan for the candidate to follow, starting from day 1.")
// });

// async function generateInterviewReport({
//     resume,
//     selfDescription,
//     jobDescription,
// }) {

//     const prompt = `Generate an interview report for a candidate based on the following information:
//     Resume: ${resume}
//     Self-Description: ${selfDescription}
//     Job Description: ${jobDescription}
//     `;

//     const geminiSchema = zodToJsonSchema(interviewReportSchema, { target: "openApi3" });
    
//     // 2. Delete the $schema property that the Gemini API rejects
//     delete geminiSchema.$schema;


//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: geminiSchema,
//         }
//     })

//     return JSON.parse(response.text)
// }

// module.exports = generateInterviewReport

const { GoogleGenAI } = require("@google/genai");
// const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Write Gemini-compatible schema directly — no zodToJsonSchema
// Gemini does NOT support: additionalProperties, $schema, or many zod-generated fields
const responseSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "number",
            description: "A score between 0 and 100 indicating how well the candidate matches the job"
        },
        technicalQuestions: {
            type: "array",
            description: "At least 5 technical questions for the interview",
            items: {
                type: "object",
                properties: {
                    question:  { type: "string", description: "The technical question" },
                    intention: { type: "string", description: "Why the interviewer asks this" },
                    answer:    { type: "string", description: "How the candidate should answer" }
                }
            }
        },
        behaviouralQuestions: {
            type: "array",
            description: "At least 3 behavioural questions for the interview",
            items: {
                type: "object",
                properties: {
                    question:  { type: "string", description: "The behavioural question" },
                    intention: { type: "string", description: "Why the interviewer asks this" },
                    answer:    { type: "string", description: "How the candidate should answer" }
                }
            }
        },
        skillGaps: {
            type: "array",
            description: "Skills the candidate is lacking compared to the job requirements",
            items: {
                type: "object",
                properties: {
                    skill:    { type: "string", description: "The missing skill" },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "How critical this gap is"
                    }
                }
            }
        },
        preparationPlan: {
            type: "array",
            description: "A 7-day day-by-day preparation plan",
            items: {
                type: "object",
                properties: {
                    day:   { type: "number", description: "Day number starting from 1" },
                    focus: { type: "string", description: "The main focus of the day" },
                    tasks: {
                        type: "array",
                        description: "List of tasks for the day",
                        items: { type: "string" }
                    }
                }
            }
        },
        title: {
            type: "string",
            description: "A concise 5-8 letter title for the job position"
        }
    }
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate a comprehensive interview report for a candidate.

Resume:
${resume}

Self-Description:
${selfDescription}

Job Description:
${jobDescription}

Provide at least 5 technical questions, 3 behavioural questions, identify all skill gaps, and create a 7-day preparation plan.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",  
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
            maxOutputTokens: 16384,
            temperature: 0.7,
        }
    });

    const candidate = response.candidates?.[0];
console.log("finishReason:", candidate?.finishReason);

if (candidate?.finishReason === "MAX_TOKENS") {
    throw new Error("Gemini response was truncated (hit max output tokens). Try increasing maxOutputTokens or shortening the prompt/schema.");
}

if (!response.text) {
    throw new Error("Gemini returned an empty response");
}

    console.log("Gemini raw response:", response.text?.slice(0, 300));

    if (!response.text) {
        throw new Error("Gemini returned an empty response");
    }

    const parsed = JSON.parse(response.text);

    if (!parsed || typeof parsed !== "object") {
        throw new Error(`Gemini returned invalid data: ${response.text}`);
    }

    return parsed;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumepdfSchema = {
        type: "object",
        properties: {
            html: {
                type: "string",
                description: "HTML content of the resume that can be converted to PDF using Puppeteer"
            }
        }
    }

    const prompt = `Generate an ATS friendly resume for a candidate based on the following information:
    
    Resume: ${resume}
    Self-Description: ${selfDescription}
    Job Description: ${jobDescription}
    
    the response should be a json object with a single key "html" containing the HTML content of the resume which can be converted to PDF using Puppeteer.
    The resume should be ATS friendly, tailored to the job description, well formatted, and visually appealing and structured. It should highlight the candidate's skills, experience, and achievements relevant to the job description.
    The content of the resume should not sound generic and should not sound like it was generated by AI. It should be unique and personalized to the candidate's profile and the job description.
    Use appropriate headings, bullet points, different font sizes and colours and sections to organize the information. The resume should not be lengthy and should be within 1-2 pages. Focus on quality over quantity. Make sure the resume is made such that the user gets interview calls from the job description provided.`; 

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumepdfSchema,
            maxOutputTokens: 16384,
            temperature: 0.7,
        }
    });

    const candidate = response.candidates?.[0];
    console.log("finishReason:", candidate?.finishReason);

    if (candidate?.finishReason === "MAX_TOKENS") {
        throw new Error("Gemini response was truncated (hit max output tokens). Try increasing maxOutputTokens or shortening the prompt/schema.");
    }

    if (!response.text) {
        throw new Error("Gemini returned an empty response");
    }

    const parsed = JSON.parse(response.text);

    if (!parsed || typeof parsed !== "object") {
        throw new Error(`Gemini returned invalid data: ${response.text}`);
    }

    const pdfBuffer = await generatePdfFromHtml(parsed.html)
    
    return pdfBuffer;
}

// async function generatePdfFromHtml(htmlContent) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
//     const pdfBuffer = await page.pdf({ format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
//     await browser.close();
//     return pdfBuffer;
// }

const chromiumPkg = require("@sparticuz/chromium");
const chromium = chromiumPkg.default || chromiumPkg;
const puppeteer = require("puppeteer-core");

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        defaultViewport: chromium.defaultViewport,
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
    await browser.close();
    return pdfBuffer;
}

module.exports = {generateInterviewReport, generateResumePdf};