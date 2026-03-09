function l(o,c=300){let e;const t=[];return function(...u){return e&&clearTimeout(e),new Promise((function(s,i){t.push({resolve:s,reject:i});try{e=setTimeout((()=>{e=null;const r=o(...u);t.forEach((({resolve:n})=>n(r)))}),c)}catch(r){t.forEach((({reject:n})=>n(r)))}}))}}export{l as t};

//# sourceMappingURL=index.esm.CiF4_vw8.js.map