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

  let selectedTopicIdx = null;

  // Render the list of topics in #topic-list
  function renderTopicList() {
    const topicListEl = document.getElementById('topic-list');
    topicListEl.innerHTML = '';
    const deck = window.grammarStorage.loadDeck();

    deck.forEach((topic, idx) => {
      // <li data-idx="idx" class="topic-item">Topic Name [Delete]</li>
      const li = document.createElement('li');
      li.className = 'mb-2';
      li.setAttribute('data-idx', idx);

      const titleSpan = document.createElement('span');
      titleSpan.textContent = topic.name;
      titleSpan.style.cursor = 'pointer';
      titleSpan.addEventListener('click', () => {
        selectTopic(idx);
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'button is-small is-danger is-light ml-2';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        window.grammarStorage.removeTopic(idx);
        // If you deleted the selected topic, clear selection
        if (selectedTopicIdx === idx) {
          selectedTopicIdx = null;
          document.getElementById('question-manager').style.display = 'none';
        }
        renderTopicList();
      });

      li.appendChild(titleSpan);
      li.appendChild(delBtn);
      topicListEl.appendChild(li);
    });
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

  function init() {
    // Part 1: Read-Aloud & Snippet Management
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
    const prevCardBtn        = document.getElementById('prev-card-btn');
    const nextCardBtn        = document.getElementById('next-card-btn');
    const restartBtn         = document.getElementById('restart-deck-btn');
    const cardTopicEl        = document.getElementById('card-topic');
    const cardQuestionEl     = document.getElementById('card-question');

    /**
     * Render a flashcard or show end-of-deck state.
     * @param {{topic: string, question: string}|null} card
     */
    function renderCard(card) {
      const nextBtn = document.getElementById('next-card-btn'); // Get button inside function

      if (card) {
        // Normal card
        cardTopicEl.textContent    = card.topic;
        cardQuestionEl.textContent = card.question || '(no questions)'; // Keep handling empty questions
        nextBtn.disabled           = false;
      } else {
        // End of deck
        cardTopicEl.textContent    = '—';
        cardQuestionEl.textContent = '🎉 You’ve reached the end of the deck!';
        nextBtn.disabled           = true;
      }
    }

    // Initial render for topics
    renderTopicList();

    // Add new topic listener
    document.getElementById('add-topic-btn').addEventListener('click', () => {
      const input = document.getElementById('new-topic-input');
      const name = input.value.trim();
      if (name) {
        window.grammarStorage.addTopic(name);
        input.value = '';
        renderTopicList();
      }
    });

    // Add new question listener
    document.getElementById('add-question-btn').addEventListener('click', () => {
      const input = document.getElementById('new-question-input');
      const question = input.value.trim();
      if (question && selectedTopicIdx !== null) {
        window.grammarStorage.addQuestion(selectedTopicIdx, question);
        input.value = '';
        renderQuestionList();
      }
    });

    // Flashcard session controls
    nextCardBtn.addEventListener('click', () => {
      const card = window.part2.getNextCard();
      renderCard(card);
    });
    prevCardBtn.addEventListener('click', () => renderCard(window.part2.getPrevCard())); // Keep prev as is for now
    restartBtn.addEventListener('click', () => {
      const firstCard = window.part2.restartSession();
      renderCard(firstCard);
      // Optional: focus the Next button
      document.getElementById('next-card-btn').focus();
    });

    // Tab click handler: show/hide modules
    const modulesByPart = {
      '1': ['part1-module', 'snippet-manager'],
      '2': ['part2-module'],
      '3': ['part3-module'],
      '4': ['part4-module']
    };
    document.querySelectorAll('nav.tabs li').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('nav.tabs li').forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        document.querySelectorAll('#app .box, #snippet-manager').forEach(el => el.style.display = 'none');
        const part = tab.dataset.part;
        (modulesByPart[part] || []).forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = '';
        });
      });
    });

    // Initial render calls (Keep these)
    renderSnippetList();
    renderTopicList();
    window.part2.startSession();
    renderCard(window.part2.getNextCard()); // Initial card render
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
