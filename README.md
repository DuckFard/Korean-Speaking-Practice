# Korean Speaking Practice

IMPORTANT NOTICE: This GitHub project does not provide any materials taken from the SNU Smart Course + and therefore does not violate any rules agreed upon with Seoul National University. Thank you for your understanding.

This repository contains the front-end code for a website designed to help students practice the Korean Speaking section of tests, inspired by common language learning assessment formats. At this time, Part 1 (Read Aloud) and Part 2 (Q&A) can be accessed and practiced.

## Table of Contents

- [Overview of Common Speaking Test Formats](#overview)
- [Part 1 - Read Aloud](#part-1---read-aloud)
- [Part 2 - Questions & Answer](#part-2---questions--answer)
- [Roadmap for Part 3 & Part 4](#roadmap-for-part-3--part-4)
- [License](#license)

*(Note: GitHub automatically generates IDs for headers. The links above should work correctly with the headers below.)*

## Overview of Common Speaking Test Formats

Many language proficiency tests include speaking sections with similar structures:

-   **Part 1: Read Aloud:** Test-takers read a provided text aloud. Assesses pronunciation, intonation, and fluency.
-   **Part 2: Questions & Answer:** Test-takers answer questions, often related to specific topics or grammar points. Assesses comprehension and spontaneous speech production.
-   **Part 3: Interview/Presentation:** Test-takers speak at length on a given topic, sometimes prompted by guiding questions. Assesses ability to organize thoughts and speak coherently.
-   **Part 4: Role Play:** Test-takers engage in a simulated conversation to achieve a specific goal (e.g., ordering food, asking for directions). Assesses functional language use and interaction skills.

This application aims to provide practice tools for these types of tasks.

## Part 1 - Read Aloud

This part of the application helps you practice reading Korean text snippets aloud and comparing your pronunciation to the computer's text-to-speech output.

### Features

1.  **Display Snippet:** Shows a Korean text snippet for you to read (`<div id="display-area">`).
2.  **Text-to-Speech:** Plays the displayed snippet using your browser's Korean voice synthesis (`<button id="play-btn">`). *(Note: Availability and quality depend on the user's browser and installed voices. The user noted this might not be fully functional yet).*
3.  **Recording:** Allows you to record your own voice reading the snippet (`<button id="record-btn">`).
4.  **Playback:** Lets you listen to your recording (`<audio id="playback">`).
5.  **Snippet Management:** Add your own text snippets (`<textarea id="snippet-input">`, `<button id="add-snippet-btn">`) or delete existing ones (Delete button within `<ul id="snippet-list">`).

### How to Use

1.  **Navigate to Part 1:** Ensure the "Part 1: Read-Aloud" tab is selected.
2.  **Get a Snippet:**
    *   Click the `Next Text` button. A random snippet from your saved list appears.
    *   If no snippets are saved, add some using the "Manage Text Snippets" section.
3.  **Listen to the Snippet (Optional):**
    *   Click the `Play` button to hear the text read by the browser's TTS engine.
4.  **Record Yourself:**
    *   Click the `Record` button (allow microphone access if prompted).
    *   Read the snippet aloud.
    *   Click the `Stop` button (the text changes from "Record").
5.  **Listen to Your Recording:**
    *   Use the controls on the `<audio id="playback">` element that appears.
6.  **Manage Snippets:**
    *   **Add:** Paste text into the textarea and click `Add Snippet`.
    *   **Delete:** Click the `Delete` button next to a snippet in the list.

## Part 2 - Questions & Answer

This part helps you practice answering Korean questions based on different topics using a flashcard format. You can manage your own topics and questions.

### Features

1.  **Flashcard Display:** Shows a topic (`<h3 id="card-topic">`) and a related question (`<p id="card-question">`).
2.  **Card Navigation:** Move between questions (`<button id="prev-card-btn">`, `<button id="next-card-btn">`) or start over (`<button id="restart-deck-btn">`).
3.  **Topic Management:**
    *   Add new topics (`<input id="new-topic-input">`, `<button id="add-topic-btn">`).
    *   View and select existing topics (`<ul id="topic-list">`). Selecting a topic loads its questions for management.
4.  **Question Management:**
    *   View questions for the selected topic (`<ul id="question-list">`).
    *   Add new questions to the selected topic (`<input id="new-question-input">`, `<button id="add-question-btn">`).
    *   Delete questions from the selected topic (Delete button within the list).
5.  **Bulk Import:** Add multiple topics and questions quickly (`<textarea id="bulk-input-area">`, `<button id="process-bulk-btn">`).

### How to Use

1.  **Navigate to Part 2:** Click the "Part 2: Interview" tab.
2.  **Manage Topics:**
    *   **Add:** Use the input and `Add` button in the "Topics" column.
    *   **Select:** Click a topic in the list to manage its questions.
3.  **Manage Questions (Requires a Topic to be Selected):**
    *   The "Questions for: [Topic Name]" section appears when a topic is selected.
    *   **Add:** Use the input and `Add` button in this section.
    *   **Delete:** Click the `Delete` button next to a question in the list.
4.  **Use the Flashcards:**
    *   The flashcard area displays the current topic/question.
    *   Use the `Previous`, `Next`, and `Restart Deck` buttons to navigate. *(The deck likely consists of all questions from all topics or just the selected topic, depending on the `part2.js` logic).*
5.  **Bulk Import:**
    *   Paste formatted text (see placeholder) into the bulk input area.
    *   Click `Process Bulk Input`.

## Roadmap for Part 3 & Part 4

Future development will focus on implementing practice modules for presentation/interview and role-play scenarios.

### Part 3: Interview / Presentation Practice
To be honest this is purely about memorizing a prepared set of text, thus making a web for it is redundant.

### Part 4: Role Play Practice

In the most empathetic sense I could put this, please find a friend to practice this with.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute this project as per the terms of the license.
