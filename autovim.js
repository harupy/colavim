const enabe_vim = (event) => {
  const cellEditing = document.querySelector('div.CodeMirror-focused');
  if (cellEditing) {
    cellEditing.CodeMirror.setOption('vimMode', true);
    cellEditing.CodeMirror.options.keyMap = 'vim';
    cellEditing.CodeMirror.options.showCursorWhenSelecting = 'vim';

    cellEditing.CodeMirror.on('blur', cm => {
      cm.setOption('vimMode', false);
      alert('hello');
      setTimeout(() => {
        const cellEditing = document.querySelector('div.CodeMirror-focused');
        if (cellEditing) {
          cellEditing.CodeMirror.setOption('vimMode', true);
          cellEditing.CodeMirror.options.keyMap = 'vim';
          cellEditing.CodeMirror.options.showCursorWhenSelecting = 'vim';
          }
        }, 100);
    });
  }
};

CodeMirror.Vim.map('jk', '<Esc>', 'insert');
document.addEventListener('mouseup', enabe_vim)
