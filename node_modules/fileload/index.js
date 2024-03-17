/**
 * fileload - by Manuel Di Iorio
 * @license: MIT
 */

const path = require("path");
let rootPath = path.dirname(require.main.filename);

module.exports = (absPath, sideActions) => {
    // When sideActions is specified, will do other things instead to require the file, like setting the root path
    if (sideActions) {
        switch (sideActions) {
            // Set or get the root path
            case "root":
                if (absPath) rootPath = absPath;
                return rootPath;
                break;

            // Return the resolved path
            case "resolve": return path.join(rootPath, absPath); break;
        }
        return;
    }

    // Require the resolved file
    const obj = require(path.join(rootPath, absPath));

    if (path.extname(absPath) !== ".mjs") {
        return obj;
    } else {
        return (obj.default) ? obj.default : obj;
    }
}
