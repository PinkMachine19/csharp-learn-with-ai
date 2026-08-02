/**
 * Floating VS Code shortcuts reference — searchable table, no storage needed.
 * Include on session pages only, alongside the notes and bookmark widgets.
 */
(function () {
  'use strict';

  var SHORTCUTS = [
    { category: 'Navigation', shortcut: 'Alt + Left Arrow', description: 'Go back to the previous cursor location in your code (similar to a browser Back button).' },
    { category: 'Navigation', shortcut: 'Alt + Right Arrow', description: 'Go forward after using Back.' },
    { category: 'Navigation', shortcut: 'Ctrl + Tab', description: 'Switch to the previously used editor tab, making it easy to jump between two files.' },
    { category: 'Files', shortcut: 'Ctrl + P', description: 'Quick Open. Type part of a filename to instantly open it without using the Explorer.' },
    { category: 'Editors', shortcut: 'Ctrl + W', description: 'Close the currently active editor tab.' },
    { category: 'Editors', shortcut: 'Alt + Shift + 1', description: 'Reset the layout to a single editor group, closing all split editor panes without closing your files.' },
    { category: 'Explorer', shortcut: 'Ctrl + B', description: 'Show or hide the Explorer sidebar, which contains your folders, files, search, source control, and extensions.' },
    { category: 'Terminal & Panels', shortcut: 'Ctrl + `', description: 'Show or hide the integrated Terminal.' },
    { category: 'Terminal & Panels', shortcut: 'Ctrl + J', description: 'Show or hide the bottom panel, which contains the Terminal, Problems, Output, Debug Console, and other panels.' },
    { category: 'Commands', shortcut: 'Ctrl + Shift + P', description: 'Open the Command Palette, allowing you to search for and run nearly any VS Code command by name.' },
    { category: 'GitHub Copilot', shortcut: 'Ctrl + Alt + I', description: 'Open the GitHub Copilot Chat side panel for longer conversations, code explanations, and project-wide questions (default on many installations).' },
    { category: 'GitHub Copilot', shortcut: 'Ctrl + I', description: 'Open GitHub Copilot Inline Chat, which lets you ask AI questions or edit code directly inside the current editor (default on many installations).' },
    { category: 'Focus Mode', shortcut: 'Ctrl + K, then Z', description: 'Enter Zen Mode, hiding most UI elements so you can focus on coding. Press Esc twice to exit.' }
  ];

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function rowMatches(row, query) {
    if (!query) return true;
    var haystack = (row.category + ' ' + row.shortcut + ' ' + row.description).toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function init() {
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'shortcuts-fab';
    fab.setAttribute('aria-label', 'Open VS Code shortcuts reference');
    fab.innerHTML =
      '<span class="shortcuts-fab-icon" aria-hidden="true">⌨️</span>' +
      '<span class="shortcuts-fab-label">Shortcuts</span>';

    var overlay = document.createElement('div');
    overlay.className = 'shortcuts-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'shortcuts-modal-title');

    var rowsHtml = SHORTCUTS.map(function (row, index) {
      return (
        '<tr data-row="' + index + '">' +
        '<td>' + escapeHtml(row.category) + '</td>' +
        '<td><kbd>' + escapeHtml(row.shortcut) + '</kbd></td>' +
        '<td>' + escapeHtml(row.description) + '</td>' +
        '</tr>'
      );
    }).join('');

    overlay.innerHTML =
      '<div class="shortcuts-modal">' +
      '  <div class="shortcuts-modal-header">' +
      '    <h2 id="shortcuts-modal-title" class="shortcuts-modal-title">VS Code Shortcuts</h2>' +
      '    <button type="button" class="shortcuts-modal-close" aria-label="Close shortcuts">&times;</button>' +
      '  </div>' +
      '  <div class="shortcuts-modal-body">' +
      '    <input type="text" class="shortcuts-search" placeholder="Search category, shortcut, or description…" aria-label="Search VS Code shortcuts" />' +
      '    <div class="shortcuts-table-wrap">' +
      '      <table class="shortcuts-table">' +
      '        <thead><tr><th>Category</th><th>Shortcut</th><th>What it does</th></tr></thead>' +
      '        <tbody>' + rowsHtml + '</tbody>' +
      '      </table>' +
      '    </div>' +
      '    <p class="shortcuts-empty" hidden>No shortcuts match your search.</p>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(overlay);

    var search = overlay.querySelector('.shortcuts-search');
    var closeBtn = overlay.querySelector('.shortcuts-modal-close');
    var rows = overlay.querySelectorAll('tbody tr');
    var empty = overlay.querySelector('.shortcuts-empty');

    function applyFilter() {
      var query = search.value.trim().toLowerCase();
      var visibleCount = 0;
      for (var i = 0; i < rows.length; i++) {
        var matches = rowMatches(SHORTCUTS[i], query);
        rows[i].hidden = !matches;
        if (matches) visibleCount++;
      }
      empty.hidden = visibleCount !== 0;
    }

    function openModal() {
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () {
        search.focus();
      });
    }

    function closeModal() {
      overlay.hidden = true;
      document.body.style.overflow = '';
      fab.focus();
    }

    fab.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (!overlay.hidden && e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    });

    search.addEventListener('input', applyFilter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
