const mocha = require("mocha");
const assert = require("assert");
const path = require("path");
const load = require("..");

describe("Initial test", function () {
  it("The default root should matches with the actual root path", function () {
    assert.strictEqual(load(null, "root"), path.dirname(require.main.filename));
  });
});

describe("Tests", function () {
  // Reset the root before any following tests
  beforeEach(function () {
    load(__dirname, "root");
  });

  describe("Root", function () {
    it("should be set to the subfolder", function () {
      const filePath = path.join(__dirname, "subfolder");
      load(filePath, "root");
      assert.strictEqual(load(null, "root"), filePath);
    });

    it("should be resolved to the file", function () {
      assert.strictEqual(load("file.test", "resolve"), path.join(__dirname, "file.test"));
    });
  });

  describe("Require", function () {
    describe("should get the file using different notation", function () {
      it("1/3: path", function () {
        assert.strictEqual(load("file.test")(), "test");
      });

      it("2/3: /path", function () {
        assert.strictEqual(load("/file.test")(), "test");
      });

      it("3/3: ./path", function () {
        assert.strictEqual(load("./file.test")(), "test");
      });
    });

    it("should get the file from the subfolder", function () {
      assert.strictEqual(load("subfolder/subfile.test")(), "sub.test");
    });

    it("should relatively get the file from the parent folder", function () {
      load(path.join(__dirname, "subfolder"), "root");
      assert.strictEqual(load("../file.test")(), "test");
    });

    describe("ES (mocked) modules", function () {
      it("1/2: should get the default value", function () {
        assert.strictEqual(load("file.mjs")(), "test");
      });

      it("2/2: should get the non-default value", function () {
        assert.strictEqual(load("file2.mjs").notDefault(), "test");
      });
    });

  });
});
