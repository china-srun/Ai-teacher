import './App.css';
import React, { useState } from 'react';
import { Amplify, Predictions } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import mic from 'microphone-stream';
Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

function App() {

  function SpeechToText(props) {
    const [response, setResponse] = useState("Press 'start recording' to begin your transcription. Press STOP recording once you finish speaking.")

    function AudioRecorder(props) {
      const [recording, setRecording] = useState(false);
      const [micStream, setMicStream] = useState();
      const [audioChunks, setAudioChunks] = useState([]);

      async function startRecording() {
        console.log('start recording');
        setAudioChunks([]);

        window.navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
          const startMic = new mic();

          startMic.setStream(stream);
          startMic.on('data', (chunk) => {
            var raw = mic.toRaw(chunk);
            if (raw == null) {
              return;
            }
            setAudioChunks((prevChunks) => [...prevChunks, raw]);
          });

          setRecording(true);
          setMicStream(startMic);
        });
      }

      async function stopRecording() {
        console.log('stop recording');
        const { finishRecording } = props;

        micStream.stop();
        setMicStream(null);
        setRecording(false);

        const blob = new Blob(audioChunks, { type: 'audio/wav' });

        if (typeof finishRecording === "function") {
          finishRecording(blob);
        }
      }

      return (
        <div className="audioRecorder">
          <div>
            {recording && <button onClick={stopRecording}>Stop recording</button>}
            {!recording && <button onClick={startRecording}>Start recording</button>}
          </div>
        </div>
      );
    }

    function convertFromBuffer(blob) {
      setResponse('Converting text...');

      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        Predictions.convert({
          transcription: {
            source: {
              bytes: data,
            },
          },
        })
          .then(({ transcription: { fullText } }) => setResponse(fullText))
          .catch((err) => setResponse(JSON.stringify(err, null, 2)));
      };
      reader.readAsArrayBuffer(blob);
    }

    return (
      <div className="Text">
        <div>
          <h3>Speech to text</h3>
          <AudioRecorder finishRecording={convertFromBuffer} />
          <p>{response}</p>
        </div>
      </div>
    );
  }

  function TextToSpeech() {
    const [response, setResponse] = useState("...");
    const [textToGenerateSpeech, setTextToGenerateSpeech] = useState("write to speech");

    function generateTextToSpeech() {
      setResponse('Generating audio...');
      Predictions.convert({
        textToSpeech: {
          source: {
            text: textToGenerateSpeech,
          },
          voiceId: "Salli", // default configured on aws-exports.js
          // list of different options are here https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
        },
      })
        .then((result) => {
          const audioData = result.audioStream;
          const audioBlob = new Blob([audioData], { type: 'audio/mp3' });

          const audioElement = new Audio();
          audioElement.src = URL.createObjectURL(audioBlob);
          audioElement.play();

          setResponse('Generation completed, press play');
        })
        .catch((err) => setResponse(err));
    }

    function setText(event) {
      setTextToGenerateSpeech(event.target.value);
    }

    return (
      <div className="Text">
        <div>
          <h3>Text To Speech</h3>
          <input value={textToGenerateSpeech} onChange={setText}></input>
          <button onClick={generateTextToSpeech}>Text to Speech</button>
          <h3>{response}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      Speech Generation
      <TextToSpeech />
      <br />
      Transcribe Audio
      <SpeechToText />
    </div>
  );
}

export default App;
