"use strict";

/*
 * This callback function will be called when any of the game buttons on the
 * screen is clicked on by the user (note that the user will not be able to
 * 'double-click' buttons, they will only be clickable once a button has
 * gone dark again)
 *
 * This function has a single parameter 'whichButton' that can take the
 * following values:
 *    "blue"
 *    "green"
 *    "yellow"
 *     "red"
*/


let userColorNum=4;
let userSeq=[];
let userWon=false;
let startLength=4;
let resetLossStreak=2;

/* 
 * Every time button is clicked after a sequence is displayed this function is called and it stores every entry of items by user for
 * the current sequence it also checks weather the user has entered all the items for the current sequence and compares the random 
 * generated sequence with the users entered sequence once all the items are entered by user if they are same it displays a tick at 
 * centre otherwise displays a cross.
 *
 * Then if the user has won the round it checks if user has won enough rounds for current level which is 2 less than current length of
 * sequence and increases the level accordingly by increasing the length of sequence required to be entered but if user has lost it 
 * decreases the length of the sequence to be entered and levels played down and also if user loses twice in a row it sends user back 
 * to the start by resetting the game.All this is done by keeping track of users win and loss streak.
 *
 * It also calls the sequenceHasDisplayed() function to keep updating the outputs on screen, mainly the  "Number of buttons remaining 
 * to be selected for the current sequence" is the one that is considered to be updated heavily within this area of code.
 *
 * Inputs: (whichButton)-tells the functions using strings of which button was clicked and is one of "blue","green","yellow" or"red" . 
*/

function buttonSelected(whichButton)
{
	
    // Include your own code here
 
    userSeq[userColorNum]=whichButton;     // The button being selected, its color is saved in userSeq array location.
    userColorNum++;	                       // userColorNum is incremented by 1 to get next location of userSeq array when next button is selected.

    // if all elements have been recorded in randSeq of user entered colors it is reset after being compared along with userColorNum.
    if (userColorNum===lengthOfSeq)
    { 		
	    
	    for (var compColorNum=0; compColorNum<lengthOfSeq;compColorNum++)     // comparing the randSeq and the userSeq 
	    {
	        if (userSeq[compColorNum]!=randSeq[compColorNum])
	        {
		        /* 
				* if they are different show a cross and break out of loop so that it doesnt show a tick 
		        * if a correct color is entered after a wrong one.
				*/
		        showFailure();
		        userWon=false;
		        break;
	        }
	        else
	        {
		        showSuccess();     // if they are the same show a tick
	    	    userWon=true;
	        }
	    }
    
	    // if user wins then winStreak increases else user has lost and lossStreak increases. 
        if (userWon)
        {
	        
	        winStreak++;     // increase winStreak. 
	        lossStreak=0;    // reset lossStreak since usser has won.
		 
	        // if winStreak is 2 less than the length of sequence then advance to next level
	        if ((lengthOfSeq-2)===winStreak)
            {
	            lengthOfSeq++;     // user advances to next level and length of sequences are increased by 1.
	            winStreak=0;       // winstreak is reset since its a new round.
	            userColorNum++;    // userColorNum incremented so that it matches the lengthOfSeq and displays zeros once round is over.
            }
        }		
        else
        {		
	
	        
	        lossStreak++;     // increase loss streak 
	        winStreak=0;      // reset win streak
		 
	        if (lengthOfSeq!=startLength)
	        {				
		       lengthOfSeq--;     // if user is not in starting level decrease the length of sequences.
	           userColorNum--;
	        }
			
	        // if loss streak is 2 game is reset.
	        if (lossStreak===resetLossStreak)
	        {				
		        lengthOfSeq=startLength;
		        lossStreak=0;
	            userColorNum=startLength;
	        }
		
        }
	
    }
	
    sequenceHasDisplayed();     // for each button entered the data that is output is updated using the function defined below called sequenceHasDisplayed.

}



/*
 * This callback function will be called regularly by the main.js page.
 * It is called when it is time for a new sequence to display to the user.
 * You should return a list of strings, from the following possible strings:
 *    "blue"
 *    "green"
 *    "yellow"
 *    "red"
*/


let randSeq=[];
let lengthOfSeq=startLength;
let winStreak=0;
let lossStreak=-1;
let output=document.getElementById('output');

// output the very first starting detail list for first level of new game.
output.innerText="\n" + "General status:  Watch a sequence." + "\n" + " Number of items remaining to be entered: " + '0' + "\n"+"Length of current sequence: " + lengthOfSeq +"\n"+"Number of correct sequences entered at the current level: "+winStreak+"\n"+"Correct sequences needed to advance to the next level: "+(lengthOfSeq-2-winStreak)+"\n"+"\n";

/* 
 * this function outputs the next random sequence the user has to input by calculating a random number from 0 to 3 and 
 * picks a color depending on the number since the 4 colors are represented by the 4 numbers within the array colors.
 * and returns this array to main.js to display the required sequence by lighting up the neccessary buttons using the 4 
 * functions selectBottomLeftButtonButton(),selectBottomRightButton(),selectTopRightButtonButton(),selectTopLeftButton(). 
*/

function giveNextSequence()
{
	
    // Include your own code here
	
    userColorNum=0;     // initialize userColorNum to start entering to user array from first location.
    userSeq=[];         // Initialize userSeq to not overwrite data in it but start entering from a reset of the array.

    
    randSeq=[];     // initizalize randSeq for each iteration/each new sequence made so that nothing from previous sequence remains. 
    
	var colors=["blue","green","red","yellow"];

    // making the next random sequence for user with length according to the level that the user is in.
    for (var randColorNum=0;randColorNum<lengthOfSeq;randColorNum++)
    {
		
        var colorNum= Math.floor(Math.random()*4);    // create a random number between 0 to 3.
	    randSeq[randColorNum]=colors[colorNum];       // puts correspoing color denoted by colorNum in colors array.

    }
	
    
    return randSeq;
	
}





/*
 * This callback function is called when the sequence to display to the user
 * has finished displaying and user is now able to click buttons again.
*/


/* 
 * this displays the required output of details depenf=ding on weather all the colors for sequence are entered by user to check if general
 * status is to enter or watch a sequence and display beta and gamma values depending on weather tilt mode is on or off.
*/

function sequenceHasDisplayed()
{
    // Include your own code here
	
    switch (true)
	{
		case (userColorNum!=lengthOfSeq && tiltOn===true):
		output.innerText = "\n" + "General status:  Enter a sequence." + "\n" + " Number of items remaining to be entered: " + (lengthOfSeq-userColorNum)+"\n"+"Length of current sequence: "+lengthOfSeq+"\n"+"Number of correct sequences entered at the current level: "+winStreak+"\n"+"Correct sequences needed to advance to the next level: "+(lengthOfSeq-2-winStreak)+"\n"+"\n"+"Beta tilt of the device: "+betaVal+ "\n" + "Gamma tilt of the device: "+gammaVal+"\n"+"Button selected : "+button;	
        break;

		case (userColorNum===lengthOfSeq && tiltOn===true):
		output.innerText = "\n" + "General status:  Watch a sequence." + "\n" + " Number of items remaining to be entered: " +"0"+"\n"+"Length of current sequence: "+lengthOfSeq+"\n"+"Number of correct sequences entered at the current level: "+winStreak+"\n"+"Correct sequences needed to advance to the next level: "+(lengthOfSeq-2-winStreak)+"\n"+"\n"+"Beta tilt of the device: "+betaVal+ "\n" + "Gamma tilt of the device: "+gammaVal+"\n"+"Button selected : "+button;	
        break;
		
		case (userColorNum!=lengthOfSeq && tiltOn===false):
		output.innerText = "\n" + "General status:  Enter a sequence." + "\n"+ " Number of items remaining to be entered: " + (lengthOfSeq-userColorNum)+"\n"+"Length of current sequence: "+lengthOfSeq+"\n"+"Number of correct sequences entered at the current level: "+winStreak+"\n"+"Correct sequences needed to advance to the next level: "+(lengthOfSeq-2-winStreak)+"\n"+"\n";
        break;
		
		case (userColorNum===lengthOfSeq && tiltOn===false):
		output.innerText = "\n" + "General status:  Watch a sequence." + "\n" + " Number of items remaining to be entered: " + "0" +"\n"+"Length of current sequence: "+lengthOfSeq+"\n"+"Number of correct sequences entered at the current level: "+winStreak+"\n"+"Correct sequences needed to advance to the next level: "+(lengthOfSeq-2-winStreak)+"\n"+"\n";
		break;
	}
	
}



/*
 * This callback function will be called if the user takes too long to make
 * a choice.  You can generally treat a call to this function as meaning the
 * user has 'given up'. This should be counted as an incorrect sequence given
 * by the user.
 *
 * When the app is is "tilt" input mode (see Step 7) then you might instead
 * use this function to select the button that the phone is tilted towards,
 * by calling one of the following functions:
 *    selectYellowButton
 *    selectRedButton
 *    selectBlueButton
 *    selectGreenButton
*/


/*
 * If in touch mode then this is run when user doesnt enter a valid input in time and is considered a loss as user has given up.
 *
 * But if in tilt mode it is considered as an input method that when this function runs if the phone is tilted above 45 degrees
 * in required directions towards a button it shows the button to be selected and clicks the button using the four functions
 * selectBottomRightButton() selectBottomLeftButton() selectTopLeftButton() selectTopRightButton() provided in main.js when run and sets the userMadeChoice 
 * to true so that this function can be retriggered and also acts as a loss if button selected is none which is not in the required 45 degrees
 * ranges.
*/
function userChoiceTimeout()
{
    // Include your own code here\
	
	
    if (tiltOn===false || button==="none")	
    {
		
        // given up counts as a single loss
	
	    lossStreak++;     // increase loss streak 
	    winStreak=0;      // reset win streak
	
	    if (lengthOfSeq!=startLength)
	    {		
            lengthOfSeq--;     // if user is not in starting level decrease the length of sequences.
            userColorNum--;
	    }
			
	        // if loss streak is 2 game is reset.
	    if (lossStreak===resetLossStreak)
	    {				
		    lengthOfSeq=startLength;
		    lossStreak=0;
	        userColorNum=startLength;
	    }
		
		// output will include beta and gamma values and button selected details only if tilt is on.
	    if (tiltOn===false)
		{
			userColorNum=lengthOfSeq;
            output.innerText="\n"+"General status:  Watch a sequence."+"\n"+" Number of items remaining to be entered: "+(lengthOfSeq-userColorNum)+"\n"+"Length of current sequence: "+lengthOfSeq+"\n"+"Number of correct sequences entered at the current level: "+winStreak+"\n"+"Correct sequences needed to advance to the next level: "+(lengthOfSeq-2-winStreak)+"\n"+"\n";
	    }
	    else
		{
			userColorNum=lengthOfSeq;
	        output.innerText="\n"+"General status:  Watch a sequence."+"\n"+" Number of items remaining to be entered: "+(lengthOfSeq-userColorNum)+"\n"+"Length of current sequence: "+lengthOfSeq+"\n"+"Number of correct sequences entered at the current level: "+winStreak+"\n"+"Correct sequences needed to advance to the next level: "+(lengthOfSeq-2-winStreak)+"\n"+"\n"+"Beta tilt of the device: "+betaVal + "\n" + "Gamma tilt of the device: "+gammaVal+"\n"+"Button selected : "+button;	
		}	
    }
	
    else
    {
	    /*
		* when userChoiceTimeout runs once and ends it takes it as userMadeChoice as false in the main javascript so to be able to keep iterating
	    * the userChoiceTimeout function until all the neccessary colors are entered we make userMadeChoice true to be able to get userChoiceTimeout 
	    * function to delay and occur again
		*/
	
	    // select the button being selected by the deviceorientation event when userChoiceTimeout occurs and to make the userChoiceTimeout run multiple times make userMadeChoice true.
	    switch (button)
	    {
		    case "red":
		    selectBottomRightButton()
		    userMadeChoice = true;
		    break;
		
		    case "green":
		    selectTopRightButton()
		    userMadeChoice = true;
		    break;
		   	
		    case "yellow":
		    selectBottomLeftButton()
		    userMadeChoice = true;
		    break;
			
		    case "blue":
		    selectTopLeftButton()
		    userMadeChoice = true;
		    break;
			
	    }
		
	}	

}

/*
 * This callback function will be called when the user taps the button at the
 * top-right of the title bar to toggle between touch- and tilt-based input.
 *
 * The mode parameter will be set to the newly selected mode, one of:
 *    TOUCH_MODE
 *    TILT_MODE
*/

/*
 * Every time the button of change mode is clicked function changes details by adding or removing the beta and gamma value outputs
 * on the screen this is done by checking if the tilt mode is on or not beforehand to output only required information for the input
 * method.
 *
 * inputs: mode-gives the mode that it currently becomes when button is clicked either TOUCH_MODE or TILT_MODE.
*/

var tiltOn=false;

function changeMode(mode)
{
    // Include your own code here
	
	if (mode===TOUCH_MODE)
	{
	    tiltOn=false;		
	    // to reset and remove the beta values and gamma values being displayed when touch mode turns on. 
	    output.innerText="\n"+"General status:  Watch a sequence."+"\n"+" Number of items remaining to be entered: "+(lengthOfSeq-userColorNum)+"\n"+"Length of current sequence: "+lengthOfSeq+"\n"+"Number of correct sequences entered at the current level: "+winStreak+"\n"+"Correct sequences needed to advance to the next level: "+(lengthOfSeq-2-winStreak)+"\n"+"\n";

	}
    else
    {
	    tiltOn=true;
        // reset and add the beta and gamma values when the tilt mode turns on.
	    output.innerText="\n"+"General status:  Watch a sequence."+"\n"+" Number of items remaining to be entered: "+(lengthOfSeq-userColorNum)+"\n"+"Length of current sequence: "+lengthOfSeq+"\n"+"Number of correct sequences entered at the current level: "+winStreak+"\n"+"Correct sequences needed to advance to the next level: "+(lengthOfSeq-2-winStreak)+"\n"+"\n"+"Beta tilt of the device: "+betaVal+ "\n" + "Gamma tilt of the device: "+gammaVal+"\n"+"Button selected : "+button;
    }
	
}

// You may need to write other functions.

let button="none";
let betaVal,gammaVal;

/*
 * This deviceorientation event using an anonymous function is used to store the values of beta and gamma tilt of phone and what button currently being clicked
 * by tilt and does all this only if the tilt mode is on and returns these results for the userChoiceTimeout function to works in a different manner as intended
 * this also changes values of beta and gamma values to a string saying that they are "not in a required tilt to select a button" and output this as a message to 
 * tell the player to tilt further to required buttons directions since he is currently in a state where device is assumed to be flat and not within required
 * tolerance,but if his/her tilt is further than the required tolerence of 45 degrees for gamma and beta in button specific directions then button is set to the
 * required button to be pressed.
*/

window.addEventListener('deviceorientation',function(event)
{
	
    if (tiltOn===true)     // the entire code block below only runs when tilt mode is on
    {
		
	    // round both betaVal and gammaVal to 2 dp to retain a needed amount of accuracy for code to run and make it easier to display the values on screen.
		betaVal=event.beta.toFixed(2) ;
	    gammaVal=event.gamma.toFixed(2) ;
	
	    // switch statement to find the button being selected at every moment and changes it.
	    switch (true)
	    {
	
		    case (betaVal>=45 && gammaVal>=45) :     // button variable set to "red" since red is being selected.
	        button="red";  
		    break;
			
	        case (betaVal<=-45 && gammaVal>=45) :     // button variable set to "green" since green is being selected.
		    button="green";
		    break;
			
		    case (betaVal>=45 && gammaVal<=-45) :     // button variable set to "yellow" since yellow is being selected.
		    button="yellow";
	        break;
			
		    case (betaVal<=-45 && gammaVal<=-45) :     // button variable set to "blue" since blue is being selected.
		    button="blue";	
		    break;
			
		    default:     // if button is "none" device is not within required tilt and is assumed to be flat.
		    button="none";
			betaVal=" not in a required tilt to select a button";
			gammaVal=" not in a required tilt to select a button"
            break;
		}
		
		sequenceHasDisplayed();
		
		
	}
	
});