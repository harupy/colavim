# Colavim

A Chrome extension to enhance the editor functionality in Google Colab

![demo](https://user-images.githubusercontent.com/17039389/54288289-940c2b00-45ea-11e9-8bc0-ab730274352c.gif)

## Installation
1. Clone this repository
1. Open `chrome://extensions` on Chrome
1. Enable "Developer mode"
1. Click "Load unpacked"
1. Select the folder that was just cloned

## Supported Features
- Snippet
- Snippet Hint
- Vim

## Usage
|Key|Action|
|:-|:-|
|`Tab`|Expand a snippet|
|`Ctrl-h`|Show snippet hint|
|`jk` or `Esc`|Enter the insert mode|

## Supported Snippets
|Prefix|Body|
|:-|:-|
|`inp` |import numpy as np|
|`iplt`|import matplotlib.pyplot as plt|
|`ipd` |import pandas as pd|
|`isb` |import seaborn as sns|
|`itf` |import tensorflow as tf|
|`pdrc`|pd.read_csv()'|
|`npp` |import numpy as np<br>import matplotlib.pyplot as plt<br>import pandas as pd|
