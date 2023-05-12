const btn = document.querySelector('button');
const color = document.querySelector('.color');
const colorVal = document.querySelector('.colorVal');
const display = document.querySelector('.display');
btn.addEventListener('click', async ()=>{

/* This line of code is querying the Chrome browser's tabs API to get information about the currently
active tab in the current window. The `active: true` parameter specifies that the query should
only return the active tab, and the `currentWindow: true` parameter specifies that the query
should only search for tabs in the current window. The result of the query is an array of tabs
that match the specified criteria, and the code is using array destructuring to assign the first
(and only) tab in the array to the `tab` variable. */
   const [tab] = await chrome.tabs.query({active: true ,currentWindow: true});

/* This code is using the `chrome.scripting.executeScript()` method to execute the `pickColor()`
function in the context of the currently active tab in the Chrome browser. The `tab.id` property is
used to specify the target tab for the script execution. */
   chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: pickColor,
   }, async (colorPicked)=>{
    const [data] = colorPicked;
    if(data.result)
    {
        color.style.backgroundColor = data.result.sRGBHex;
        colorVal.innerText = data.result.sRGBHex;
        display.classList.remove('hide');
        try{
            await navigator.clipboard.writeText(data.result.sRGBHex);
         }catch(err){
             console.error(err);
         }
    }
   })
})

/**
 * The function uses the EyeDropper API to allow the user to pick a color.
 * @returns The function `pickColor()` is returning a promise that resolves to the color value selected
 * by the user using the EyeDropper tool. If an error occurs during the execution of the function, the
 * error is caught and logged to the console.
 */
async function pickColor()
{
    try{
        const eyeDropper = new EyeDropper();
        return await eyeDropper.open()
    }catch(err){
        console.error(err);
    }
}