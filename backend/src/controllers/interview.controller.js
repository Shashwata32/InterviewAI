// const pdfParse = require('pdf-parse')
// const generateInterviewReport = require('../services/ai.service')
// const interviewReportModel = require('../models/interviewReport.model')

// async function generateInterviewReportController(req, res) {

//     const resumeContent = await (new pdfParse({ data: new Uint8Array.from(req.file.buffer) })).getText()
//     const {selfDescription, jobDescription} = req.body

//     const interViewReportByAi = await generateInterviewReport({
//         resume: resumeContent.text,
//         selfDescription,
//         jobDescription
//     })

//     const interviewReport = await interviewReportModel.create({
//         user: req.user.id,
//         resume : resumeContent.text,
//         selfDescription,
//         jobDescription,
//         ...interViewReportByAi,
//     })

//     res.status(201).json({
//         message: 'Interview report generated successfully',
//         interviewReport
//     })
    
// }

// module.exports = { generateInterviewReportController }

const { PDFParse } = require('pdf-parse')
const generateInterviewReport = require('../services/ai.service')
const interviewReportModel = require('../models/interviewReport.model')

async function generateInterviewReportController(req, res) {
    try {
        const parser = new PDFParse({ data: new Uint8Array(req.file.buffer) })
        const resumeContent = await parser.getText()
        const resumeText = resumeContent.text

        const { selfDescription, jobDescription } = req.body

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi,
        })

        res.status(201).json({
            message: 'Interview report generated successfully',
            interviewReport
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

module.exports = { generateInterviewReportController }