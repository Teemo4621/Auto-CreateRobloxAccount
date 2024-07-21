const gradient = require('gradient-string');
const readlineSync = require('readline-sync');
const cluster = require('cluster');
const puppeteer = require('puppeteer');
const generator = require('generate-password');
const fs = require('fs');

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'];
const years = ['2003', '2002', '2001', '2000', '1999', '1998', '1997', '1996'];

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function writedingAccount(username, password, cookie) {
    fs.writeFileSync("data/cookies.txt", `${cookie}\r\n`, { flag: 'a' });
    fs.writeFileSync("data/user-pass.txt", `${username}:${password}\r\n`, { flag: 'a' });
    console.log("The file was saved!");
}

async function runPuppeteer(roundNumber, usernameInput) {
    console.log(`Starting round ${roundNumber}`);

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.goto('https://www.roblox.com/', { waitUntil: "load" });

    await page.select('#MonthDropdown', random_item(months));
    await page.select('#DayDropdown', random_item(days));
    await page.select('#YearDropdown', random_item(years));

    let genUsername = usernameInput + generator.generate({ length: 7, numbers: true });
    const genpassword = generator.generate({ length: 7, numbers: true }) + genUsername;

    await page.type('#signup-username', genUsername);
    await page.type('#signup-password', genpassword);

    await delay(2000);

    const inputValidation = await page.$('#signup-usernameInputValidation');
    const alert = await (await inputValidation.getProperty('textContent')).jsonValue();

    if (alert.includes("This username is already in use.") || alert.includes("Username not appropriate") || alert.includes("Usernames may only contain")) {
        genUsername = usernameInput + generator.generate({ length: 5, numbers: true });
        await page.type('#signup-username', genUsername);
    }

    await page.click('#MaleButton').catch((err) => console.log('Clicktype Err'.red, err));
    await delay(1000);

    await page.click('#signup-button');

    await page.waitForSelector('.game-home-page-container', { timeout: 500000 }).then(async () => {
        const getCookie = await page.cookies();
        const cookie = getCookie.find((cookies) => {
            return cookies.name === ".ROBLOSECURITY";
        });
        writedingAccount(genUsername, genpassword, cookie.value);
        console.log(`Round ${roundNumber} completed successfully`);
    });

    await browser.close();
}

if (cluster.isMaster) {
    console.clear();

    console.log(gradient('white', 'gray').multiline([
        "DevBy: ZEMONNUB \n",
        "/> Roblox Account Generate v.2 </ \n",
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

    const loop = readlineSync.questionInt("Rounds : ");
    const usernameInput = readlineSync.question("Prefix username (e.g., Zemon_): ");

    for (let i = 0; i < loop; i++) {
        cluster.fork({ roundNumber: i + 1, usernameInput });
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} finished with code ${code}`);
    });

} else {
    const roundNumber = parseInt(process.env.roundNumber);
    const usernameInput = process.env.usernameInput;

    runPuppeteer(roundNumber, usernameInput)
        .catch((err) => {
            console.error(`Error in worker ${process.pid} during round ${roundNumber}:`, err);
        })
        .finally(() => {
            process.exit(0);
        });
}