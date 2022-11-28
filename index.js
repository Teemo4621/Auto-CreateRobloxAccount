// /*
//███████╗███████╗███╗░░░███╗░█████╗░███╗░░██╗░░░██╗░██╗░░░███╗░░██████╗░░█████╗░░█████╗░
//╚════██║██╔════╝████╗░████║██╔══██╗████╗░██║██████████╗░████║░░╚════██╗██╔═══╝░██╔══██╗
//░░███╔═╝█████╗░░██╔████╔██║██║░░██║██╔██╗██║╚═██╔═██╔═╝██╔██║░░░░███╔═╝██████╗░╚██████║
//██╔══╝░░██╔══╝░░██║╚██╔╝██║██║░░██║██║╚████║██████████╗╚═╝██║░░██╔══╝░░██╔══██╗░╚═══██║
//███████╗███████╗██║░╚═╝░██║╚█████╔╝██║░╚███║╚██╔═██╔══╝███████╗███████╗╚█████╔╝░█████╔╝
//╚══════╝╚══════╝╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚══╝░╚═╝░╚═╝░░░╚══════╝╚══════╝░╚════╝░░╚════╝░
// */


const gradient = require('gradient-string');
const puppeteer = require('puppeteer') //add webscraping
require('colors') //added edit textcolors
const generator = require('generate-password'); //added Create Passwords
const input = require('input') //require text input
const { generateUsername } = require("unique-username-generator"); //added generateUsername
const fs = require('fs');

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'];
const years = ['2003', '2002', '2001', '2000', '1999', '1998', '1997', '1996'];

function random_item(items) {
    return items[Math.floor(Math.random() * items.length)];
}


(async () => {
    console.log(gradient('white', 'gray').multiline([
        "DevBy: ZEMON \n",
        "/> Roblox Account Generate v.1 </ \n",
        "GitHub: https://github.com/Teemo4621 \n"
    ].join('\n')));
    
    console.log(gradient.cristal('DiscordMe ∨ \n'));
    let logo = gradient('orange', 'yellow').multiline([
        "███████╗███████╗███╗░░░███╗░█████╗░███╗░░██╗░░░██╗░██╗░░░███╗░░██████╗░░█████╗░░█████╗░",
        "╚════██║██╔════╝████╗░████║██╔══██╗████╗░██║██████████╗░████║░░╚════██╗██╔═══╝░██╔══██╗",
        "░░███╔═╝█████╗░░██╔████╔██║██║░░██║██╔██╗██║╚═██╔═██╔═╝██╔██║░░░░███╔═╝██████╗░╚██████║",
        "██╔══╝░░██╔══╝░░██║╚██╔╝██║██║░░██║██║╚████║██████████╗╚═╝██║░░██╔══╝░░██╔══██╗░╚═══██║",
        "███████╗███████╗██║░╚═╝░██║╚█████╔╝██║░╚███║╚██╔═██╔══╝███████╗███████╗╚█████╔╝░█████╔╝",
        "╚══════╝╚══════╝╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚══╝░╚═╝░╚═╝░░░╚══════╝╚══════╝░╚════╝░░╚════╝░",
    ].join('\n'))
    console.log(logo + '\n');

    const usernameInput = await input.text("prefix username(as Zemon_ or gomen don't have @,$,#,%,!) :" .grey);
    const passwordLength = await input.text('length random password(as 3 result username + randompassword(3)) :' .grey);

    if (!parseInt(passwordLength)) return console.log('password length You can only enter numbers.'.red)
    if (passwordLength.length < 0) return console.log('กรุณาใส่ความยาวของรหัสผ่านค่ะ'.red)
    if (passwordLength.length > 1 || passwordLength > 9) return console.log('ความยาวของรหัสผ่าน ใส่ได้มากสุด9ตัวค่ะ'.red)

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const getUsername = generateUsername("", 0, 5)
    const genUsername = usernameInput + getUsername
    const genpassword = genUsername + generator.generate({ length: passwordLength, numbers: true })
    function delay(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }

    try {
        //Specify roblox issue page url
        await page.goto('https://www.roblox.com/')
        console.log('> Goto Roblox Register Page \n'.yellow);
        //waiting for page
        await page.waitForSelector('#signup-button')
        //select form
        await page.select('#MonthDropdown', random_item(months)).catch((err) => { return console.log('Select Month'.red, err) }) //Month
        console.log('> Select Month \n'.yellow)
        await page.select('#DayDropdown', random_item(days)).catch((err) => { return console.log('Select Dayr'.red, err) }) //Day
        console.log('> Select Day \n'.yellow)
        await page.select('#YearDropdown', random_item(years)).catch((err) => { return console.log('Select Year'.red, err) }) //Year
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
            return console.log('\n This username is already in use.(มีคนใช้ username อันนี้ไปเเล้ว)'.red)
        } else if (alert == "Username not appropriate for Roblox.") {
            browser.close()
            return console.log('\n Username not appropriate for Roblox.(ชื่อผู้ใช้ไม่เหมาะสมสำหรับ Roblox)'.red)
        } else {
            console.log('> This username can be used \n'.green)
        }
        //select type
       
        await page.click('#MaleButton').catch((err) => console.log('Clicktype Err'.red, err))
        console.log('> Select MaleButton \n'.yellow)
        //click Submit button 
        await delay(2000);
        await page.click('#signup-button').catch((err) => console.log('ClickSubmit Err'.red, err))
        console.log('> Click SingUp \n'.yellow)

        await page.waitForSelector('.game-home-page-container', { timeout: 30000 }).then(async() => {
            const getCookie = await page.cookies()
            const cookie = getCookie.find((cookies) => {
                return cookies.name === ".ROBLOSECURITY";
            })
            console.log('Register Successful \n'.green .bold)
            const writeAccount = JSON.stringify({ username: genUsername, password: genpassword, cookie: cookie.value })
            fs.appendFile('./account/robloxAccount.txt', writeAccount + "\n", function (err) {
                // print output
                console.log('SavedAccount! \n' .rainbow);
            });
        })
        console.log('Wait 5 seconds before the next registration. \n')
        await delay(5000);
        browser.close()
    } catch (err) {
        console.log(err, 'เกิด Err กรุณาลองใหม่อีกครั้ง' .red);
    }

})();