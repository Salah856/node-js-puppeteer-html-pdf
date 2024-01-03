const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.use(express.json({limit: '10mb'}));
app.use(
    express.urlencoded(
        {limit: '10mb', extended: true}
    )
);

app.get('/', async(req, res) => {
    res.send('hello world from tuna ops sheet!');
});

app.post('/create-pdf', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: "new",
           executablePath: "/usr/bin/chromium-browser",
           args: ["--no-sandbox"],
        });
        const page = await browser.newPage();
        await page.setContent(req.body.html);

        const pdfBuffer = await page.pdf({
            format: 'A3', 
            landscape: true, 
        });
        await browser.close();

        res.set('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).send('Error generating PDF');
    };
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


