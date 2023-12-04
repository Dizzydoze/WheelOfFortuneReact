import {useState} from "react";
import './App.css';
import RecordList from "./Record"
import Login from "./Login";
import User from "./User"
import Image from "./Image"


/**
 * Entry point for the whole app
 * @returns {JSX.Element}
 * @constructor
 */
export default function Game(){
    // default value for display is empty, update when there's something to update
    const [display, setDisplay] = useState('CLICK START TO PLAY!');
    // default value for random phrase is empty, update when game starts
    const [phrase, setPhrase] = useState(' ');
    // default value for hiddenPhrase is generated by default, update whenever there's a good guess
    const [hiddenPhrase, setHiddenPhrase] = useState('')
    const [previousGuesses, setPreviousGuesses] = useState('');
    // score for each game, default 100
    const [score, setScore] = useState(100);
    // userId auto return from google login
    const [userId, setUserId] = useState("");
    // once userName is submitted, call saveUser to save it into DB
    const [userName, setUserName] = useState("Anonymous");
    // end flag, true if current game ended, default false
    const [end, setEnd] = useState(false);
    // start flag
    const [start, setStart] = useState(false);
    // make sure the record can only been saved once
    const [saved, setSaved] = useState(false);


    /**
     * Input component call this function when form is submitted
     * @param input content input by user
     */
    function handleSubmit(input){
        // if valid, go process, if not, do nothing
        const valid = checkValidation(input, previousGuesses);
        if (valid){

            // process input
            const processResult = processGuess(phrase, hiddenPhrase, input)
            // good guess, update the state of hiddenPhrase(uncover)
            if (processResult){
                // the arrow function form helps maintain the order and consistency of state updates
                setHiddenPhrase(() => processResult);
            } else {  // bad guess
                setScore(()=> score - 1);
            }
        }
    }

    /**
     * helper method, check input validation
     * @param input new guess from user
     * @param previousGuesses buffer for duplication input checking
     * @returns {boolean}   whether the guess is legal input or not
     */
    function checkValidation(input , previousGuesses){
        if (!/[a-zA-Z]/.test(input.charAt(0))) {
            setDisplay(()=>"[TRY AGAIN] Only English Letter is Allowed!");
            return false;
        } else if (input.length !== 1) {
            setDisplay(()=>"[TRY AGAIN] Exact ONE Character for Each Guess!");
            return false;
        } else if (previousGuesses.includes(input.charAt(0))) {
            setDisplay(()=>"[TRY AGAIN] You've already guessed it before.");
            return false;
        } else {
            // update new valid guess previousGuesses
            const newPreviousGuesses = previousGuesses + input.charAt(0);
            setPreviousGuesses(()=> newPreviousGuesses);
            return true;
        }
    }

    /**
     * reset all state whenever the game restarts
     */
    function handleStart(){
        // generate randomPhrase and update the phrase state
        const newRandomPhrase = randomPhrase();
        setPhrase(() => newRandomPhrase);
        // generate hiddenPhrase base on the newRandomPhrase
        const newHiddenPhrase = generateHiddenPhrase(newRandomPhrase);
        setHiddenPhrase(() => newHiddenPhrase);

        // RESET everything for new game
        setDisplay(()=> "New Game Started!");
        setPreviousGuesses(() => '');
        setScore(() => 100);
        setEnd(false);
        setStart(true);
        setSaved(false);
    }

    // set end flag to true
    {   ((score < 80 || hiddenPhrase === phrase) && end === false)
            &&
        (setEnd(true))
    }
    console.log(end, start);

    return (
        <div>
            {
                userId === ""
                    ?
                    <div>
                        <Login onLogin={setUserId}/>
                    </div>
                    :
                    <div className='game'>
                        <Image src='/WOF.gif'/>
                        <User userId={userId} userName={userName} setUserName={setUserName}/>
                        <button className="button" onClick={handleStart}>START</button>
                        { score < 80 ? <p>You Lose!</p> : (hiddenPhrase === phrase ? <p>You Win!</p> :<Display display={display}/>)}
                        <HiddenPhrase hiddenPhrase={hiddenPhrase}/>
                        {
                            (start === true && end === false)
                                ? <div>
                                    <Image src='/WOF2.gif' x={77} y={68}/>
                                    <Image src='/WOF3.gif' x={5} y={68}/>
                                    <p className='phrase'>Current Score: {score}</p>
                                    <Input onFormSubmit={handleSubmit}/>
                                </div>
                                : ""
                        }
                        <RecordList userId={userId} userName={userName} score={score} end={end} saved={saved} setSaved={setSaved}/>
                    </div>
            }
        </div>
    )
}


/**
 * Form component, handle form submission and get guess input
 * @param onFormSubmit  function being called when submit event triggered
 * @returns {JSX.Element}
 * @constructor
 */
function Input({onFormSubmit}){
    // default value for input is empty, update when form submitted
    const [inputValue, setInputValue] = useState('');

    const handleFormChange = function (event) {
        // update inputValue state
        setInputValue(() => event.target.value);
    }
    // function accept submitted event input as a parameter, called when related event happens
    const handleFormSubmit = function (event) {
        event.preventDefault();
        // call the function Game sent in
        onFormSubmit(inputValue);
        // reset the state for new input
        setInputValue(() => '');
    }
    // handleFormSubmit will be called, and onFormSubmit sent in by Game will be called next
    return (
        <form className='form' onSubmit={handleFormSubmit}>
            <label>
                Guess a Letter:
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleFormChange}
                />
            </label>
            <span style={{ margin: '0 10px'}}></span>
            <button className="button" type="submit">Submit</button>
        </form>
    )
}

/**
 * HiddenPhrase component, show latest hidden phrase
 * @param hiddenPhrase show hiddenPhrase state in HTML
 * @returns {JSX.Element}
 * @constructor
 */
function HiddenPhrase({hiddenPhrase}){
    return (
        <>
            {hiddenPhrase !== ''
                ?  <div className='phrase'>{hiddenPhrase}</div>
                :  ""
            }
        </>

    )
}


/**
 * Display component, show logs of current game
 * @param display show display state in HTML
 * @returns {JSX.Element}
 * @constructor
 */
function Display({display}){
    return (
        <div className="display">{display}</div>
    )
}


/**
 * helper method, get random phrase from the list
 * @returns {string} random phrase
 */
function randomPhrase(){
    const phraseList = [
        "Change the world from here",
        "Be the change you wish to see",
        "Turn your wounds into wisdom"
    ]
    const ranIdx = Math.floor(Math.random() * phraseList.length);
    return phraseList[ranIdx];
}


/**
 * helper method, gen hiddenPhrase
 * @param phrase the covered phrase
 * @returns {*}
 */
function generateHiddenPhrase(phrase) {
    return phrase.replace(/[a-zA-Z]/g, '*');
    }


/**
 * helper method, process guess input, good or bad guess
 * @param phrase original random phrase
 * @param hiddenPhrase latest hiddenPhrase
 * @param input our new guess from user
 * @returns {string|boolean}
 */
function processGuess(phrase, hiddenPhrase, input){
    // remember, state should be immutable, copy it and return a new phrase instead of modifying it directly
    if (phrase.indexOf(input) === -1 && phrase.indexOf(input.toUpperCase()) === -1) {
            return false;
        }
    // for string assignment, this is a deep copy
    let newHiddenPhrase = hiddenPhrase;
    for (let i = 0; i < phrase.length; i++) {
        const char = phrase[i];
        if (char === input || char === input.toUpperCase()) {
            // newHiddenPhrase = newHiddenPhrase.substring(0, i) + char + newHiddenPhrase.substring(i + 1);
            newHiddenPhrase = newHiddenPhrase.substring(0, i) + char + newHiddenPhrase.substring(i + 1);
        }
    }
    // good guess, return new hiddenPhrase for Game component to set value
    return newHiddenPhrase;
}
