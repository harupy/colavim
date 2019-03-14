
(() => {
  const enableVim = cell => {
    cell.CodeMirror.setOption('vimMode', true);
    cell.CodeMirror.options.keyMap = 'vim';
    cell.CodeMirror.options.showCursorWhenSelecting = 'vim';
  };

  const enableBackspaceUnindent = cell => {
    const unindentOrBackspace = cm => {
      const {line, ch} = cm.getCursor();
      const cursorLine = cm.getLine(line);
      const match = cursorLine.match(/^\s+/);
      if (match) {
        const spaces = match[0];
        if ((spaces.length % 4 == 0) && (ch == spaces.length) && (ch !== 0)) {
          cm.deleteH(-4, 'char');
          return
        }
      }
      cm.deleteH(-1, 'char');
    }
    cell.CodeMirror.options.extraKeys['Backspace'] = unindentOrBackspace;
  }

  const enableSnippet = (cell) => {
    const tabDefaultFunc = cell.CodeMirror.options.extraKeys['Tab'];
    const snippets = {
      'inp'     : 'import numpy as np\n',
      'iplt'    : 'import matplotlib.pyplot as plt\n',
      'ipd'     : 'import pandas as pd\n',
      'isb'     : 'import seaborn as sns\n',
      'itf'     : 'import tensorflow as tf\n',
      'pdrc'    : 'pd.read_csv()',
      'npp'     : 'import numpy as np\nimport matplotlib.pyplot as plt\nimport pandas as pd\n'
    };

    const expandSnippetOrIndent = cm => {
      const cursor = cm.getCursor();
      const cursorLeft = cm.getRange({line: cursor.line, ch: 0}, cursor);
      const match = cursorLeft.match(/[^a-zA-Z0-9_]?([a-zA-Z0-9_]+)$/);
      if (!match) {
        tabDefaultFunc(cm);
        return
      }

      const prefix = match[1];
      const head = {line: cursor.line, ch: cursor.ch - prefix.length};
      
      if (prefix in snippets) {
        const body = snippets[prefix];
        cm.replaceRange(body, head, cursor);
        const match = body.match(/\)+$/);
        if (match) cm.moveH(-match[0].length, 'char');
      } else {
        tabDefaultFunc(cm);
      }
    }

    const showSnippetHint = cm => {
      const cursor = cm.getCursor();
      const cursorLeft = cm.getRange({line: cursor.line, ch: 0}, cursor);
      const match = cursorLeft.match(/[^a-zA-Z0-9_]?([a-zA-Z0-9_]+)$/);
      const prefix = match ? match[1] : '';
      const head = {line: cursor.line, ch: cursor.ch - prefix.length};
      const matchedPrefixes = Object.keys(snippets).filter(k => k.indexOf(prefix) > -1);
      matchedPrefixes.sort();

      const hintList = matchedPrefixes.map(key => {
        const displayText = snippets[key].replace('\n', '; ');
        const displayTextTrunc = displayText.length > 40 ? displayText.slice(0, 40) + '...' : displayText;

        return {
          text: snippets[key],
          displayText: `${key.padEnd(7, ' ')}: ${displayTextTrunc}`
        }
      });
      
      const hintFunc = () => {
        return {
          list: hintList,
          from: head,
          to: cursor
        }
      }

      const onPick = (cm) => {
        const cursor = cm.getCursor();
        const cursorLeft = cm.getRange({line: cursor.line, ch: 0}, cursor);
        const match = cursorLeft.match(/\)+$/);
        if (match) cm.moveH(-match[0].length, 'char');
      }

      const customKeysFunc = {
        // default key mappings
        Up: (completion, handle) => handle.moveFocus(-1),
        Down: (completion, handle) => handle.moveFocus(1),
        PageUp: (completion, handle) => handle.moveFocus(-handle.menuSize() + 1, true),
        PageDown: (completion, handle) => handle.moveFocus(handle.menuSize() - 1, true),
        Home: (completion, handle) => handle.setFocus(0),
        End: (completion, handle) => handle.setFocus(handle.length - 1),
        Enter: (completion, handle) => {handle.pick(); onPick(cm);},
        Tab: (completion, handle) => {handle.pick(); onPick(cm);},
        Esc: (completion, handle) => handle.close(),

        // new key mappings
        J: (completion, handle) => handle.moveFocus(1),
        K: (completion, handle) => handle.moveFocus(-1),
      }

      cm.showHint({
        hint: hintFunc,
        completeSingle: false,
        customKeys: customKeysFunc,
        alignWithWord: false,
      });
    }

    const conCursorActivity = cm => {
      if (cm.state.completionActive) {
        showSnippetHint(cm);
      }
    };

    cell.CodeMirror.options.extraKeys['Ctrl-H'] = showSnippetHint;
    cell.CodeMirror.options.extraKeys['Tab'] = expandSnippetOrIndent;
    cell.CodeMirror.on('cursorActivity', conCursorActivity);
  }

  const updateCell = cell => {
    enableVim(cell);
    enableBackspaceUnindent(cell);
    enableSnippet(cell);
  }

  const onKeyUp = () => {
    const cellEditing = document.querySelector('div.CodeMirror-focused');
    if (cellEditing && !cellEditing.CodeMirror.getOption('vimMode')) {
      updateCell(cellEditing);
    }
  };
  
  const updateExistingCells = () => {
    document.querySelectorAll('div.CodeMirror').forEach(cell => {
      updateCell(cell);
    })
  }
  
  setTimeout(updateExistingCells, 1000);
  document.addEventListener('keyup', onKeyUp);

  // Vim keybindings
  CodeMirror.Vim.map('jk', '<Esc>', 'insert');
  CodeMirror.Vim.map("jk", "<Esc>", "insert");
  CodeMirror.Vim.map("J", "G", "visual")
  CodeMirror.Vim.map("K", "gg", "visual")
  CodeMirror.Vim.map("H", "^", "visual")
  CodeMirror.Vim.map("L", "$", "visual")
  CodeMirror.Vim.map("j", "gj", "visual")
  CodeMirror.Vim.map("k", "gk", "visual")
  CodeMirror.Vim.map("J", "G", "normal")
  CodeMirror.Vim.map("H", "^", "normal")
  CodeMirror.Vim.map("L", "$", "normal")
  CodeMirror.Vim.map("j", "gj", "normal")
  CodeMirror.Vim.map("k", "gk", "normal")
  CodeMirror.Vim.map("K", "gg", "normal")
})();
