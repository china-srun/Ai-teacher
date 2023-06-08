// import React, { useState } from 'react';
// import { Amplify, Predictions } from 'aws-amplify';
// import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
// import awsconfig from './aws-exports';
// Amplify.configure(awsconfig);
// Amplify.addPluggable(new AmazonAIPredictionsProvider());

// export function TextToSpeech() {
//     const [response, setResponse] = useState("...")
//     const [textToGenerateSpeech, setTextToGenerateSpeech] = useState("write to speech");
  
//     function generateTextToSpeech() {
//       setResponse('Generating audio...');
//       Predictions.convert({
//         textToSpeech: {
//           source: {
//             text: textToGenerateSpeech,
//           },
//           voiceId: "Amy" // default configured on aws-exports.js 
//           // list of different options are here https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
//         }
//       }).then(result => {
//         let AudioContext = window.AudioContext || window.webkitAudioContext;
//         console.log({ AudioContext });
//         const audioCtx = new AudioContext(); 
//         const source = audioCtx.createBufferSource();
//         audioCtx.decodeAudioData(result.audioStream, (buffer) => {
  
//           source.buffer = buffer;
//           source.connect(audioCtx.destination);
//           source.start(0);
//         }, (err) => console.log({err}));
  
//         setResponse(`Generation completed, press play`);
//       })
//         .catch(err => setResponse(err))
//     }
  
//     function setText(event) {
//       setTextToGenerateSpeech(event.target.value);
//     }
  
//     return (
//       <div className="Text">
//         <div>
//           <h3>Text To Speech</h3>
//           <input value={textToGenerateSpeech} onChange={setText}></input>
//           <button onClick={generateTextToSpeech}>Text to Speech</button>
//           <h3>{response}</h3>
//         </div>
//       </div>
//     );
//   }