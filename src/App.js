import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [question, setStem] = useState("Loading...");
    const [stimulus, setStimulus] = useState("Loading...");
    const [option1, setOption1] = useState({ text: "Loading...", state: "n" });
    const [option2, setOption2] = useState({ text: "Loading...", state: "n" });
    const [option3, setOption3] = useState({ text: "Loading...", state: "n" });
    const [option4, setOption4] = useState({ text: "Loading...", state: "n" });
    const [clicked, setClicked] = useState(false);
    const [ans, setAns] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            let data = JSON.stringify({
                "external_id": "6537fc25-1318-49e9-9e1e-dcc07604c519"
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-question',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'your-cookie-here' // Replace with a real cookie if needed
                },
                data: data
            };

            try {
                const response = await axios.request(config);
                setStimulus(response.data.stimulus);
                setStem(response.data.stem);
                setOption1({ text: `<p class='mr-2'>A. </p>${response.data.answerOptions[0].content}`, state: "n" });
                setOption2({ text: `<p class='mr-2'>B. </p>${response.data.answerOptions[1].content}`, state: "n" });
                setOption3({ text: `<p class='mr-2'>C. </p>${response.data.answerOptions[2].content}`, state: "n" });
                setOption4({ text: `<p class='mr-2'>D. </p>${response.data.answerOptions[3].content}`, state: "n" });
                setAns(response.data.correct_answer[0]);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run only once on mount

    const handleClick = (option) => () => {
        if (!clicked) {
            setClicked(true);
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
            }
            switch (ans) {
                case 'A':
                    setOption1({text: option1.text, state:'c'});
                    break;
                case 'B':
                    setOption2({text: option2.text, state:'c'});
                    break;
                case 'C':
                    setOption3({text: option3.text, state:'c'});
                    break;
                case 'D':
                    setOption4({text: option4.text, state:'c'});
                    break;
            }
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

    return (
        <div className="m-20">
            <div className="m-20">
                <p className="font-black text-gray-500">Question:</p>
                <div dangerouslySetInnerHTML={{ __html: stimulus }} className="m-8"></div>
                <div dangerouslySetInnerHTML={{ __html: question }} className="my-4"></div>
                <div className="flex flex-col my-4">
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option1.state)}`}
                        dangerouslySetInnerHTML={{ __html: option1.text }}
                        onClick={handleClick("A")}
                    />
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option2.state)}`}
                        dangerouslySetInnerHTML={{ __html: option2.text }}
                        onClick={handleClick("B")}
                    />
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option3.state)}`}
                        dangerouslySetInnerHTML={{ __html: option3.text }}
                        onClick={handleClick("C")}
                    />
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option4.state)}`}
                        dangerouslySetInnerHTML={{ __html: option4.text }}
                        onClick={handleClick("D")}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
/*

import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [question, setStem] = useState("Loading...");
    const [stimulus, setStimulus] = useState("Loading...");

    const [option1, setOption1] = useState({text: "Loading...", state:"n"});
    const [option2, setOption2] = useState({text: "Loading...", state:"n"});
    const [option3, setOption3] = useState({text: "Loading...", state:"n"});
    const [option4, setOption4] = useState({text: "Loading...", state:"n"});

    const [clicked, setClicked] = useState(false);
    const [ans, setAns] = useState(null);

    let data = JSON.stringify({
        "external_id": "6537fc25-1318-49e9-9e1e-dcc07604c519"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-question',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': '_abck=0856A2AE577430F99EAA75DC0DFBFE93~-1~YAAQ78rcF7MaLNaSAQAAR42d4gyEG4u+B8nutAjCNT4KyadX2Q+o7fqjwx3P4M/nVuWCC3CqxnbW4ErWVwI0VLBFu8Z4fbQ/7Ljp+vGBuJvsympmQt6a7Ueb1lKvccL274U0VyPQOod14hsZ/JTyiduVMY2a+HbopWHGU3bHkxqzasLa+ikBY4mr8WZro341kropC1JNhkDAWu0ALTZOJgjNjaVfemT5m10HnD1IT/t/MzLMurZENYqx7KDRO44t/XwSEAndsJrvsyzd6AVFvohLcxyMDTFohZwF9Oay7wBjUyXyhbPyomjyfJ7rhrsrCkrPpvNqhFkZxu4MU8rWn38PEMvuw0+F62NTbpwAi1mT8/kI/v83yKNpWsa/TAzPlCOYza9hLbpxkFLV0Eg4WMRfYn6xAWu8EQrVhCO6rj2HiSs9ZycQgybu8JSvKQ==~-1~-1~-1; ak_bmsc=B966E5D63784351AC42CCBA83E551F0D~000000000000000000000000000000~YAAQ78rcF7QaLNaSAQAAR42d4hl/Kv4+/uoIwkHXdsHiBKiaYEnIIYjaZD8U4orjckgq0xVgg0deDPd9cdf3TWFWx9MIrx7/C5tpkgk8I9K3QIDflOWR454AtTW0DpCKaQZENW4/9ZxzHBI9U1T+YUjvEgndZfC1CHj49XJHUgIe0aCykf5bk2wKakuF1ZHQw1alGoqgbEMUpwTVY5lpCAeaijdFCE1JAQLLFWtjOFs3TG6hdcLHreGfoqcgs9ilJicn39Y2dcWJ2YMM+Qhn8SmzPpD1WPKiLa2Yq2TDsjpY/EqA7WXDCze8LzlrYXoc9Gluy+4u0bmKhntgEdYI7EkHvr2bLaqJ1ctACifvozA=; bm_sv=3ADCBA6CC8CB97D358E2E43A669BE10A~YAAQ78rcF4JoLNaSAQAAiAyf4hms8Aa5ydJhcbvXKI1aQKW3Dr1Zt88yKmmE5MAduVlofcydNzVGFcjFpouPStquMQc0bfoS8GNRpVC9QDPOPL2opSBendnirbeZ+ldp7dUzqI23OkZ9N/Ar6/zEuL4uZLeS6Pe5IwlLXbtpvgJkmZE+qmm/jPCNvfxSl5O/9blN3tNA5F9x7zZgImsT+RQ3HB+SC/1zc8l3xqMDt1uaHMtz8bsMEvVi8Jf2/ohq0KsEy3KZ~1; bm_sz=21869C9F784CEA6BBF0CDD3A1F082423~YAAQ78rcF7UaLNaSAQAAR42d4hlfP2p8ntPkaMT3VIeqLJGatrwECFZyXkBZDaSISj9Yeugg7gA15FZhjYR8RifjaqGY6FbzL8V6i9QLzwKETGRNjzB6RLaeMvlF6fUGxfb5YucGWI1ho3LrTzpm1BIggpN2AxNnTPBiTUKopNso7XkASbGZAcweswUQ94cVPhyg+BZX8WFfORX80XPQ9zw3YorrzySMgFFT2kjy+uV8Vi+kyYttY7V2vMuTVr03jNnovgX4TRVnrCwivme8V4mJwqrATSSMxk4hQWY0LNhwTdKJyfD/9BcPb4Uhj9ipQ8K1/i2BswPGFRBkKgIgT/zhZO2mfJnLPAgNiLH6nX//TA==~4273714~3158337'
        },
        data : data
    };

    axios.request(config)
        .then((response) => {
            setStimulus(response.data.stimulus);
            setStem(response.data.stem);
            setOption1({text: "<p class='mr-2'>A. </p>"+response.data.answerOptions[0].content, state:"n"});
            setOption2({text: "<p class='mr-2'>B. </p>"+response.data.answerOptions[1].content, state:"n"});
            setOption3({text: "<p class='mr-2'>C. </p>"+response.data.answerOptions[2].content, state:"n"});
            setOption4({text: "<p class='mr-2'>D. </p>"+response.data.answerOptions[3].content, state:"n"});
            setAns(response.data.correctAnswer[0]);
        })
        .catch((error) => {
            console.log(error);
        })

    const handleClick= function (option) {
        if (!clicked) {
            switch (option) {
                case 'A':
                    setOption1({text: option1.text, state:'i'})
                case 'B':
                    setOption2({text: option1.text, state:'i'})
                case 'C':
                    setOption3({text: option1.text, state:'i'})
                case 'D':
                    setOption4({text: option1.text, state:'i'})
            }
            switch (ans) {
                case 'A':
                    setOption1({text: option1.text, state:'c'})
                case 'B':
                    setOption2({text: option1.text, state:'c'})
                case 'C':
                    setOption3({text: option1.text, state:'c'})
                case 'D':
                    setOption4({text: option1.text, state:'c'})
            }
        }
    }

    const getButtonColor = (state) => {
        switch(state) {
            case 'c':
                return 'bg-green-700 hover:bg-green-900';
            case 'i':
                return 'bg-red-700 hover:bg-red-900';
            default:
                return 'bg-blue-700 hover:bg-blue-900';
        }
    }

    return (
        <div className="m-20">
            <div className="m-20">
                <p className="font-black text-gray-500">Question:</p>
                <div dangerouslySetInnerHTML={{__html: stimulus}} className='m-8'></div>
                <div dangerouslySetInnerHTML={{__html: question}} className='my-4'></div>
                <div className="flex flex-col my-4">
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option1.state)}`}
                        dangerouslySetInnerHTML={{__html: option1.text}} onClick={handleClick("A")}/>
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option2.state)}`}
                        dangerouslySetInnerHTML={{__html: option2.text}} onClick={handleClick("B")}/>
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option3.state)}`}
                        dangerouslySetInnerHTML={{__html: option3.text}} onClick={handleClick("C")}/>
                    <button
                        className={`border-2 border-black rounded p-2 text-white shadow-lg my-4 hover:shadow-inner text-left flex flex-row ${getButtonColor(option4.state)}`}
                        dangerouslySetInnerHTML={{__html: option4.text}} onClick={handleClick("D")}/>
                </div>
            </div>
        </div>
    );
}

export default App;*/