
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
      'inp'     : 'import numpy as np',
      'iplt'    : 'import matplotlib.pyplot as plt',
      'ipd'     : 'import pandas as pd',
      'pdrc'    : 'pd.read_csv()',
    };

    const expandSnippetOrIndent = cm => {
      const cursor = cm.getCursor();
      const cursorLine= cm.getLine(cursor.line);
      const cursorLeft = cursorLine.slice(0, cursor.ch);
      const regex = /[^a-zA-Z0-9_]?([a-zA-Z0-9_]+)$/;
      const match = cursorLeft.match(regex);
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
        if (match) {
          cm.moveH(-match[0].length, 'char');
        }
      } else {
        tabDefaultFunc(cm);
      }
    }

    const showSnippetHint = cm => {
      const hintList = Object.keys(snippets).map(key => {
        return {
          text: snippets[key],
          displayText: `${key.padEnd(7, ' ')}: ${snippets[key]}`
        }
      });
      cm.showHint({
        hint: () => {
          return {
            list: hintList,
            from: {line: 0, ch: 0},
            to: {line: 0, ch: 0}
          }
        }
      });
    }

    cell.CodeMirror.options.extraKeys['Ctrl-H'] = showSnippetHint;
    cell.CodeMirror.options.extraKeys['Tab'] = expandSnippetOrIndent;
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



