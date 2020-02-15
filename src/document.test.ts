/**
 * @jest-environment jsdom
 */

const FS = require('fs');
const Path = require('path');
const { JSDOM } = require('jsdom');

test('doFunction', async () => {
  const ENV = require('../build/env')();
  const scriptStr = await FS.readFileSync(Path.join(ENV.outputPath, 'document.js'), { encoding: 'utf8' });
  const documentHTML = `
  <!DOCTYPE html>
<html lang="zh">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no,width=device-width" />
  <meta name="format-detection" content="telephone=no,email=no" />
  <meta name="renderer" content="webkit" />
  <meta http-equiv="Content-Security-Policy" />
  <meta name="description" content="<%= webpackConfig.name %>" />
  <link rel="canonical" href=""/>
  <title></title>
</head>
<body>
<div id="app"></div>
</body>
</html>`;

  // const dom = new JSDOM(documentHTML) as any;
  const dom = new JSDOM('<body></body>');
  /* expect(dom.window.document.querySelector('p').textContent).toBe(null); */
});
