(() => {
  const enable_vim = (event) => {
    const cellEditing = document.querySelector('div.CodeMirror-focused');
    
    if (cellEditing && !cellEditing.CodeMirror.getOption('vimMode')) {
      cellEditing.CodeMirror.setOption('vimMode', true);
      cellEditing.CodeMirror.options.keyMap = 'vim';
      cellEditing.CodeMirror.options.showCursorWhenSelecting = 'vim';
    }
  };
  

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
  
  document.addEventListener('keyup', enable_vim);
})();

