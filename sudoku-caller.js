(()=>{var e,r,t,n,o,i,a,c,s,u,d,f,_,l,b,p,g,m,v,w,h,y,x,k,S,E,j,A,O={511:(e,r,t)=>{var n=!1;console.notify=function(e,r){var t="";if(0==r)t="No solution";else switch(e){case 0:if(n=!1,r>=5&&r%5!=0)return;t=`${r} or more`;break;case 1:t=`Hit limit at ${r}`,n=!0;break;case 2:if(n)return;t=r;break;case 3:t="Error when parsing sudoku";break;default:return void console.error("Unknown notification",e,r)}postMessage(["solve_count",t])},t.e(56).then(t.bind(t,56)).then((e=>{function r(r){switch(r.data[0]){case"solve_count":!function(r,t){var n=performance.now(),o=e.solution_count_notify(r,t),i=performance.now();console.log("solution count timing: ",i-n,o)}(r.data[1],r.data[2]);break;case"solve_common":!function(r,t){var n;n=e.solve_common_extra(r,t),postMessage(["solve_common",n]),postMessage("finish")}(r.data[1],r.data[2]);break;default:console.error("Could not handle message: ",r)}}for(var t in e.init(),o)r(o[t]);self.onmessage=r}));var o=new Array;self.onmessage=function(e){o.push(e)}}},P={};function C(e){var r=P[e];if(void 0!==r)return r.exports;var t=P[e]={id:e,loaded:!1,exports:{}};return O[e](t,t.exports,C),t.loaded=!0,t.exports}C.m=O,C.c=P,C.d=(e,r)=>{for(var t in r)C.o(r,t)&&!C.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},C.f={},C.e=e=>Promise.all(Object.keys(C.f).reduce(((r,t)=>(C.f[t](e,r),r)),[])),C.u=e=>e+".js",C.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),C.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),C.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),e={},C.l=(r,t,n,o)=>{if(e[r])e[r].push(t);else{var i,a;if(void 0!==n)for(var c=document.getElementsByTagName("script"),s=0;s<c.length;s++){var u=c[s];if(u.getAttribute("src")==r){i=u;break}}i||(a=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,C.nc&&i.setAttribute("nonce",C.nc),i.src=r),e[r]=[t];var d=(t,n)=>{i.onerror=i.onload=null,clearTimeout(f);var o=e[r];if(delete e[r],i.parentNode&&i.parentNode.removeChild(i),o&&o.forEach((e=>e(n))),t)return t(n)},f=setTimeout(d.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=d.bind(null,i.onerror),i.onload=d.bind(null,i.onload),a&&document.head.appendChild(i)}},C.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;C.g.importScripts&&(e=C.g.location+"");var r=C.g.document;if(!e&&r&&(r.currentScript&&(e=r.currentScript.src),!e)){var t=r.getElementsByTagName("script");t.length&&(e=t[t.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),C.p=e})(),(()=>{var e={842:0,511:0};C.f.j=(r,t)=>{var n=C.o(e,r)?e[r]:void 0;if(0!==n)if(n)t.push(n[2]);else{var o=new Promise(((t,o)=>n=e[r]=[t,o]));t.push(n[2]=o);var i=C.p+C.u(r),a=new Error;C.l(i,(t=>{if(C.o(e,r)&&(0!==(n=e[r])&&(e[r]=void 0),n)){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;a.message="Loading chunk "+r+" failed.\n("+o+": "+i+")",a.name="ChunkLoadError",a.type=o,a.request=i,n[1](a)}}),"chunk-"+r,r)}};var r=(r,t)=>{var n,o,[i,a,c]=t,s=0;for(n in a)C.o(a,n)&&(C.m[n]=a[n]);for(c&&c(C),r&&r(t);s<i.length;s++)o=i[s],C.o(e,o)&&e[o]&&e[o][0](),e[i[s]]=0},t=self.webpackChunk=self.webpackChunk||[];t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})(),E={},j={135:function(){return{"./sudoku_bg.js":{__wbindgen_string_new:function(e,t){return void 0===r&&(r=C.c[822].exports),r.h4(e,t)},__wbindgen_object_drop_ref:function(e){return void 0===t&&(t=C.c[822].exports),t.ug(e)},__wbg_notify_3b4c6d5787ae9b8a:function(e,r){return void 0===n&&(n=C.c[822].exports),n._r(e,r)},__wbg_log_386a8115a84a780d:function(e){return void 0===o&&(o=C.c[822].exports),o.IZ(e)},__wbg_new_59cb74e423758ede:function(){return void 0===i&&(i=C.c[822].exports),i.h9()},__wbg_stack_558ba5917b466edd:function(e,r){return void 0===a&&(a=C.c[822].exports),a.Dz(e,r)},__wbg_error_4bb6c2a97407129a:function(e,r){return void 0===c&&(c=C.c[822].exports),c.kF(e,r)},__wbg_self_86b4b13392c7af56:function(){return void 0===s&&(s=C.c[822].exports),s.U5()},__wbg_static_accessor_MODULE_452b4680e8614c81:function(){return void 0===u&&(u=C.c[822].exports),u.DA()},__wbg_require_f5521a5b85ad2542:function(e,r,t){return void 0===d&&(d=C.c[822].exports),d.r2(e,r,t)},__wbg_crypto_b8c92eaac23d0d80:function(e){return void 0===f&&(f=C.c[822].exports),f.iY(e)},__wbg_msCrypto_9ad6677321a08dd8:function(e){return void 0===_&&(_=C.c[822].exports),_.mS(e)},__wbindgen_is_undefined:function(e){return void 0===l&&(l=C.c[822].exports),l.XP(e)},__wbg_getRandomValues_dd27e6b0652b3236:function(e){return void 0===b&&(b=C.c[822].exports),b.yX(e)},__wbg_getRandomValues_e57c9b75ddead065:function(e,r){return void 0===p&&(p=C.c[822].exports),p.ae(e,r)},__wbg_randomFillSync_d2ba53160aec6aba:function(e,r,t){return void 0===g&&(g=C.c[822].exports),g.Os(e,r,t)},__wbg_buffer_ebc6c8e75510eae3:function(e){return void 0===m&&(m=C.c[822].exports),m.v3(e)},__wbg_length_317f0dd77f7a6673:function(e){return void 0===v&&(v=C.c[822].exports),v.rX(e)},__wbg_new_135e963dedf67b22:function(e){return void 0===w&&(w=C.c[822].exports),w.XV(e)},__wbg_set_4a5072a31008e0cb:function(e,r,t){return void 0===h&&(h=C.c[822].exports),h.CV(e,r,t)},__wbg_newwithlength_78dc302d31527318:function(e){return void 0===y&&(y=C.c[822].exports),y.wS(e)},__wbg_subarray_34c228a45c72d146:function(e,r,t){return void 0===x&&(x=C.c[822].exports),x.R2(e,r,t)},__wbindgen_throw:function(e,r){return void 0===k&&(k=C.c[822].exports),k.Or(e,r)},__wbindgen_memory:function(){return void 0===S&&(S=C.c[822].exports),S.oH()}}}}},A={56:[135]},C.w={},C.f.wasm=function(e,r){(A[e]||[]).forEach((function(t,n){var o=E[t];if(o)r.push(o);else{var i,a=j[t](),c=fetch(C.p+""+{56:{135:"a61fb4c56fd382800654"}}[e][t]+".module.wasm");i=a instanceof Promise&&"function"==typeof WebAssembly.compileStreaming?Promise.all([WebAssembly.compileStreaming(c),a]).then((function(e){return WebAssembly.instantiate(e[0],e[1])})):"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(c,a):c.then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,a)})),r.push(E[t]=i.then((function(e){return C.w[t]=(e.instance||e).exports})))}}))},C(511)})();