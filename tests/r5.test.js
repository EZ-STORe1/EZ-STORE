'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const get=p=>fs.readFileSync(path.join(root,p),'utf8');
test('customer home has no admin link, person icon, robot artwork',()=>{
 const html=get('public/index.html');
 assert.doesNotMatch(html, /\/admin|user-icon|admin-icon|♙|♟|hero-showcase|hero-art|hero-face|robot/i);
});
test('bulk delete has visible form beside Add and uses same selected product',()=>{
 const html=get('admin/admin.html'),js=get('admin/admin.js'),server=get('server.js');
 assert.ok(html.indexOf('id="bulkDeleteForm"')>html.indexOf('id="inventoryForm"'));
 assert.ok(html.indexOf('id="bulkDeleteForm"')<html.indexOf('02 / LIVE STOCK'));
 assert.match(js, /const productId.*productSelect.*value;\s*const productName/);
 assert.match(server,/inventory\/bulk-delete/);
 assert.match(server,/status='available'/);
});
test('isolated port and USDT only in R5',()=>{
 assert.match(get('server.js'),/EZ-STORE-R5-2026-11-02/);
 assert.match(get('START_EZSTORE.bat'),/set "PORT=3200"/);
 assert.doesNotMatch(get('public/index.html'),/paypal/i);
});
