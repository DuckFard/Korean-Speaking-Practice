// js/part2.js
(function(window) {
    // Key for storing grammar deck in localStorage
    const STORAGE_KEY = 'grammarDeck';
  
    /** @returns {Array<{name: string, questions: string[]}>}*/
    function loadDeck() {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      try {
        return JSON.parse(data);
      } catch (err) {
        console.error('Failed to parse grammar deck:', err);
        return [];
      }
    }
  
    /** @param {Array} deck*/
    function saveDeck(deck) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
    }
  
    /**@param {string} name*/
    function addTopic(name) {
      const deck = loadDeck();
      deck.push({ name: name.trim(), questions: [] });
      saveDeck(deck);
    }
  
    function removeTopic(index) {
      const deck = loadDeck();
      if (index >= 0 && index < deck.length) {
        deck.splice(index, 1);
        saveDeck(deck);
      }
    }
  
    /**
     *@param {number} topicIndex
     * @param {string} question
     */
    function addQuestion(topicIndex, question) {
      const deck = loadDeck();
      if (topicIndex >= 0 && topicIndex < deck.length) {
        deck[topicIndex].questions.push(question.trim());
        saveDeck(deck);
      }
    }
    function removeQuestion(topicIndex, questionIndex) {
      const deck = loadDeck();
      if (
        topicIndex >= 0 && topicIndex < deck.length &&
        questionIndex >= 0 && questionIndex < deck[topicIndex].questions.length
      ) {
        deck[topicIndex].questions.splice(questionIndex, 1);
        saveDeck(deck);
      }
    }
  
    //flashcards session state
    let sessionOrder = [];
    let currentPos = -1;
    let history = [];

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function startSession() {
      const deck = loadDeck();
      sessionOrder = deck.map((_, idx) => idx);
      shuffle(sessionOrder);
      currentPos = -1;
      history = [];
    }
  
    /**@returns {{topic: string, question: string}|null}*/
    function getNextCard() {
      const deck = loadDeck();
      if (sessionOrder.length === 0) {
        startSession();
      }
      if (currentPos + 1 >= sessionOrder.length) {
        return null;
      }
      currentPos++;
      const topicIdx = sessionOrder[currentPos];
      const topic = deck[topicIdx];
      const qList = topic.questions;
      const question = qList.length > 0
        ? qList[Math.floor(Math.random() * qList.length)]
        : '';
      history.push({ topicIdx, question });
      return { topic: topic.name, question };
    }
  
    /** @returns {{topic: string, question: string}|null}*/
    function getPrevCard() {
      if (currentPos <= 0) {
        return null;
      }
      currentPos--;
      const { topicIdx, question } = history[currentPos];
      const deck = loadDeck();
      return { topic: deck[topicIdx].name, question };
    }
  
    /**@returns {{topic: string, question: string}|null}*/
    function restartSession() {
      startSession();
      return getNextCard();
    }
  
    // Expose storage API
    window.grammarStorage = {
      loadDeck,
      saveDeck,
      addTopic,
      removeTopic,
      addQuestion,
      removeQuestion
    };
  
    // Expose flashcard session API
    window.part2 = {
      startSession,
      getNextCard,
      getPrevCard,
      restartSession
    };
  })(window);
  