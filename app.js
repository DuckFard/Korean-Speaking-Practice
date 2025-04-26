(function(window) {
  // Render saved text snippets in the sidebar
  function renderSnippetList() {
    const listEl = document.getElementById('snippet-list');
    listEl.innerHTML = '';
    const snippets = window.Storage.loadSnippets();
    snippets.forEach((text, idx) => {
      const li = document.createElement('li');
      li.className = 'mb-2';
      const preview = text.length > 30 ? text.slice(0, 30) + '…' : text;
      li.textContent = preview;
      const delBtn = document.createElement('button');
      delBtn.className = 'button is-small is-danger is-light ml-2';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        window.Storage.removeSnippet(idx);
        renderSnippetList();
      });
      li.appendChild(delBtn);
      listEl.appendChild(li);
    });
  }

  // === Part 2 Enhancements ===
  let selectedTopicIdx = null;

  // Render the list of topics in #topic-list
  function renderTopicList() {
    console.log("--- Rendering Topic List ---"); // Log start of render
    const topicListEl = document.getElementById('topic-list');
    if (!topicListEl) {
        console.error("#topic-list element not found!");
        return;
    }
    topicListEl.innerHTML = '';
    let deck;
    try {
        deck = window.grammarStorage.loadDeck();
        console.log("Loaded Deck for Rendering:", deck); // Log loaded deck
    } catch (e) {
        console.error("Error loading deck for rendering:", e);
        deck = [];
    }

    if (!deck || deck.length === 0) {
        console.log("Deck is empty, nothing to render.");
        return;
    }

    deck.forEach((topic, idx) => {
      console.log(`Rendering topic ${idx}: ${topic.name}`); // Log each topic being rendered
      // <li data-idx="idx" class="topic-item">Topic Name [Delete]</li>
      const li = document.createElement('li');
      li.className = 'mb-2';
      li.dataset.idx = idx;

      const titleSpan = document.createElement('span');
      titleSpan.textContent = topic.name;
      titleSpan.style.cursor = 'pointer';
      titleSpan.addEventListener('click', () => selectTopic(idx));

      const delBtn = document.createElement('button');
      delBtn.className = 'button is-small is-danger is-light ml-2';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', (e) => { // Added event arg
        e.stopPropagation(); // Prevent topic selection when deleting
        window.grammarStorage.removeTopic(idx);
        if (selectedTopicIdx === idx) {
          selectedTopicIdx = null;
          const qm = document.getElementById('question-manager');
          if(qm) qm.style.display = 'none';
        }
        renderTopicList();
      });

      li.appendChild(titleSpan);
      li.appendChild(delBtn);
      topicListEl.appendChild(li);
    });
     console.log("--- Finished Rendering Topic List ---"); // Log end of render
  }

  // Handle when a topic is clicked: show question manager
  function selectTopic(idx) {
    selectedTopicIdx = idx;
    const deck = window.grammarStorage.loadDeck();
    document.getElementById('selected-topic-name').textContent = deck[idx].name;
    document.getElementById('question-manager').style.display = 'block';
    renderQuestionList();
  }

  // Render the questions for the selected topic in #question-list
  function renderQuestionList() {
    if (selectedTopicIdx === null) return; // Guard against no selection
    const questionListEl = document.getElementById('question-list');
    questionListEl.innerHTML = '';
    const deck = window.grammarStorage.loadDeck();
    const questions = deck[selectedTopicIdx].questions;

    questions.forEach((q, qi) => {
      const li = document.createElement('li');
      li.className = 'mb-2';

      const qSpan = document.createElement('span');
      qSpan.textContent = q;

      const delBtn = document.createElement('button');
      delBtn.className = 'button is-small is-danger is-light ml-2';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        window.grammarStorage.removeQuestion(selectedTopicIdx, qi);
        renderQuestionList();
      });

      li.appendChild(qSpan);
      li.appendChild(delBtn);
      questionListEl.appendChild(li);
    });
  }

  // Define parseBulkInput BEFORE init
  function parseBulkInput(text) {
    console.log("--- Starting Bulk Input ---");
    console.log("Raw Text:", text);
    // Correctly split by actual newline characters
    const lines = text.split(/\r?\n/);
    console.log("Lines:", lines);
    const deck = [];
    let currentTopic = null;

    lines.forEach((line, index) => {
      const trimmed = line.trim(); // Trim the line first
      console.log(`Processing line ${index}: "${trimmed}"`);
      if (!trimmed) { // Skip blank lines
          console.log("  Skipping blank line.");
          return;
      }

      // Use the trimmed line for matching
      const topicMatch    = /^\d+\.\s*(.+)$/.exec(trimmed);
      const questionMatch = /^\d+\)\s*(.+)$/.exec(trimmed); // Corrected regex

      if (topicMatch) {
        console.log("  Matched Topic:", topicMatch[1].trim());
        currentTopic = { name: topicMatch[1].trim(), questions: [] };
        deck.push(currentTopic);
      } else if (questionMatch && currentTopic) {
        console.log("  Matched Question:", questionMatch[1].trim());
        currentTopic.questions.push(questionMatch[1].trim());
      } else {
        console.log("  No match on this line.");
      }
    });

    console.log("Parsed Deck:", deck);
    try {
        window.grammarStorage.saveDeck(deck);
        console.log("Deck saved to localStorage.");
    } catch (e) {
        console.error("Error saving deck:", e);
    }
    renderTopicList();
    selectedTopicIdx = null;
    const qm = document.getElementById('question-manager');
    if (qm) qm.style.display = 'none';
    console.log("--- Finished Bulk Input ---");
  }

  // Define recording functions BEFORE renderCard
  function startAnswerRecording() {
    // reuse part1 recorder
    window.part1.startRecording();
  }
  // Make this async to await the promise from part1.stopRecording
  async function stopAnswerRecording() {
    const answerPlaybackEl = document.getElementById('answer-playback');
    const playbackEl = document.getElementById('playback'); // Still need for cleanup

    try {
      // Await the blob URL from part1.js
      const blobUrl = await window.part1.stopRecording();

      if (blobUrl && blobUrl.startsWith('blob:')) {
        if (answerPlaybackEl) {
          answerPlaybackEl.src = blobUrl;
        }
      } else {
        // If no valid URL, clear the playback
        if (answerPlaybackEl) {
          answerPlaybackEl.removeAttribute('src');
        }
      }
    } catch (error) {
      console.error("Error stopping recording or getting blob URL:", error);
      if (answerPlaybackEl) {
        answerPlaybackEl.removeAttribute('src');
      }
    } finally {
      // Cleanup the original playback element regardless of success/failure
      if (playbackEl) {
        playbackEl.removeAttribute('src');
        if (playbackEl.srcObject) {
          playbackEl.srcObject.getTracks().forEach(track => track.stop());
          playbackEl.srcObject = null;
        }
      }
    }
  }

  // Define renderCard AFTER recording functions
  function renderCard(card) {
    const topicEl    = document.getElementById('card-topic');
    const questionEl = document.getElementById('card-question');
    const nextBtn    = document.getElementById('next-card-btn');

    if (card) {
      topicEl.textContent    = card.topic;
      questionEl.textContent = card.question || '(no questions)'; // Keep handling empty questions
      nextBtn.disabled       = false;
      const answerPlaybackEl = document.getElementById('answer-playback');
      if (answerPlaybackEl) {
          answerPlaybackEl.removeAttribute('src');
      }
      // Check state before starting
      if (window.part1 && window.part1.recorderState !== 'recording') {
          startAnswerRecording();
      }
    } else {
      topicEl.textContent    = '🎉 대박~~잘 했어요!!!';
      questionEl.textContent = '🎉 You’ve reached the end of the deck!'; // Updated message
      nextBtn.disabled       = true;
      // Stop recording if we hit the end
      // No need to check state here, stopAnswerRecording handles it
      stopAnswerRecording(); // This is now async, but we don't need to await it here
    }
  }

  // Define init AFTER helper functions
  function init() {
    // Part 1: Read-Aloud & Snippet Management
    document.getElementById('add-snippet-btn').addEventListener('click', () => {
      const textarea = document.getElementById('snippet-input');
      const text = textarea.value.trim();
      if (text) {
        window.Storage.addSnippet(text);
        textarea.value = '';
        renderSnippetList();
      }
    });
    document.getElementById('next-text-btn').addEventListener('click', () => {
      document.getElementById('display-area').textContent = window.part1.getRandomSnippet();
    });
    document.getElementById('play-btn').addEventListener('click', () => {
      const txt = document.getElementById('display-area').textContent;
      if (txt && !txt.startsWith('No snippets')) {
        window.part1.playText(txt);
      }
    });
    const recordBtn = document.getElementById('record-btn');
    recordBtn.addEventListener('click', () => {
      if (window.part1.recorderState === 'inactive') {
        window.part1.startRecording();
        recordBtn.textContent = 'Stop';
        recordBtn.classList.replace('is-danger', 'is-warning');
      } else {
        window.part1.stopRecording();
        recordBtn.textContent = 'Record';
        recordBtn.classList.replace('is-warning', 'is-danger');
      }
    });

    // Part 2: Grammar Flashcards UI
    // Get references needed within init for Part 2
    const addTopicBtn        = document.getElementById('add-topic-btn'); // Added back
    const newTopicInput      = document.getElementById('new-topic-input'); // Added back
    const addQuestionBtn     = document.getElementById('add-question-btn'); // Added back
    const newQuestionInput   = document.getElementById('new-question-input'); // Added back
    const prevCardBtn        = document.getElementById('prev-card-btn');
    const nextCardBtn        = document.getElementById('next-card-btn');
    const restartBtn         = document.getElementById('restart-deck-btn');
    // const bulkInputArea    = document.getElementById('bulk-input-area'); // Removed
    // const processBulkBtn   = document.getElementById('process-bulk-btn'); // Removed

    // Add Topic
    // Ensure elements exist before adding listeners
    if (addTopicBtn && newTopicInput) {
        addTopicBtn.addEventListener('click', () => {
            // const newTopicInput = document.getElementById('new-topic-name'); // Incorrect ID used previously
            const topicName = newTopicInput.value.trim();
            if (topicName) {
              window.grammarStorage.addTopic(topicName);
              newTopicInput.value = ''; // Clear input
              renderTopicList(); // Re-render topic list
            }
        });
        newTopicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTopicBtn.click();
        });
    } else {
        console.warn("Add Topic button or input not found.");
    }

    // Add Question (to selected topic)
    // Ensure elements exist before adding listeners
    if (addQuestionBtn && newQuestionInput) {
        addQuestionBtn.addEventListener('click', () => {
            // const newQuestionInput = document.getElementById('new-question-text'); // Incorrect ID used previously
            const questionText = newQuestionInput.value.trim();
            if (selectedTopicIdx !== null && questionText) {
              window.grammarStorage.addQuestion(selectedTopicIdx, questionText);
              newQuestionInput.value = ''; // Clear input
              renderQuestionList(); // Re-render question list
            }
        });
        newQuestionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addQuestionBtn.click();
        });
    } else {
        console.warn("Add Question button or input not found.");
    }

    // Card Navigation
    // Ensure elements exist before adding listeners
    if (nextCardBtn) {
        nextCardBtn.addEventListener('click', () => {
          stopAnswerRecording(); // Stop recording before getting next card
          const card = window.part2.getNextCard();
          renderCard(card);
        });
    } else {
        console.warn("Next Card button not found.");
    }
    if (prevCardBtn) {
        prevCardBtn.addEventListener('click', () => {
          stopAnswerRecording(); // Stop recording before getting previous card
          const card = window.part2.getPrevCard();
          renderCard(card);
        });
    } else {
        console.warn("Previous Card button not found.");
    }
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          stopAnswerRecording(); // Stop recording before restarting
          const first = window.part2.restartSession();
          renderCard(first);
          if (nextCardBtn) nextCardBtn.focus();
        });
    } else {
        console.warn("Restart Deck button not found.");
    }

    // Bulk Input Processing - REMOVED
    // if (processBulkBtn && bulkInputArea) {
    //     processBulkBtn.addEventListener('click', () => {
    //         const text = bulkInputArea.value;
    //         parseBulkInput(text);
    //     });
    // } else {
    //     console.warn("Bulk input elements not found.");
    // }

    // Initial render calls for Part 2
    renderTopicList(); // Render topics first
    window.part2.startSession();
    renderCard(window.part2.getNextCard()); // Calls renderCard (line ~194)
  }

  // Simplified tab switching logic
  function initTabSwitching() {
    const tabs = document.querySelectorAll('nav.tabs li');
    const modules = document.querySelectorAll('.module-box');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const part = tab.dataset.part; // e.g. "1", "2", ...

        // Show only the module-boxes matching this part
        modules.forEach(mod => {
          mod.style.display = (mod.dataset.part === part) ? '' : 'none';
        });

        // Update active tab class
        tabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
      });
    });

    // Ensure initial state is correct (Part 1 visible)
    const initialPart = '1';
    modules.forEach(mod => {
      mod.style.display = (mod.dataset.part === initialPart) ? '' : 'none';
    });
    // Use optional chaining ?. in case the element isn't found immediately (though it should be)
    document.querySelector(`nav.tabs li[data-part="${initialPart}"]`)?.classList.add('is-active');
  }

  // Run initial setup on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    init();
    initTabSwitching();
  });
})(window);
