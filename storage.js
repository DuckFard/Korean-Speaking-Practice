// js/storage.js
(function(window) {
    const STORAGE_KEY = 'snippets';
  
    /** @returns {string[]} An array of snippet strings.*/
    function loadSnippets() {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      try {
        return JSON.parse(data);
      } catch (err) {
        console.error('Failed to parse snippets from localStorage:', err);
        return [];
      }
    }
    function saveSnippets(list)  {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
    function addSnippet(text) {
        const snippets  = loadSnippets();
        snippets.push(text);
        saveSnippets(snippets);
    }
    function removeSnippet(index) {
        const snippets = loadSnippets();
        if (index >= 0 && index < snippets.length) {
            snippets.splice(index, 1);
            saveSnippets(snippets);
        }
    }

    window.Storage = {
        loadSnippets,
        saveSnippets,
        addSnippet,
        removeSnippet
    };
  })(window);
  