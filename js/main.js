import {enableSnippet} from './enableSnippet';

(() => {
  const enableVim = cell => {
    cell.CodeMirror.setOption('vimMode', true);
    cell.CodeMirror.options.keyMap = 'vim';
    cell.CodeMirror.options.showCursorWhenSelecting = 'vim';
  };

  const updateBackspace = cell => {
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

  const onKeyUp = () => {
    const cellEditing = document.querySelector('div.CodeMirror-focused');
    console.log(cellEditing);
    if (cellEditing && !cellEditing.CodeMirror.getOption('vimMode')) {
      enableVim(cellEditing);
      updateBackspace(cellEditing);
      // enableSnippet(cellEditing);
    }
  };
  
  const updateExistingCells = () => {
    document.querySelectorAll('div.CodeMirror').forEach(cell => {
      enableVim(cell);
      updateBackspace(cell);
      // enableSnippet(cellEditing);
    })
  }
  
  setTimeout(updateExistingCells, 1000);
  document.addEventListener('keyup', onKeyUp);

  // insert mode
  CodeMirror.Vim.map('jk', '<Esc>', 'insert');
  CodeMirror.Vim.map("jk", "<Esc>", "insert");

  // visual mode
  CodeMirror.Vim.map("J", "G", "visual")
  CodeMirror.Vim.map("K", "gg", "visual")
  CodeMirror.Vim.map("H", "^", "visual")
  CodeMirror.Vim.map("L", "$", "visual")
  CodeMirror.Vim.map("j", "gj", "visual")
  CodeMirror.Vim.map("k", "gk", "visual")

  // normal mode
  CodeMirror.Vim.map("J", "G", "normal")
  CodeMirror.Vim.map("H", "^", "normal")
  CodeMirror.Vim.map("L", "$", "normal")
  CodeMirror.Vim.map("j", "gj", "normal")
  CodeMirror.Vim.map("k", "gk", "normal")
  CodeMirror.Vim.map("K", "gg", "normal")
})();

