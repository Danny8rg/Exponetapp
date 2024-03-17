# Fileload v2.0
Require absolute paths relative to the root.

Useful for large projects which need to avoid relative paths to better maintain the project structure

## **Example**
```js
const load = require("fileload")
load("path/to/some/file")
```

**ES Module syntax**
```js
import load from "fileload"
load("path/to/some/file.mjs")
```

This will require the module resolved from the root, by internally doing `path.join(rootPath, "path/to/some/file")`

---

### This library has been made to avoid things like this:
```js
require("../../../../file.js")
```
1. Relative paths are not clear and harder to understand.
2. Relative paths are harder to refactor in large projects
    (imports with absolute paths can be moved around without breaking the code)

---


## **How to install**

Yarn
```bash
$ yarn add fileload
```

NPM
```bash
$ npm install fileload
```

---

## **FAQ**

### **Can I still require npm modules if I use this lib ?**

Of course, by normally using `require()` or `import syntax`

### **How to get the current root path ?**

Use `load(null, "root")` to get the current root path.

By default it is `path.dirname(require.main.filename)`, the root of your app.

### **Can I dinamically change the root path ?**

You can with `load(newRootPath, "root")` but note that this is a global per-process setting, so the `load()` calls order is important.

### **What if I want to resolve a path, without actually importing it ?**

Use `load(path, "resolve")`.

This is the equivalent of `path.join(rootPath, path);`

### **How to import javascript ES modules ?**

```js
const value = load("file.mjs")  // Assuming it has a default export
```
Using object destructuring:
```js
const { obj } = load("file.mjs") // For non-default properties
```

Note that internally the library still uses the `require()` method.

---

## **V2 Breaking Changes**

### With this new version, the API has been rewritten to be more developer-friendly.

**To migrate from V1:**


```js
// Replace:
const load = require("fileload").root(__dirname)

// with:
const load = require("fileload")  // The root is automatically retrieved now
```

Also replace any `load.file(path)` with just `load(path)`

---

## **TESTS**

```bash
$ yarn test
```


## **LICENSE**

MIT
