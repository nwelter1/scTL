const puppeteer = require('puppeteer');

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}
const getTracks = async (title) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.1001tracklists.com/")
    await page.screenshot({
        path: 'test.png'
    })
    await page.setViewport({
        width: 1920,
        height: 1001
    })
    await page.waitForSelector('input#sBoxInput')
    await page.click("input#sBoxInput")
    console.log(`trying to type title: ${title}`)
    await page.keyboard.type(title)
    await page.waitForSelector('.acObjLi')
    await page.click('.acObjLi')
    await delay(5000)
    await page.screenshot({
        path: '1001.png'
    })
    const tracklistContent = await page.evaluate(() =>
        Array.prototype.slice.call(document.getElementsByClassName('trackValue')).map(function(x) {
            return x.innerText
        })
    );
    console.log(tracklistContent)
    browser.close()
    return tracklistContent
};
const express = require('express');
const app = express();
app.use(express.json())

app.get('/', async (request, response) => {
    let title = request.body.title;
    console.log(`Title: ${title}`)
    let tracks = await getTracks(title);
    response.send(JSON.stringify(tracks))


})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Listening on Port:${PORT}`)
})