(()=>{var e={m:{},u:e=>e+".js"};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),e.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var t;e.g.importScripts&&(t=e.g.location+"");var r=e.g.document;if(!t&&r&&(r.currentScript&&(t=r.currentScript.src),!t)){var a=r.getElementsByTagName("script");a.length&&(t=a[a.length-1].src)}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),e.p=t})(),e.b=document.baseURI||self.location.href;var t=new Map,r=new Set,a=new Map,n=new Map;self.onmessage=s=>{var o=s.data[0],i=s.data[1];if(a.get(o)!=i){var c=function(a){var n=t.get(a);return r.has(a)||(null!=n&&n.terminate(),n=new Worker(new URL(e.p+e.u(511),e.b))),n}(o);c.onmessage=e=>{"finish"==e.data?r.add(o):(postMessage(e.data),n.set(o,e.data))},c.postMessage(s.data),t.set(o,c),a.set(o,i),r.delete(o),n.delete(o)}else{var l=n.get(o);null!=l&&postMessage(l)}}})();