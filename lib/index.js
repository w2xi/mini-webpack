import { parse } from '@babel/parser';
import traverse from "@babel/traverse";
import { transformFromAst } from '@babel/core';
import fs from 'fs';
import path from 'path';

// Step 1. 解析依赖：分析入口文件内容，提取依赖关系
// Step 2. 生成依赖图：递归解析所有依赖，生成依赖图
// Step 3. 打包：将所有模块打包成一个文件

function getAsset(filename) {
  const ext = path.extname(filename)

  if (ext === '.json') {
    const content = fs.readFileSync(filename, 'utf-8');
    return {
      filename,
      code: `module.exports = ${content}`,
    }
  }

  const content = fs.readFileSync(filename, 'utf-8');
  const ast = parse(content, {
    sourceType: 'module',
  });
  const deps = {}
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename);
      const newFile = './' + path.join(dirname, node.source.value);
      deps[node.source.value] = newFile;
    },
  });

  const { code } = transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  });

  return {
    filename,
    code,
    dependencies: deps,
  };
}

function generateGraph(entry) {
  const module = getAsset(entry);
  const queue = [module];
  for (const asset of queue) {
    // const dirname = path.dirname(asset.filename);
    // asset.mapping = {};
    const { dependencies } = asset;

    for (const relativePath in dependencies) {
      queue.push(getAsset(dependencies[relativePath]))
    }

    // asset.dependencies.forEach(relativePath => {
    //   const absolutePath = path.join(dirname, relativePath);
    //   const child = getAsset(absolutePath);
    //   asset.mapping[relativePath] = absolutePath;
    //   queue.push(child);
    // });
  }

  const graph = {};
  queue.forEach(item => {
    graph[item.filename] = {
      code: item.code,
      dependencies: item.dependencies,
    };
  });

  return graph;
}

console.log(path.join(process.cwd()));

const graph = generateGraph('./src/index.js');

console.log('graph', graph);

function bundle(entry) {
  const graph = JSON.stringify(generateGraph(entry), null, 2)
  return `
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
      require('${entry}')
   })(${graph})
  `;
}

const result = bundle('./src/index.js');

console.log('result', result);

fs.writeFileSync('./dist/bundle.js', result);