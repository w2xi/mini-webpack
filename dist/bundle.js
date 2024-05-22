
    (function(graph) {
      function require(moduleFile) {
        function localRequire(relativePath) {
          return require(graph[moduleFile].dependencies[relativePath]);
        }
        var module = {
          exports: {}
        };
        (function(require, module, exports, code) {
          eval(code)
        })(localRequire, module, module.exports, graph[moduleFile].code);
        return module.exports;
      }
      require('./example/index.js')
   })({
  "./example/index.js": {
    "code": "\"use strict\";\n\nvar _header = _interopRequireDefault(require(\"./header.js\"));\nvar _bar = _interopRequireDefault(require(\"./bar.js\"));\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\nvar header = (0, _header[\"default\"])();\ndocument.body.append(header);\nconsole.log('bar name', _bar[\"default\"]);",
    "dependencies": {
      "./header.js": "./example\\header.js",
      "./bar.js": "./example\\bar.js"
    }
  },
  "./example\\header.js": {
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = createHeader;\nfunction createHeader() {\n  var header = document.createElement('h1');\n  header.innerText = 'Hello World';\n  return header;\n}",
    "dependencies": {}
  },
  "./example\\bar.js": {
    "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar _test = _interopRequireDefault(require(\"./test.json\"));\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\nconsole.log('bar.js');\nconsole.log('json info:', _test[\"default\"]);\nvar _default = exports[\"default\"] = {\n  name: 'bar'\n};",
    "dependencies": {
      "./test.json": "./example\\test.json"
    }
  },
  "./example\\test.json": {
    "code": "module.exports = {\r\n    \"name\": \"John Doe\",\r\n    \"age\": 25,\r\n    \"address\": {\r\n        \"street\": \"123 Main St\",\r\n        \"city\": \"Springfield\",\r\n        \"state\": \"IL\",\r\n        \"zip\": \"62701\"\r\n    },\r\n    \"phone\": [\r\n        {\r\n        \"type\": \"home\",\r\n        \"number\": \"123-456-7890\"\r\n        },\r\n        {\r\n        \"type\": \"cell\",\r\n        \"number\": \"234-567-8901\"\r\n        }\r\n    ]\r\n}"
  }
})
  