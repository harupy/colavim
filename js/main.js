(() => {
  const enableVim = cell => {
    cell.CodeMirror.setOption('vimMode', true);
    cell.CodeMirror.options.keyMap = 'vim';
    cell.CodeMirror.options.showCursorWhenSelecting = 'vim';
  };

  const enableBackspaceUnindent = cell => {
    const unindentOrBackspace = cm => {
      const { line, ch } = cm.getCursor();
      const cursorLine = cm.getLine(line);
      const match = cursorLine.match(/^\s+/);
      if (match) {
        const indentLength = match[0].length;
        if (indentLength % 2 === 0 && ch === indentLength && ch !== 0) {
          cm.deleteH(-2, 'char');
          return;
        }
      }
      cm.deleteH(-1, 'char');
    };
    cell.CodeMirror.options.extraKeys['Backspace'] = unindentOrBackspace;
  };

  const enableTwoSpacesIndent = cell => {
    const newLineAndIndent = cm => {
      // If the current line has indent spaces, keep the indent and open a lew line below
      const { line, ch } = cm.getCursor();
      const cursorLine = cm.getLine(line);
      const match = cursorLine.match(/^\s+/);
      const indent = match ? match[0] : '';
      const charOnCursorLeft = cm.getRange({ line, ch: ch - 1 }, { line, ch });
      cm.execCommand('openLine');
      cm.execCommand('goLineDown');
      cm.execCommand('goLineLeft');

      if (charOnCursorLeft === ':') {
        cm.replaceSelection(indent + '  ');
        // } else if (['(', '{', '['].includes(charOnCursorLeft)) {
        //   cm.execCommand('openLine');
        //   cm.replaceSelection(indent) + '  ';
      } else {
        cm.replaceSelection(indent);
      }
    };
    cell.CodeMirror.options.extraKeys['Enter'] = newLineAndIndent;
  };

  const enableSnippet = cell => {
    const tabDefaultFunc = cell.CodeMirror.options.extraKeys['Tab'];
    const snippets = {
      inp: 'import numpy as np\n',
      iplt: 'import matplotlib.pyplot as plt\n',
      ipd: 'import pandas as pd\n',
      isb: 'import seaborn as sns\n',
      itf: 'import tensorflow as tf\n',
      pdrc: 'pd.read_csv()',
      pxl: 'plt.xlabel()',
      pyl: 'plt.ylabel()',
      npp: 'import numpy as np\nimport matplotlib.pyplot as plt\nimport pandas as pd\n',
    };

    const expandSnippetOrIndent = cm => {
      const cursor = cm.getCursor();
      const cursorLeft = cm.getRange({ line: cursor.line, ch: 0 }, cursor);
      const match = cursorLeft.match(/[^a-zA-Z0-9_]?([a-zA-Z0-9_]+)$/);
      if (!match) {
        tabDefaultFunc(cm);
        return;
      }

      const prefix = match[1];
      const head = { line: cursor.line, ch: cursor.ch - prefix.length };

      if (prefix in snippets) {
        const body = snippets[prefix];
        cm.replaceRange(body, head, cursor);
        const match = body.match(/\)+$/);
        if (match) cm.moveH(-match[0].length, 'char');
      } else {
        tabDefaultFunc(cm);
      }
    };

    const showSnippetHint = cm => {
      const cursor = cm.getCursor();
      const cursorLeft = cm.getRange({ line: cursor.line, ch: 0 }, cursor);
      const match = cursorLeft.match(/[^a-zA-Z0-9_]?([a-zA-Z0-9_]+)$/);
      const prefix = match ? match[1] : '';
      const head = { line: cursor.line, ch: cursor.ch - prefix.length };
      const matchedPrefixes = Object.keys(snippets).filter(k => k.indexOf(prefix) > -1);
      matchedPrefixes.sort();

      const hintList = matchedPrefixes.map(key => {
        const displayText = snippets[key].replace('\n', '; ');
        const displayTextTrunc =
          displayText.length > 40 ? displayText.slice(0, 40) + '...' : displayText;

        return {
          text: snippets[key],
          displayText: `${key.padEnd(7, ' ')}: ${displayTextTrunc}`,
        };
      });

      const hintFunc = () => {
        return {
          list: hintList,
          from: head,
          to: cursor,
        };
      };

      const onPick = cm => {
        const cursor = cm.getCursor();
        const cursorLeft = cm.getRange({ line: cursor.line, ch: 0 }, cursor);
        const match = cursorLeft.match(/\)+$/);
        if (match) cm.moveH(-match[0].length, 'char');
      };

      const customKeysFunc = {
        // Default key mappings
        Up: (completion, handle) => handle.moveFocus(-1),
        Down: (completion, handle) => handle.moveFocus(1),
        PageUp: (completion, handle) => handle.moveFocus(-handle.menuSize() + 1, true),
        PageDown: (completion, handle) => handle.moveFocus(handle.menuSize() - 1, true),
        Home: (completion, handle) => handle.setFocus(0),
        End: (completion, handle) => handle.setFocus(handle.length - 1),
        Enter: (completion, handle) => {
          handle.pick();
          onPick(cm);
        },
        Tab: (completion, handle) => {
          handle.pick();
          onPick(cm);
        },
        Esc: (completion, handle) => handle.close(),

        // New key mappings
        J: (completion, handle) => handle.moveFocus(1),
        K: (completion, handle) => handle.moveFocus(-1),
      };

      cm.showHint({
        hint: hintFunc,
        completeSingle: false,
        customKeys: customKeysFunc,
        alignWithWord: false,
      });
    };

    const conCursorActivity = cm => {
      if (cm.state.completionActive) {
        showSnippetHint(cm);
      }
    };

    cell.CodeMirror.options.extraKeys['Ctrl-H'] = showSnippetHint;
    cell.CodeMirror.options.extraKeys['Tab'] = expandSnippetOrIndent;
    cell.CodeMirror.on('cursorActivity', conCursorActivity);
  };

  const updateCell = cell => {
    enableVim(cell);
    enableBackspaceUnindent(cell);
    enableTwoSpacesIndent(cell);
    enableSnippet(cell);
  };

  const updateFocusedCell = () => {
    const cellEditing = document.querySelector('div.CodeMirror-focused');
    if (cellEditing && !cellEditing.CodeMirror.getOption('vimMode')) {
      updateCell(cellEditing);
    }
  };

  const updateExistingCells = () => {
    document.querySelectorAll('div.CodeMirror').forEach(cell => {
      updateCell(cell);
    });
  };

  document.addEventListener('keyup', updateFocusedCell);
  document.addEventListener('click', updateFocusedCell);

  // Vim keybindings
  // Normal mode
  CodeMirror.Vim.map('J', '}', 'normal');
  CodeMirror.Vim.map('H', '^', 'normal');
  CodeMirror.Vim.map('L', '$', 'normal');
  CodeMirror.Vim.map('j', 'gj', 'normal');
  CodeMirror.Vim.map('k', 'gk', 'normal');
  CodeMirror.Vim.map('K', '{', 'normal');

  // Insert mode
  CodeMirror.Vim.map('jk', '<Esc>', 'insert');
  CodeMirror.Vim.map('jk', '<Esc>', 'insert');

  // Visual mode
  CodeMirror.Vim.map('J', '}', 'visual');
  CodeMirror.Vim.map('K', '{', 'visual');
  CodeMirror.Vim.map('H', '^', 'visual');
  CodeMirror.Vim.map('L', '$', 'visual');
  CodeMirror.Vim.map('j', 'gj', 'visual');
  CodeMirror.Vim.map('k', 'gk', 'visual');
})();
