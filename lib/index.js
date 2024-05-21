import { parse } from '@babel/parser';
import traverse from "@babel/traverse";
import { transformFromAst } from '@babel/core';
import fs from 'fs';
import path from 'path';

function getAsset(filename) {
  const code = fs.readFileSync(filename, 'utf-8');
  const ast = parse(code, {
    sourceType: 'module',
  });
  const deps = []
  traverse.default(ast, {
    ImportDeclaration(path) {
      deps.push(path.node.source.value);
    },
  });

  const { code: transformedCode } = transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  });

  return {
    filename,
    code: transformedCode,
    dependencies: deps,
  };
}

function generateGraph(entry) {
  const mainAsset = getAsset(entry);
  console.log('mainAsset', mainAsset);
  const queue = [mainAsset];
  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);
    asset.mapping = {};
    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath);
      const child = getAsset(absolutePath);
      asset.mapping[relativePath] = absolutePath;
      queue.push(child);
    });
  }
  return queue;
}

const graph = generateGraph('./src/index.js');

console.log('graph', graph);
