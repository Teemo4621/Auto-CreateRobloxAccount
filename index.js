const gradient = require('gradient-string');
const puppeteer = require('puppeteer')
require('colors') //added edit textcolors
const generator = require('generate-password'); //added Create Passwords
const readlineSync = require('readline-sync'); //require text input
const { WebhookClient, EmbedBuilder } = require('discord.js') //added discord.js
const config = require('./config.json')
const fs = require('fs')

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'];
const years = ['2003', '2002', '2001', '2000', '1999', '1998', '1997', '1996'];

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {
    console.clear()

    console.log(gradient('white', 'gray').multiline([
        "DevBy: ZEMON \n",
        "/> Roblox Account Generate v.1 </ \n",
        "GitHub: https://github.com/Teemo4621 \n"
    ].join('\n')));

    console.log(gradient.cristal('DiscordMe ∨ \n'));
    let logo = gradient('orange', 'yellow').multiline([
        "███████╗███████╗███╗░░░███╗░█████╗░███╗░░██╗",
        "╚════██║██╔════╝████╗░████║██╔══██╗████╗░██║",
        "░░███╔═╝█████╗░░██╔████╔██║██║░░██║██╔██╗██║",
        "██╔══╝░░██╔══╝░░██║╚██╔╝██║██║░░██║██║╚████║",
        "███████╗███████╗██║░╚═╝░██║╚█████╔╝██║░╚███║",
        "╚══════╝╚══════╝╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚══╝",
    ].join('\n'))
    console.log(logo + '\n');

    function random_item(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    function writedingAccount(username, password, cookie) {
        data = `{ "username": "${username}", "password": "${password}", "cookie": "${cookie}" }`;
        fs.appendFile("account.txt", `${data}\r\n`, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }

    const loop = readlineSync.questionInt("Rounds : ".grey);
    let webhook
    let onWebhook = false
    if (config.webhook.length > 10) {
        webhook = new WebhookClient({ url: config.webhook })
        if (webhook) {
            onWebhook = true
            console.log("Get Wenhook Successfull \n".blue)
        } else {
            console.log("Get Wenhook Error \n".blue)
        }
    }

    const usernameInput = readlineSync.question("Prefix username(as Zemon_ or gomen don't have @,$,#,%,!) : ".grey)
    if (usernameInput.length <= 0) {
        console.error('Please enter the prefix username'.red)
        delay(2000)
        return
    }

    for (i = 0; i < loop; i++) {
        try {
            console.clear()
            console.log(`round ${i + 1} \n`.yellow)
            let userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36';
            let options = {
                headless: false,
                ignoreHTTPSErrors: true,
                defaultViewport: null,
                devtools: false,
                ignoreDefaultArgs: ["--disable-extensions", "--enable-automation"],
                args: [
                    '--disable-features=IsolateOrigins,site-per-process',
                    '--allow-running-insecure-content',
                    '--disable-blink-features=AutomationControlled',
                    '--no-sandbox',
                    '--mute-audio',
                    '--no-zygote',
                    '--no-xshm',
                    '--no-first-run',
                    '--no-default-browser-check',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--enable-webgl',
                    '--ignore-certificate-errors',
                    '--lang=en-US,en;q=0.9',
                    '--password-store=basic',
                    '--disable-gpu-sandbox',
                    '--disable-software-rasterizer',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-infobars',
                    '--disable-breakpad',
                    '--disable-canvas-aa',
                    '--disable-2d-canvas-clip-aa',
                    '--disable-gl-drawing-for-tests',
                    '--enable-low-end-device-mode',
                ]
            };

            const browser = await puppeteer.launch(options);
            const page = await browser.newPage();

            page.setViewport({
                width: 400,
                height: 800,
                deviceScaleFactor: 1,
            })

            await page.setUserAgent(userAgent)

            const genUsername = usernameInput + i
            const genpassword = genUsername + generator.generate({ length: 6, numbers: true })

            //Specify roblox issue page url
            await page.goto('https://www.roblox.com/', { waitUntil: "domcontentloaded" })
            console.log('> Goto Roblox Register Page \n'.yellow);
            //waiting for page
            await page.waitForSelector('#signup-button')
            //select form
            await page.select('#MonthDropdown', random_item(months)).catch((err) => console.log('Select Month'.red, err)) //Month
            console.log('> Select Month \n'.yellow)
            await page.select('#DayDropdown', random_item(days)).catch((err) => console.log('Select Dayr'.red, err)) //Day
            console.log('> Select Day \n'.yellow)
            await page.select('#YearDropdown', random_item(years)).catch((err) => console.log('Select Year'.red, err)) //Year
            console.log('> Select Year \n'.yellow)
            await page.type('#signup-username', genUsername).catch((err) => console.log('generateUsername Err'.red, err))
            await page.waitForSelector('#signup-usernameInputValidation')
            await page.type('#signup-password', genpassword).catch((err) => console.log('generatePassword Err'.red, err))

            //Waiting for validation of username
            await delay(2000);

            //check usernameInputValidation
            const inputValidation = await page.$('#signup-usernameInputValidation')
            const alert = await (await inputValidation.getProperty('textContent')).jsonValue()
            console.log('> Check Username Input Validatio \n'.yellow)
            if (alert == "This username is already in use.") {
                browser.close()
                console.error('\n This username is already in use.(มีคนใช้ username อันนี้ไปเเล้ว)'.red)
                delay(1000)
            } else if (alert == "Username not appropriate for Roblox.") {
                browser.close()
                console.error('\n Username not appropriate for Roblox.(ชื่อผู้ใช้ไม่เหมาะสม)'.red)
                delay(1000)
            } else if (alert == "Usernames may only contain letters, numbers, and _.") {
                browser.close()
                console.error('\n Usernames may only contain letters, numbers, and _.'.red)
                delay(1000)
            } else {
                console.log('> This username can be used \n'.green)
            }
            //select type

            await page.click('#MaleButton').catch((err) => console.log('Clicktype Err'.red, err))
            console.log('> Select MaleButton \n'.yellow)
            //click Submit button 
            await delay(1000);
            await page.click('#signup-button').catch((err) => console.log('ClickSubmit Err'.red, err))
            console.log('> Click SingUp \n'.yellow)

            await page.waitForSelector('.game-home-page-container', { timeout: 500000 }).then(async () => {
                if (onWebhook == false) {
                    const getCookie = await page.cookies()
                    const cookie = getCookie.find((cookies) => {
                        return cookies.name === ".ROBLOSECURITY";
                    })
                    writedingAccount(genUsername, genpassword, cookie.value)
                    console.log('Wait 2 seconds before the next registration. \n')
                    await delay(2000);
                } else {
                    const getCookie = await page.cookies()
                    const cookie = getCookie.find((cookies) => {
                        return cookies.name === ".ROBLOSECURITY";
                    })
                    await webhook.send({ embeds: [new EmbedBuilder({ title: `🎰 | สร้างบัญชี Roblox เสร็จสิ้นเเล้ว`, description: `***Username*** : ||${genUsername}|| \n***Password*** : ||${genpassword}|| \n***Cookie*** : \`\`\`${cookie.value}\`\`\``, footer: { text: 'MakeBy ZEMON#1269' }, image: { url: "https://media.tenor.com/Unrbryt4npgAAAAC/anime-sad.gif" }, author: { name: "ZEMONDev", iconURL: "https://i.redd.it/r9i4b4833xm21.jpg" } }).setTimestamp().setColor('DarkPurple')] })
                    console.log('Wait 2 seconds before the next registration. \n')
                    await delay(5000);
                }
            })
            browser.close()
        } catch (err) {
            console.log('เกิด Err กรุณาลองใหม่อีกครั้ง'.red);
        }
    }

})()
