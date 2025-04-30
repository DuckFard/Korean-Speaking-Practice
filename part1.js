// js/part1.js
(function(window) {
    let mediaRecorder = null;
    let recordedChunks = [];
    let recorderState = 'inactive';
  
    /** Get random snippet */
    function getRandomSnippet() {
      const snippets = window.Storage.loadSnippets();
      if (!snippets || snippets.length === 0) {
        return 'No snippets available. Please add some first.';
      }
      const idx = Math.floor(Math.random() * snippets.length);
      return snippets[idx];
    }
  
    /** Web Speech API*/
    function playText(text) {
      if (!text) return;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
    function startRecording() {
      if (recorderState === 'recording') return;
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
          recordedChunks = [];
          mediaRecorder = new MediaRecorder(stream);
  
          mediaRecorder.ondataavailable = function(event) {
            if (event.data && event.data.size > 0) {
              recordedChunks.push(event.data);
            }
          };
  
          mediaRecorder.onstop = function() {
            const blob = new Blob(recordedChunks, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            const audioEl = document.getElementById('playback');
            audioEl.src = url;
          };
  
          mediaRecorder.start();
          recorderState = 'recording';
        })
        .catch(function(err) {
          console.error('Microphone access denied or error:', err);
          alert('Unable to access microphone.');
        });
    }
  
    function stopRecording() {
      if (recorderState !== 'recording' || !mediaRecorder) return;
      mediaRecorder.stop();
      recorderState = 'inactive';
    }
  
    window.part1 = {
      getRandomSnippet,
      playText,
      startRecording,
      stopRecording,
      get recorderState() { return recorderState; }
    };
  })(window);
  