import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Cookies from 'js-cookie';

async function getNewQuestion(setStimulus, setStem, setOption1, setOption2, setOption3, setOption4, setAns, ind, setDiff) {
    try {
        // First request: Get the list of questions
        const questionListResponse = await axios.post('https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-questions',
            JSON.stringify({
                "asmtEventId": 100,
                "test": 1,
                "domain": "INI,CAS,EOI,SEC"
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'your-cookie-here' // Replace with a real cookie if needed
                },
                maxBodyLength: Infinity
            }
        );

        // Choose the first question's external_id from the list
        const questionList = questionListResponse.data;
        if (questionList.length === 0) {
            console.log("No questions available.");
            return;
        }
        const externalId = questionList[ind].external_id;  // You could also pick a random one or let the user choose
        setDiff(questionList[ind].difficulty)
        // Second request: Get the full question details using external_id
        const questionDetailResponse = await axios.post('https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-question',
            JSON.stringify({ "external_id": externalId }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'your-cookie-here' // Replace with a real cookie if needed
                },
                maxBodyLength: Infinity
            }
        );

        // Populate UI with question details
        const questionData = questionDetailResponse.data;
        setStimulus(questionData.stimulus);
        setStem(questionData.stem);
        setOption1({ text: `<p class='mr-2'>A. </p>${questionData.answerOptions[0].content}`, state: "n" });
        setOption2({ text: `<p class='mr-2'>B. </p>${questionData.answerOptions[1].content}`, state: "n" });
        setOption3({ text: `<p class='mr-2'>C. </p>${questionData.answerOptions[2].content}`, state: "n" });
        setOption4({ text: `<p class='mr-2'>D. </p>${questionData.answerOptions[3].content}`, state: "n" });
        setAns(questionData.correct_answer[0])
    } catch (error) {
        console.error("Error fetching question:", error);
    }
}

function App() {
    const [question, setStem] = useState("Loading...");
    const [stimulus, setStimulus] = useState("Loading...");
    const [option1, setOption1] = useState({ text: "Loading...", state: "n" });
    const [option2, setOption2] = useState({ text: "Loading...", state: "n" });
    const [option3, setOption3] = useState({ text: "Loading...", state: "n" });
    const [option4, setOption4] = useState({ text: "Loading...", state: "n" });
    const [clicked, setClicked] = useState(false);
    const [ans, setAns] = useState(null);
    const [ind, setInd] = useState(parseInt(Cookies.get('ind') || '0', 10));
    const [corr, setCorr] = useState(parseInt(Cookies.get('corr') || '0', 10));
    const [option, setOption]=useState(Cookies.get('option') || null);
    const [diff, setdiff]=useState('null')
    const [streak, setStreak] = useState(parseInt(Cookies.get('streak') || '0', 10));

    useEffect(() => {
        setStimulus('Loading...');
        setStem('Loading...');
        setOption1({text: 'Loading...', state: option1.state});
        setOption2({text: 'Loading...', state: option2.state});
        setOption3({text: 'Loading...', state: option3.state});
        setOption4({text: 'Loading...', state: option4.state});
        getNewQuestion(setStimulus, setStem, setOption1, setOption2, setOption3, setOption4, setAns, ind, setdiff);
    }, [ind, option1.state, option2.state, option3.state, option4.state]);
    const func=()=>{
        if (option) {
            Cookies.set('option', option)
            switch (option) {
                case 'A':
                    setOption1({text: option1.text, state:'i'});
                    break;
                case 'B':
                    setOption2({text: option2.text, state:'i'});
                    break;
                case 'C':
                    setOption3({text: option3.text, state:'i'});
                    break;
                case 'D':
                    setOption4({text: option4.text, state:'i'});
                    break;
                default:
                    break;
            }
            switch (ans) {
                case 'A':
                    setOption1({text: option1.text, state: 'c'});
                    break;
                case 'B':
                    setOption2({text: option2.text, state: 'c'});
                    break;
                case 'C':
                    setOption3({text: option3.text, state: 'c'});
                    break;
                case 'D':
                    setOption4({text: option4.text, state: 'c'});
                    break;
                default:
                    break;
            }
        }
    }
    useEffect(func, [option, option1.text, option2.text, option3.text, option4.text, ans]);
    const handleClick = (option_) => () => {
        if (!clicked) {
            if (option_===ans) {
                console.log('correct');
                Cookies.set('corr', corr+1);
                setCorr(corr+1);
                setStreak(streak+1);
            } else {
                setStreak(0);
            }
            setOption(option_);
            func();
            setClicked(true);
        }
    };

    const getButtonColor = (state) => {
        switch (state) {
            case 'c':
                return 'bg-green-700 hover:bg-green-900';
            case 'i':
                return 'bg-red-700 hover:bg-red-900';
            default:
                return 'bg-blue-700 hover:bg-blue-900';
        }
    };
    const next = () => {
        setClicked(false);
        if (clicked) {
            const newInd = ind + 1;
            setInd(newInd);
            setOption(null);
            Cookies.set('ind', newInd);
        }
    };

    return (
        <div>
            <div className="m-20">
                <p className='text-right font-black text-gray-700'>Streak: {streak}</p>
                <p className='text-right font-black text-gray-700'>Difficulty: {diff}</p>
                <p className='text-right font-black text-gray-700'>Question {ind + 1}</p>
                <p className='text-right font-black text-gray-700'>{corr}/{clicked ? ind + 1 : ind} correct</p>
                <p className="font-black text-gray-700">Question:</p>
                <div dangerouslySetInnerHTML={{__html: stimulus}} className="my-8"></div>
                <div dangerouslySetInnerHTML={{__html: question}} className="my-12"></div>
                <div className="flex flex-col my-4">
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option1.state)}`}
                        dangerouslySetInnerHTML={{__html: option1.text}}
                        onClick={handleClick("A")}
                    />
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option2.state)}`}
                        dangerouslySetInnerHTML={{__html: option2.text}}
                        onClick={handleClick("B")}
                    />
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option3.state)}`}
                        dangerouslySetInnerHTML={{__html: option3.text}}
                        onClick={handleClick("C")}
                    />
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option4.state)}`}
                        dangerouslySetInnerHTML={{__html: option4.text}}
                        onClick={handleClick("D")}
                    />
                </div>
                {clicked ? <button onClick={next}
                                   className='bg-gray-700 text-white p-4 rounded text-right hover:bg-gray-800'>Next</button> : null}
            </div>
        </div>
    );
}

export default App;