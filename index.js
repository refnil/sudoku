!function(e){function n(n){for(var t,r,i=n[0],u=n[1],c=0,a=[];c<i.length;c++)r=i[c],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&a.push(o[r][0]),o[r]=0;for(t in u)Object.prototype.hasOwnProperty.call(u,t)&&(e[t]=u[t]);for(s&&s(n);a.length;)a.shift()()}var t={},o={0:0};var r={};var i={3:function(){return{"./sudoku_bg.js":{__wbindgen_string_new:function(e,n){return t[2].exports.v(e,n)},__wbindgen_object_drop_ref:function(e){return t[2].exports.u(e)},__wbg_new_59cb74e423758ede:function(){return t[2].exports.j()},__wbg_stack_558ba5917b466edd:function(e,n){return t[2].exports.p(e,n)},__wbg_error_4bb6c2a97407129a:function(e,n){return t[2].exports.c(e,n)},__wbg_log_386a8115a84a780d:function(e){return t[2].exports.g(e)},__wbg_self_86b4b13392c7af56:function(){return t[2].exports.n()},__wbg_static_accessor_MODULE_452b4680e8614c81:function(){return t[2].exports.q()},__wbg_require_f5521a5b85ad2542:function(e,n,o){return t[2].exports.m(e,n,o)},__wbg_crypto_b8c92eaac23d0d80:function(e){return t[2].exports.b(e)},__wbg_msCrypto_9ad6677321a08dd8:function(e){return t[2].exports.h(e)},__wbindgen_is_undefined:function(e){return t[2].exports.s(e)},__wbg_getRandomValues_dd27e6b0652b3236:function(e){return t[2].exports.d(e)},__wbg_getRandomValues_e57c9b75ddead065:function(e,n){return t[2].exports.e(e,n)},__wbg_randomFillSync_d2ba53160aec6aba:function(e,n,o){return t[2].exports.l(e,n,o)},__wbg_buffer_ebc6c8e75510eae3:function(e){return t[2].exports.a(e)},__wbg_length_317f0dd77f7a6673:function(e){return t[2].exports.f(e)},__wbg_new_135e963dedf67b22:function(e){return t[2].exports.i(e)},__wbg_set_4a5072a31008e0cb:function(e,n,o){return t[2].exports.o(e,n,o)},__wbg_newwithlength_78dc302d31527318:function(e){return t[2].exports.k(e)},__wbg_subarray_34c228a45c72d146:function(e,n,o){return t[2].exports.r(e,n,o)},__wbindgen_throw:function(e,n){return t[2].exports.w(e,n)},__wbindgen_memory:function(){return t[2].exports.t()}}}}};function u(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,u),o.l=!0,o.exports}u.e=function(e){var n=[],t=o[e];if(0!==t)if(t)n.push(t[2]);else{var c=new Promise((function(n,r){t=o[e]=[n,r]}));n.push(t[2]=c);var a,l=document.createElement("script");l.charset="utf-8",l.timeout=120,u.nc&&l.setAttribute("nonce",u.nc),l.src=function(e){return u.p+""+e+".index.js"}(e);var s=new Error;a=function(n){l.onerror=l.onload=null,clearTimeout(d);var t=o[e];if(0!==t){if(t){var r=n&&("load"===n.type?"missing":n.type),i=n&&n.target&&n.target.src;s.message="Loading chunk "+e+" failed.\n("+r+": "+i+")",s.name="ChunkLoadError",s.type=r,s.request=i,t[1](s)}o[e]=void 0}};var d=setTimeout((function(){a({type:"timeout",target:l})}),12e4);l.onerror=l.onload=a,document.head.appendChild(l)}return({1:[3]}[e]||[]).forEach((function(e){var t=r[e];if(t)n.push(t);else{var o,c=i[e](),a=fetch(u.p+""+{3:"5a7c23007061ac8aa35a"}[e]+".module.wasm");if(c instanceof Promise&&"function"==typeof WebAssembly.compileStreaming)o=Promise.all([WebAssembly.compileStreaming(a),c]).then((function(e){return WebAssembly.instantiate(e[0],e[1])}));else if("function"==typeof WebAssembly.instantiateStreaming)o=WebAssembly.instantiateStreaming(a,c);else{o=a.then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,c)}))}n.push(r[e]=o.then((function(n){return u.w[e]=(n.instance||n).exports})))}})),Promise.all(n)},u.m=e,u.c=t,u.d=function(e,n,t){u.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},u.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,n){if(1&n&&(e=u(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(u.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)u.d(t,o,function(n){return e[n]}.bind(null,o));return t},u.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return u.d(n,"a",n),n},u.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},u.p="",u.oe=function(e){throw console.error(e),e},u.w={};var c=window.webpackJsonp=window.webpackJsonp||[],a=c.push.bind(c);c.push=n,c=c.slice();for(var l=0;l<c.length;l++)n(c[l]);var s=a;u(u.s=0)}([function(e,n,t){t.e(1).then(t.bind(null,1)).then(e=>{var n=g("//li/span"),t=document.getElementById("count"),o="setter",r=document.getElementById("app_mode"),u=new Set,c=document.getElementById("save"),a=!1,l=document.getElementById("diag_pos"),s=document.getElementById("diag_pos_vis"),d=!1,_=document.getElementById("diag_neg"),f=document.getElementById("diag_neg_vis"),m=!1,p=document.getElementById("king");function g(e){let n=[],t=document.evaluate(e,document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(let e=0,o=t.snapshotLength;e<o;++e)n.push(t.snapshotItem(e));return n}function b(){for(i=0;i<n.length;i++)full_cell=n[i].parentElement,u.has(i)?full_cell.classList.add("selected"):full_cell.classList.remove("selected")}function h(){v(a,l),a?s.classList.add("diag","diag-pos"):s.classList.remove("diag-pos"),v(d,_),d?f.classList.add("diag","diag-neg"):f.classList.remove("diag-neg"),v(m,p)}function v(e,n){n.innerHTML=e?"On":"Off"}function w(e){if("setter"==o)return!0;if("solver"==o)return!n[e].classList.contains("clue");throw"unknown app_mode"}function y(){o="setter"==o?"solver":"setter",r.innerHTML=o}function k(){for(i=0;i<n.length;i++)M(i,"","computer");P()}function E(){for(i=0;i<n.length;i++)M(i,"","human");P()}function x(){for(i=0;i<n.length;i++)M(i,"","clue");P()}function L(e){for(line="",i=0;i<81;i++){e(n[i],n[i].innerHTML)?line+=n[i].innerHTML:line+="."}return line}function I(){return line="",a&&(line+=";diag_pos"),d&&(line+=";diag_neg"),m&&(line+=";king"),line}function O(){return L((e,n)=>""!=n)+I()}function B(e){a=!1,d=!1,m=!1,e.split(";").forEach(e=>{e.startsWith("clue")?W(e.slice(4),"clue"):e.startsWith("human")?W(e.slice(5),"human"):e.startsWith("diag_pos")?a=!0:e.startsWith("diag_neg")?d=!0:e.startsWith("king")&&(m=!0)}),h(),P()}function P(){var n=performance.now();t.innerHTML=e.solution_count(O());var o=performance.now();console.log("solution count timing: ",o-n),save_data=";clue"+L(e=>e.classList.contains("clue"))+";human"+L(e=>e.classList.contains("human"))+I(),c!==document.activeElement&&(c.value=save_data),S()}function S(){new_url=(full_url=window.location.href,full_url.split("?")[0]+"?save="+save_data),window.history.replaceState({},"",new_url)}function j(){var n=e.solve_common(O());81==n.length&&(W(n,"computer"),P())}function T(){W(e.generate(),"clue")}function W(e,n="human"){for(i=0;i<81;i++){var t=e[i];void 0!==t&&"."!==t||(t=""),M(i,t,n)}P()}function M(e,t="",o="human"){switch(cell=n[e],cl=cell.classList,o){case"clue":cl.remove("human","computer");break;case"human":if(cl.contains("clue"))return;cl.remove("computer");break;case"computer":if(cl.contains("clue")||cl.contains("human"))return;break;default:console.error("UNKNOWN KIND: ",o)}cell.innerHTML=t,""==t?cl.remove("clue","human","computer"):cl.add(o)}e.init(),solve=g('//button[@id="solve"]')[0],solve.onclick=j,new_sudoku=g('//button[@id="new"]')[0],new_sudoku.onclick=T,cc_button=document.getElementById("clear_computer"),cc_button.onclick=k,clear_button=document.getElementById("clear"),clear_button.onclick=E,reset_button=document.getElementById("reset"),reset_button.onclick=x,app_mode_button=document.getElementById("app_mode_button"),app_mode_button.onclick=y,diag_pos_button=document.getElementById("diag_pos_button"),diag_pos_button.onclick=e=>{a=!a,h(),P()},diag_neg_button=document.getElementById("diag_neg_button"),diag_neg_button.onclick=e=>{d=!d,h(),P()},king_button=document.getElementById("king_button"),king_button.onclick=e=>{m=!m,h(),P()},function(){var e=!1;function t(e){return n=>{n.shiftKey||u.clear(),u.add(e),b()}}function o(n){return t=>{e&&(u.add(n),b())}}for(i=0;i<n.length;i++)full_cell=n[i].parentElement,full_cell.addEventListener("mousedown",t(i)),full_cell.addEventListener("mouseover",o(i));document.addEventListener("mousedown",()=>e=!0),document.addEventListener("mouseup",()=>e=!1)}(),c.addEventListener("input",e=>{c.value!=O()&&B(c.value),S()}),document.addEventListener("keydown",e=>{var n=parseInt(e.key),t="setter"==o?"clue":"human";if(Number.isInteger(n)&&n>=1&&n<=9){for(let e of u)w(e)&&M(e,n,t);P()}else if("Delete"==e.key||"Backspace"==e.key){for(let e of u)w(e)&&M(e,"",t);P()}else console.log("unhandled event",e.key)});var A=new URLSearchParams(window.location.search).get("save");null!=A&&B(A)})}]);