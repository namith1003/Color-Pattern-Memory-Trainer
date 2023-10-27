"use strict";

/*
 *
 * Assignment 1 web app
 *
 * Copyright (c) 2017  Monash University
 *
 * Written by Phillip Abramson
 *
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
*/

const TOUCH_MODE = 1;
const TILT_MODE  = 2;
var controlMode = TOUCH_MODE;

const STATE_WAIT  = 1;
const STATE_WATCH = 2;
const STATE_USER  = 3;
var playingState = STATE_WAIT;

const LENLITPNG = 7;
const LENDARKPNG = 8;
const timeTillDarken = 200; // 0.2 second till darken
const timeBetweenLight = 2 * timeTillDarken;
const timeTillGiveUp = 2000; // 2 seconds until we treat the user's response as wrong
const timeTillBlankResult = 1000; // 1 second until make the result field blank again
var TLImg = document.getElementById("TL"); // blue
var TRImg = document.getElementById("TR"); // green
var BLImg = document.getElementById("BL"); // yellow
var BRImg = document.getElementById("BR"); // red
var resultImg = document.getElementById("result");
var allButtons = [TLImg, TRImg, BLImg, BRImg];
var currentLit = null;
var usersTurn = false;
var giveUpTimeOut = null;
var buttonMapping = {
    "blue":0,
    "green":1,
    "yellow":2,
    "red":3,
    "topLeft":0,
    "topRight":1,
    "bottomLeft":2,
    "bottomRight":3
};
var userMadeChoice = false;

/* not in use
var functionMapping = {
    "topLeft":"blue",
    "topRight":"green",
    "bottomLeft":"yellow",
    "bottomRight":"red"
};*/
var buttonPressesRemaining = 0;
var remaining = null;
var buttonsAllowed = true;

function allowButtonPresses()
{
    buttonsAllowed = true;
}

function disallowButtonPresses()
{
    buttonsAllowed = false;
}

function runGame()
{
    // Ask for sequence from gameLogic.js
    var studentsSequence = giveNextSequence();
    enterWatchState();
    //run sequence
    if (studentsSequence === undefined)
    {
        throw new Error("invalid sequence passed (undefined)");
    }
    else if (studentsSequence.length === 0)
    {
        throw new Error("invalid sequence passed (empty sequence)")
    }
    else
    {
        remaining = studentsSequence.slice();

        // Prevent user picking anything
        sequenceStart();

        recursiveSequence();
        // Sequence is ended in the recursiveSequence method
    }
    // Every button press will update how many buttons pressed to track how
    // close to full sequence the give up and this will then trigger a
    // timeout (2 seconds) to retrigger this method
}

function goDark(imgTag)
{
    if (imgTag.class === "lit")
    {
        var oldSrc = imgTag.src;
        oldSrc = oldSrc.substr(0, oldSrc.length - LENLITPNG)
        imgTag.src = oldSrc + "Dark.png";
        imgTag.class = "dark";
    }
    if (currentLit === imgTag)
    {
        currentLit = null;
    }
}

function scheduleGiveUp()
{
    userMadeChoice = false;
    // Triggers method in gameLogic.js
    giveUpTimeOut = setTimeout(triggerUserChoiceTimeout, timeTillGiveUp);
}

function triggerUserChoiceTimeout()
{
    userChoiceTimeout();
    if (userMadeChoice === false)
    {
        usersTurn = false;
        buttonPressesRemaining = 0;
        enterWaitState();
    }
    userMadeChoice = false;
}

function cancelGiveUp()
{
    clearTimeout(giveUpTimeOut);
}

function autoDarken()
{
    goDark(currentLit);
    currentLit = null;
}

function showBlank()
{
    resultImg.src = "images/blank.png";
    resultImg.class = "blank";
}

function showSuccess()
{
    resultImg.src = "images/tick.png";
    resultImg.class = "tick";
    setTimeout(showBlank, timeTillBlankResult);
}

function showFailure()
{
    resultImg.src = "images/cross.png";
    resultImg.class = "cross";
    setTimeout(showBlank, timeTillBlankResult);
}

//this function should be triggered each time a button is clicked, it will check if there are button presses remaining and if not it triggers the game restart, if there are then it triggers checking giveup again
function checkUserFinished()
{
    if (buttonPressesRemaining <= 0)
    {
        // Then done
        usersTurn = false;
        // Ask for next sequence in 2 seconds
        enterWaitState();
    }
    else
    {
        scheduleGiveUp();
    }
}

function sequenceStart()
{
    usersTurn = false;
    // Reset to zero as new sequence
    buttonPressesRemaining = remaining.length;
    cancelGiveUp()
}

function sequenceEnd()
{
    usersTurn = true;
    sequenceHasDisplayed();
    enterUserState()
    // User is not able to both pick things and run out of time
    scheduleGiveUp();
}

function goLight(imgTag)
{
    for (var pos = 0; pos < allButtons.length; pos++)
    {
        // Only one button can be lit at once
        goDark(allButtons[pos]);
    }
    currentLit = imgTag;
    if (imgTag.class !== "lit")
    {
        var oldSrc = imgTag.src;
        oldSrc = oldSrc.substr(0, oldSrc.length-LENDARKPNG);
        imgTag.src = oldSrc+"Lit.png";
        imgTag.class = "lit";
    }
    setTimeout(autoDarken, timeTillDarken);
}

function recursiveSequence()
{
    if (remaining.length > 0)
    {
        // Not yet at base case
        lightButton(remaining.shift().toLowerCase());
        // Remove the leftmost item in the sequence
        setTimeout(recursiveSequence, timeBetweenLight);
    }
    else
    {
        // Allow user to pick things again
        sequenceEnd();
    }
}

function lightButton(whichButton)
{
    if (buttonMapping.hasOwnProperty(whichButton))
    {
        var position = buttonMapping[whichButton];
        goLight(allButtons[position]);
    }
    else
    {
        throw new Error("invalid option passed to lightButton method")
    }
}

function swapImg(imgTag)
{
    if (imgTag.class === "lit")
    {
        goDark(imgTag);
    }
    else
    {
        goLight(imgTag);
    }
}

function isLit(imgTag)
{
    return imgTag.class === "lit";
}

function buttonPress(pressed)
{
    if (buttonsAllowed)
    {
        if (pressed.toLowerCase() === "blue")
        {
            selectBlueButton();
        }
        else if (pressed.toLowerCase() === "green")
        {
            selectGreenButton();
        }
        else if (pressed.toLowerCase() === "yellow")
        {
            selectYellowButton();
        }
        else if (pressed.toLowerCase() === "red")
        {
            selectRedButton();
        }
    }
    else
    {
        console.log("button presses currently disabled");
    }
}

function selectTopLeftButton()
{
    selectBlueButton();
}

function selectTopRightButton()
{
    selectGreenButton();
}

function selectBottomLeftButton()
{
    selectYellowButton();
}

function selectBottomRightButton()
{
    selectRedButton();
}


function selectBlueButton()
{
    if ((!isLit(TLImg)) && usersTurn)
    {
        // Only allow clicking if user's turn to choose
        updateSymbolCount();

        // Can stop the give up
        cancelGiveUp();
        goLight(TLImg);
        buttonSelected("blue");

        // Restart it again from 2 seconds
        // 
        userMadeChoice = true;
        checkUserFinished();
    }
}

function selectGreenButton()
{
    if ((!isLit(TRImg)) && usersTurn)
    {
        // Only allow clicking if user's turn to choose
        updateSymbolCount();

        cancelGiveUp();
        goLight(TRImg);
        buttonSelected("green");
        userMadeChoice = true;
        checkUserFinished();
    }
}
function selectYellowButton()
{
    if ((!isLit(BLImg)) && usersTurn)
    {
        // Only allow clicking if user's turn to choose
        updateSymbolCount();

        cancelGiveUp();
        goLight(BLImg);
        buttonSelected("yellow");
        userMadeChoice = true;
        checkUserFinished();
    }
}

function selectRedButton()
{
    if ((!isLit(BRImg)) && usersTurn)
    {
        // Only allow clicking if user's turn to choose
        updateSymbolCount();

        cancelGiveUp();
        goLight(BRImg);
        buttonSelected("red");
        userMadeChoice = true;
        checkUserFinished();
    }
}


// This function displays the given message String as a "toast" message at
// the bottom of the screen.  It will be displayed for 2 second, or if the
// number of milliseconds given by the timeout argument if specified.
function displayToastMessage(message, timeout)
{
    if (timeout === undefined)
    {
        // Timeout argument not specifed, use default.
        timeout = 2000;
    }

    if (typeof(message) == 'number')
    {
        // If argument is a number, convert to a string.
        message = message.toString();
    }

    if (typeof(message) != 'string')
    {
        console.log("displayMessage: Argument is not a string.");
        return;
    }

    if (message.length == 0)
    {
        console.log("displayMessage: Given an empty string.");
        return;
    }

    var snackbarContainer = document.getElementById('toast');
    var data = {
        message: message,
        timeout: timeout
    };
    if (snackbarContainer && snackbarContainer.hasOwnProperty("MaterialSnackbar"))
    {
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }
}


function updateSymbolCount()
{
    buttonPressesRemaining -= 1;
}

function runGameWithWait()
{
    setTimeout(runGame, timeBetweenLight);
}

// This allows the game to start as soon as the page loads
// window.onload = runGameWithWait;

function startGame()
{
    if (playingState === STATE_WAIT)
    {
        runGame();
    }
}

function modeButtonClicked()
{
    if (playingState === "watch")
    {
        displayToastMessage("Can't change controls while playing.");
    }
    else
    {
        var modeIcon = document.getElementById("modeIcon");

        if (controlMode === TOUCH_MODE)
        {
            // Change to "rotation" icon.
            modeIcon.textContent = "screen_rotation";

            controlMode = TILT_MODE;
            displayToastMessage("Now using tilt controls.");
            disallowButtonPresses();
        }
        else
        {
            // Change to "touch" icon.
            modeIcon.textContent = "touch_app";

            controlMode = TOUCH_MODE;
            displayToastMessage("Now using touch controls.");
            allowButtonPresses();
        }

        // Call function in gameLogic.js to notify.
        changeMode(controlMode);
    }
}

function enterWatchState()
{
    // Change to "eye" icon.
    var stateIcon = document.getElementById("stateIcon");
    stateIcon.textContent = "remove_red_eye";

    playingState = STATE_WATCH;
}

function enterUserState()
{
    // Change to "eye" icon.
    var stateIcon = document.getElementById("stateIcon");
    stateIcon.textContent = "person";

    playingState = STATE_USER;
}

function enterWaitState()
{
    // Change to "eye" icon.
    var stateIcon = document.getElementById("stateIcon");
    stateIcon.textContent = "play_circle_filled";

    playingState = STATE_WAIT;
}
