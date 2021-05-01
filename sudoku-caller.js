(()=>{var e,r,n,t,o,i,a,c,s,u,d,_,f,l,b,p,g,m,v,w,h,y,x,k,S,E,j,A,O={511:(e,r,n)=>{var t=!1;console.notify=function(e,r){var n="";if(0==r)n="No solution";else switch(e){case 0:if(t=!1,r>=5&&r%5!=0)return;n=`${r} or more`;break;case 1:n=`Hit limit at ${r}`,t=!0;break;case 2:if(t)return;n=r;break;case 3:n="Error when parsing sudoku";break;default:return void console.error("Unknown notification",e,r)}postMessage(["solve_count",n])},n.e(56).then(n.bind(n,56)).then((e=>{function r(r){switch(r.data[0]){case"solve_count":n=r.data[1],t=performance.now(),o=e.solution_count_notify(n),i=performance.now(),console.log("solution count timing: ",i-t,o);break;case"solve_common":!function(r){var n;n=e.solve_common_extra(r),postMessage(["solve_common",n]),postMessage("finish")}(r.data[1]);break;default:console.error("Could not handle message: ",r)}var n,t,o,i}for(var n in e.init(),o)r(o[n]);self.onmessage=r}));var o=new Array;self.onmessage=function(e){o.push(e)}}},P={};function C(e){var r=P[e];if(void 0!==r)return r.exports;var n=P[e]={id:e,loaded:!1,exports:{}};return O[e](n,n.exports,C),n.loaded=!0,n.exports}C.m=O,C.c=P,C.d=(e,r)=>{for(var n in r)C.o(r,n)&&!C.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},C.f={},C.e=e=>Promise.all(Object.keys(C.f).reduce(((r,n)=>(C.f[n](e,r),r)),[])),C.u=e=>e+".js",C.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),C.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),C.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),e={},C.l=(r,n,t,o)=>{if(e[r])e[r].push(n);else{var i,a;if(void 0!==t)for(var c=document.getElementsByTagName("script"),s=0;s<c.length;s++){var u=c[s];if(u.getAttribute("src")==r){i=u;break}}i||(a=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,C.nc&&i.setAttribute("nonce",C.nc),i.src=r),e[r]=[n];var d=(n,t)=>{i.onerror=i.onload=null,clearTimeout(_);var o=e[r];if(delete e[r],i.parentNode&&i.parentNode.removeChild(i),o&&o.forEach((e=>e(t))),n)return n(t)},_=setTimeout(d.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=d.bind(null,i.onerror),i.onload=d.bind(null,i.onload),a&&document.head.appendChild(i)}},C.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;C.g.importScripts&&(e=C.g.location+"");var r=C.g.document;if(!e&&r&&(r.currentScript&&(e=r.currentScript.src),!e)){var n=r.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),C.p=e})(),(()=>{var e={842:0,511:0};C.f.j=(r,n)=>{var t=C.o(e,r)?e[r]:void 0;if(0!==t)if(t)n.push(t[2]);else{var o=new Promise(((n,o)=>t=e[r]=[n,o]));n.push(t[2]=o);var i=C.p+C.u(r),a=new Error;C.l(i,(n=>{if(C.o(e,r)&&(0!==(t=e[r])&&(e[r]=void 0),t)){var o=n&&("load"===n.type?"missing":n.type),i=n&&n.target&&n.target.src;a.message="Loading chunk "+r+" failed.\n("+o+": "+i+")",a.name="ChunkLoadError",a.type=o,a.request=i,t[1](a)}}),"chunk-"+r,r)}};var r=(r,n)=>{var t,o,[i,a,c]=n,s=0;for(t in a)C.o(a,t)&&(C.m[t]=a[t]);for(c&&c(C),r&&r(n);s<i.length;s++)o=i[s],C.o(e,o)&&e[o]&&e[o][0](),e[i[s]]=0},n=self.webpackChunk=self.webpackChunk||[];n.forEach(r.bind(null,0)),n.push=r.bind(null,n.push.bind(n))})(),E={},j={135:function(){return{"./sudoku_bg.js":{__wbindgen_string_new:function(e,n){return void 0===r&&(r=C.c[822].exports),r.h4(e,n)},__wbindgen_object_drop_ref:function(e){return void 0===n&&(n=C.c[822].exports),n.ug(e)},__wbg_notify_3b4c6d5787ae9b8a:function(e,r){return void 0===t&&(t=C.c[822].exports),t._r(e,r)},__wbg_log_386a8115a84a780d:function(e){return void 0===o&&(o=C.c[822].exports),o.IZ(e)},__wbg_new_59cb74e423758ede:function(){return void 0===i&&(i=C.c[822].exports),i.h9()},__wbg_stack_558ba5917b466edd:function(e,r){return void 0===a&&(a=C.c[822].exports),a.Dz(e,r)},__wbg_error_4bb6c2a97407129a:function(e,r){return void 0===c&&(c=C.c[822].exports),c.kF(e,r)},__wbg_self_86b4b13392c7af56:function(){return void 0===s&&(s=C.c[822].exports),s.U5()},__wbg_static_accessor_MODULE_452b4680e8614c81:function(){return void 0===u&&(u=C.c[822].exports),u.DA()},__wbg_require_f5521a5b85ad2542:function(e,r,n){return void 0===d&&(d=C.c[822].exports),d.r2(e,r,n)},__wbg_crypto_b8c92eaac23d0d80:function(e){return void 0===_&&(_=C.c[822].exports),_.iY(e)},__wbg_msCrypto_9ad6677321a08dd8:function(e){return void 0===f&&(f=C.c[822].exports),f.mS(e)},__wbindgen_is_undefined:function(e){return void 0===l&&(l=C.c[822].exports),l.XP(e)},__wbg_getRandomValues_dd27e6b0652b3236:function(e){return void 0===b&&(b=C.c[822].exports),b.yX(e)},__wbg_getRandomValues_e57c9b75ddead065:function(e,r){return void 0===p&&(p=C.c[822].exports),p.ae(e,r)},__wbg_randomFillSync_d2ba53160aec6aba:function(e,r,n){return void 0===g&&(g=C.c[822].exports),g.Os(e,r,n)},__wbg_buffer_ebc6c8e75510eae3:function(e){return void 0===m&&(m=C.c[822].exports),m.v3(e)},__wbg_length_317f0dd77f7a6673:function(e){return void 0===v&&(v=C.c[822].exports),v.rX(e)},__wbg_new_135e963dedf67b22:function(e){return void 0===w&&(w=C.c[822].exports),w.XV(e)},__wbg_set_4a5072a31008e0cb:function(e,r,n){return void 0===h&&(h=C.c[822].exports),h.CV(e,r,n)},__wbg_newwithlength_78dc302d31527318:function(e){return void 0===y&&(y=C.c[822].exports),y.wS(e)},__wbg_subarray_34c228a45c72d146:function(e,r,n){return void 0===x&&(x=C.c[822].exports),x.R2(e,r,n)},__wbindgen_throw:function(e,r){return void 0===k&&(k=C.c[822].exports),k.Or(e,r)},__wbindgen_memory:function(){return void 0===S&&(S=C.c[822].exports),S.oH()}}}}},A={56:[135]},C.w={},C.f.wasm=function(e,r){(A[e]||[]).forEach((function(n,t){var o=E[n];if(o)r.push(o);else{var i,a=j[n](),c=fetch(C.p+""+{56:{135:"53a07b675e95b9784727"}}[e][n]+".module.wasm");i=a instanceof Promise&&"function"==typeof WebAssembly.compileStreaming?Promise.all([WebAssembly.compileStreaming(c),a]).then((function(e){return WebAssembly.instantiate(e[0],e[1])})):"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(c,a):c.then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,a)})),r.push(E[n]=i.then((function(e){return C.w[n]=(e.instance||e).exports})))}}))},C(511)})();