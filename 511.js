(()=>{var e,t,r,n,o,i,c,a,s,u,_,d,f,b,p,l,g,m,w,v,h,y,x,S,k,j={511:(e,t,r)=>{var n=!1;console.notify=function(e,t){var r="";if(0==t)r="No solution";else switch(e){case 0:if(n=!1,t>=5&&t%5!=0)return;r=`${t} or more`;break;case 1:r=`Hit limit at ${t}`,n=!0;break;case 2:if(n)return;r=t;break;case 3:r="Error when parsing sudoku";break;default:return void console.error("Unknown notification",e,t)}postMessage(["solve_count",r])},r.e(56).then(r.bind(r,56)).then((e=>{function t(t){switch(t.data[0]){case"solve_count":!function(t,r){var n=performance.now(),o=e.solution_count_notify(t,r),i=performance.now();console.log("solution count timing: ",i-n,o)}(t.data[1],t.data[2]);break;case"solve_common":!function(t,r){var n;n=e.solve_common_extra(t,r),postMessage(["solve_common",n]),postMessage("finish")}(t.data[1],t.data[2]);break;default:console.error("Could not handle message: ",t)}}for(var r in e.init(),o)t(o[r]);self.onmessage=t}));var o=new Array;self.onmessage=function(e){o.push(e)}}},O={};function P(e){var t=O[e];if(void 0!==t)return t.exports;var r=O[e]={id:e,loaded:!1,exports:{}};return j[e](r,r.exports,P),r.loaded=!0,r.exports}P.m=j,P.c=O,P.d=(e,t)=>{for(var r in t)P.o(t,r)&&!P.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},P.f={},P.e=e=>Promise.all(Object.keys(P.f).reduce(((t,r)=>(P.f[r](e,t),t)),[])),P.u=e=>e+".js",P.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),P.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),P.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),P.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;P.g.importScripts&&(e=P.g.location+"");var t=P.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),P.p=e})(),(()=>{var e={511:1,842:1};P.f.i=(t,r)=>{e[t]||importScripts(P.p+P.u(t))};var t=self.webpackChunk=self.webpackChunk||[],r=t.push.bind(t);t.push=t=>{var[n,o,i]=t;for(var c in o)P.o(o,c)&&(P.m[c]=o[c]);for(i&&i(P);n.length;)e[n.pop()]=1;r(t)}})(),x={},S={135:function(){return{"./sudoku_bg.js":{__wbg_notify_3b4c6d5787ae9b8a:function(t,r){return void 0===e&&(e=P.c[822].exports),e._r(t,r)},__wbg_new_59cb74e423758ede:function(){return void 0===t&&(t=P.c[822].exports),t.h9()},__wbg_stack_558ba5917b466edd:function(e,t){return void 0===r&&(r=P.c[822].exports),r.Dz(e,t)},__wbg_error_4bb6c2a97407129a:function(e,t){return void 0===n&&(n=P.c[822].exports),n.kF(e,t)},__wbindgen_object_drop_ref:function(e){return void 0===o&&(o=P.c[822].exports),o.ug(e)},__wbg_self_86b4b13392c7af56:function(){return void 0===i&&(i=P.c[822].exports),i.U5()},__wbg_static_accessor_MODULE_452b4680e8614c81:function(){return void 0===c&&(c=P.c[822].exports),c.DA()},__wbg_require_f5521a5b85ad2542:function(e,t,r){return void 0===a&&(a=P.c[822].exports),a.r2(e,t,r)},__wbg_crypto_b8c92eaac23d0d80:function(e){return void 0===s&&(s=P.c[822].exports),s.iY(e)},__wbg_msCrypto_9ad6677321a08dd8:function(e){return void 0===u&&(u=P.c[822].exports),u.mS(e)},__wbindgen_is_undefined:function(e){return void 0===_&&(_=P.c[822].exports),_.XP(e)},__wbg_getRandomValues_dd27e6b0652b3236:function(e){return void 0===d&&(d=P.c[822].exports),d.yX(e)},__wbg_getRandomValues_e57c9b75ddead065:function(e,t){return void 0===f&&(f=P.c[822].exports),f.ae(e,t)},__wbg_randomFillSync_d2ba53160aec6aba:function(e,t,r){return void 0===b&&(b=P.c[822].exports),b.Os(e,t,r)},__wbg_buffer_ebc6c8e75510eae3:function(e){return void 0===p&&(p=P.c[822].exports),p.v3(e)},__wbg_length_317f0dd77f7a6673:function(e){return void 0===l&&(l=P.c[822].exports),l.rX(e)},__wbg_new_135e963dedf67b22:function(e){return void 0===g&&(g=P.c[822].exports),g.XV(e)},__wbg_set_4a5072a31008e0cb:function(e,t,r){return void 0===m&&(m=P.c[822].exports),m.CV(e,t,r)},__wbg_newwithlength_78dc302d31527318:function(e){return void 0===w&&(w=P.c[822].exports),w.wS(e)},__wbg_subarray_34c228a45c72d146:function(e,t,r){return void 0===v&&(v=P.c[822].exports),v.R2(e,t,r)},__wbindgen_throw:function(e,t){return void 0===h&&(h=P.c[822].exports),h.Or(e,t)},__wbindgen_memory:function(){return void 0===y&&(y=P.c[822].exports),y.oH()}}}}},k={56:[135]},P.w={},P.f.wasm=function(e,t){(k[e]||[]).forEach((function(r,n){var o=x[r];if(o)t.push(o);else{var i,c=S[r](),a=fetch(P.p+""+{56:{135:"34c3c000a38a760ce713"}}[e][r]+".module.wasm");i=c instanceof Promise&&"function"==typeof WebAssembly.compileStreaming?Promise.all([WebAssembly.compileStreaming(a),c]).then((function(e){return WebAssembly.instantiate(e[0],e[1])})):"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(a,c):a.then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,c)})),t.push(x[r]=i.then((function(e){return P.w[r]=(e.instance||e).exports})))}}))},P(511)})();