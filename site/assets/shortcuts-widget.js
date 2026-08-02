/**
 * Floating quick-reference panel — searchable, category-based, no storage needed.
 * Include on session pages only, alongside the notes and bookmark widgets.
 *
 * To add a new category later (Git, Docker, Azure CLI, Linux, PowerShell, SQL, ...),
 * append another entry to REFERENCE below. Nothing else in this file needs to change:
 * each category renders as its own collapsible group, each section within it renders
 * as its own table, and search already spans every category/section automatically.
 */
(function () {
  'use strict';

  var REFERENCE = [
    {
      id: 'vscode',
      title: 'VS Code',
      sections: [
        {
          title: 'Keyboard Shortcuts',
          columns: ['Category', 'Shortcut', 'What it does'],
          monoColumns: [1],
          rows: [
            ['Navigation', 'Alt + Left Arrow', 'Go back to the previous cursor location in your code (similar to a browser Back button).'],
            ['Navigation', 'Alt + Right Arrow', 'Go forward after using Back.'],
            ['Navigation', 'Ctrl + Tab', 'Switch to the previously used editor tab, making it easy to jump between two files.'],
            ['Files', 'Ctrl + P', 'Quick Open. Type part of a filename to instantly open it without using the Explorer.'],
            ['Editors', 'Ctrl + W', 'Close the currently active editor tab.'],
            ['Editors', 'Alt + Shift + 1', 'Reset the layout to a single editor group, closing all split editor panes without closing your files.'],
            ['Explorer', 'Ctrl + B', 'Show or hide the Explorer sidebar, which contains your folders, files, search, source control, and extensions.'],
            ['Terminal & Panels', 'Ctrl + `', 'Show or hide the integrated Terminal.'],
            ['Terminal & Panels', 'Ctrl + J', 'Show or hide the bottom panel, which contains the Terminal, Problems, Output, Debug Console, and other panels.'],
            ['Commands', 'Ctrl + Shift + P', 'Open the Command Palette, allowing you to search for and run nearly any VS Code command by name.'],
            ['GitHub Copilot', 'Ctrl + Alt + I', 'Open the GitHub Copilot Chat side panel for longer conversations, code explanations, and project-wide questions (default on many installations).'],
            ['GitHub Copilot', 'Ctrl + I', 'Open GitHub Copilot Inline Chat, which lets you ask AI questions or edit code directly inside the current editor (default on many installations).'],
            ['Focus Mode', 'Ctrl + K, then Z', 'Enter Zen Mode, hiding most UI elements so you can focus on coding. Press Esc twice to exit.']
          ]
        }
      ]
    },
    {
      id: 'dotnet-cli',
      title: '.NET CLI',
      sections: [
        {
          title: 'Common Daily Commands',
          columns: ['Command', 'What it does'],
          monoColumns: [0],
          rows: [
            ['dotnet new', 'Scaffold a new project, solution, or config file from a template.'],
            ['dotnet sln', 'Add, remove, or list the projects registered in a solution file.'],
            ['dotnet add', 'Add a project reference or NuGet package reference to a project.'],
            ['dotnet restore', "Download and resolve the NuGet packages a project needs before building."],
            ['dotnet build', 'Compile a project or solution without running it.'],
            ['dotnet run', "Build (if needed) and run a project's entry point in one step."],
            ['dotnet watch', 'Re-run build, test, or run automatically whenever a watched source file changes.'],
            ['dotnet test', 'Build and execute the test projects in a solution.'],
            ['dotnet clean', "Delete a project's build output (bin/obj) so the next build starts fresh."],
            ['dotnet publish', 'Produce a self-contained, deployable output folder for an application.'],
            ['dotnet format', "Reformat source code to match the project's configured style rules."]
          ]
        },
        {
          title: 'Complete Reference',
          columns: ['Command', 'What it does'],
          monoColumns: [0],
          rows: [
            ['dotnet new sln', 'Create a new, empty solution file.'],
            ['dotnet new console', 'Create a new console application project.'],
            ['dotnet new classlib', 'Create a new class library project.'],
            ['dotnet new webapi', 'Create a new ASP.NET Core Web API project.'],
            ['dotnet new xunit', 'Create a new xUnit test project.'],
            ['dotnet sln add', 'Register one or more projects inside a solution file.'],
            ['dotnet sln remove', 'Remove a project from a solution file without deleting its files.'],
            ['dotnet sln list', 'Print every project currently registered in a solution file.'],
            ['dotnet add reference', "Add a project-to-project reference so one project can use another's types."],
            ['dotnet remove reference', 'Remove an existing project-to-project reference.'],
            ['dotnet restore', 'Download and resolve the NuGet packages a project needs before building.'],
            ['dotnet build', 'Compile a project or solution without running it.'],
            ['dotnet clean', "Delete a project's build output so the next build starts fresh."],
            ['dotnet run', "Build and run a project's entry point in one step."],
            ['dotnet watch', 'Automatically re-run a command whenever a watched source file changes.'],
            ['dotnet test', 'Build and execute the test projects in a solution.'],
            ['dotnet publish', 'Produce a deployable output folder for an application.'],
            ['dotnet add package', 'Add a NuGet package reference to a project.'],
            ['dotnet remove package', 'Remove a NuGet package reference from a project.'],
            ['dotnet list package', 'List the NuGet packages a project currently references.'],
            ['dotnet new tool-manifest', 'Create a local tool manifest so CLI tools are versioned per-repository instead of installed globally.'],
            ['dotnet tool install', 'Install a .NET tool, either globally or into the local tool manifest.'],
            ['dotnet tool update', 'Update an already-installed .NET tool to a newer version.'],
            ['dotnet tool list', 'List the .NET tools currently installed globally or locally.'],
            ['dotnet --info', 'Print detailed information about installed .NET SDKs, runtimes, and the environment.'],
            ['dotnet --list-sdks', 'List every .NET SDK version installed on this machine.'],
            ['dotnet --list-runtimes', 'List every .NET runtime version installed on this machine.'],
            ['dotnet new globaljson', 'Create a global.json file pinning the repository to a specific SDK version.'],
            ['dotnet format', "Reformat source code to match the project's configured style rules."],
            ['dotnet pack', 'Package a project into a distributable NuGet (.nupkg) package.'],
            ['dotnet --help', 'Print top-level CLI usage and a list of available commands.']
          ]
        }
      ]
    }
  ];

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function cellHtml(value, isMono) {
    var safe = escapeHtml(value);
    return isMono ? '<kbd>' + safe + '</kbd>' : safe;
  }

  function init() {
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'shortcuts-fab';
    fab.setAttribute('aria-label', 'Open the quick-reference panel');
    fab.innerHTML =
      '<span class="shortcuts-fab-icon" aria-hidden="true">⌨️</span>' +
      '<span class="shortcuts-fab-label">Shortcuts</span>';

    var overlay = document.createElement('div');
    overlay.className = 'shortcuts-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'shortcuts-modal-title');

    var categoriesHtml = REFERENCE.map(function (category, categoryIndex) {
      var sectionsHtml = category.sections.map(function (section, sectionIndex) {
        var monoColumns = section.monoColumns || [];
        var headHtml = section.columns.map(function (label) {
          return '<th>' + escapeHtml(label) + '</th>';
        }).join('');
        var rowsHtml = section.rows.map(function (row, rowIndex) {
          var cellsHtml = row.map(function (value, columnIndex) {
            return '<td>' + cellHtml(value, monoColumns.indexOf(columnIndex) !== -1) + '</td>';
          }).join('');
          return '<tr data-category="' + categoryIndex + '" data-section="' + sectionIndex + '" data-row="' + rowIndex + '">' + cellsHtml + '</tr>';
        }).join('');
        return (
          '<div class="shortcuts-section" data-category="' + categoryIndex + '" data-section="' + sectionIndex + '">' +
          '<h3 class="shortcuts-section-title">' + escapeHtml(section.title) + '</h3>' +
          '<div class="shortcuts-table-wrap"><table class="shortcuts-table">' +
          '<thead><tr>' + headHtml + '</tr></thead>' +
          '<tbody>' + rowsHtml + '</tbody>' +
          '</table></div>' +
          '</div>'
        );
      }).join('');
      return (
        '<details class="shortcuts-category" data-category="' + categoryIndex + '" open>' +
        '<summary>' + escapeHtml(category.title) + '</summary>' +
        '<div class="shortcuts-category-body">' + sectionsHtml + '</div>' +
        '</details>'
      );
    }).join('');

    overlay.innerHTML =
      '<div class="shortcuts-modal">' +
      '  <div class="shortcuts-modal-header">' +
      '    <h2 id="shortcuts-modal-title" class="shortcuts-modal-title">Shortcuts</h2>' +
      '    <button type="button" class="shortcuts-modal-close" aria-label="Close shortcuts">&times;</button>' +
      '  </div>' +
      '  <div class="shortcuts-modal-body">' +
      '    <input type="text" class="shortcuts-search" placeholder="Search any category, command, or description…" aria-label="Search the quick-reference panel" />' +
      '    <div class="shortcuts-categories">' + categoriesHtml + '</div>' +
      '    <p class="shortcuts-empty" hidden>Nothing matches your search.</p>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(overlay);

    var search = overlay.querySelector('.shortcuts-search');
    var closeBtn = overlay.querySelector('.shortcuts-modal-close');
    var categoryEls = overlay.querySelectorAll('.shortcuts-category');
    var sectionEls = overlay.querySelectorAll('.shortcuts-section');
    var rowEls = overlay.querySelectorAll('tbody tr');
    var empty = overlay.querySelector('.shortcuts-empty');
    var openStateBeforeSearch = null;

    function rowMatches(row, query) {
      if (!query) return true;
      return row.textContent.toLowerCase().indexOf(query) !== -1;
    }

    function applyFilter() {
      var query = search.value.trim().toLowerCase();
      var searching = query.length > 0;

      if (searching && !openStateBeforeSearch) {
        openStateBeforeSearch = [];
        for (var c = 0; c < categoryEls.length; c++) openStateBeforeSearch.push(categoryEls[c].open);
      } else if (!searching && openStateBeforeSearch) {
        for (var r = 0; r < categoryEls.length; r++) categoryEls[r].open = openStateBeforeSearch[r];
        openStateBeforeSearch = null;
      }

      var visibleTotal = 0;
      var sectionVisibleCount = {};

      for (var i = 0; i < rowEls.length; i++) {
        var row = rowEls[i];
        var matches = rowMatches(row, query);
        row.hidden = !matches;
        if (matches) {
          visibleTotal++;
          var key = row.dataset.category + ':' + row.dataset.section;
          sectionVisibleCount[key] = (sectionVisibleCount[key] || 0) + 1;
        }
      }

      for (var s = 0; s < sectionEls.length; s++) {
        var sectionEl = sectionEls[s];
        var sectionKey = sectionEl.dataset.category + ':' + sectionEl.dataset.section;
        sectionEl.hidden = searching && !sectionVisibleCount[sectionKey];
      }

      for (var g = 0; g < categoryEls.length; g++) {
        var categoryEl = categoryEls[g];
        if (!searching) {
          categoryEl.hidden = false;
          continue;
        }
        var categoryHasMatch = false;
        for (var key2 in sectionVisibleCount) {
          if (key2.indexOf(categoryEl.dataset.category + ':') === 0) { categoryHasMatch = true; break; }
        }
        categoryEl.hidden = !categoryHasMatch;
        if (categoryHasMatch) categoryEl.open = true;
      }

      empty.hidden = !searching || visibleTotal !== 0;
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
