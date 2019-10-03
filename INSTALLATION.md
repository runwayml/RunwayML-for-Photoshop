## Installation

1) [Download the latest version of the plugin](https://github.com/runwayml/photoshop/releases).

2) Set debug mode:

**Windows:** Open regedit > HKEY_CURRENT_USER/Software/Adobe/CSXS.9, then add a new entry PlayerDebugMode of type string with the value of "1".

**Mac (In the Terminal):** ``` $ defaults write com.adobe.CSXS.9 PlayerDebugMode 1 ```

More information is available [here](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md#debugging-unsigned-extensions).

3) Install the plugin:

Unzip the plugin and copy the entire `RunwayML` directory to Photoshop Extension directory.

**Windows:** C:\Program Files\Common Files\Adobe\CEP\extensions

**Mac:** ~/Library/Application Support/Adobe/CEP/extensions

More information is available [here](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md#extension-folders).

4) Make sure `Runway.app` is running and you're signed in.
