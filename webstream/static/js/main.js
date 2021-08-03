(this.webpackJsonpwebapp=this.webpackJsonpwebapp||[]).push([[0],{126:function(e,t,n){},128:function(e,t,n){},129:function(e,t,n){"use strict";n.r(t);var c=n(0),o=n.n(c),s=n(40),i=n.n(s),r=n(14),a=n(165),u=n(167),l=n(164),j=n(3),d={filterState:{brightness:0,setBrightness:function(){return 0},contrast:0,setContrast:function(){return 0},nightVision:!1,setNightVision:function(){return!1}},connectionState:{connected:!1,setConnected:function(){return!1},address:"192.168.50.5",setAddress:function(){return"192.168.50.5"}}},b=Object(c.createContext)(d);function f(){return Object(c.useContext)(b)}var h=function(e){var t=e.children,n=Object(c.useState)(0),o=Object(r.a)(n,2),s=o[0],i=o[1],a=Object(c.useState)(0),u=Object(r.a)(a,2),l=u[0],d=u[1],f=Object(c.useState)(!1),h=Object(r.a)(f,2),O=h[0],g=h[1],x=Object(c.useState)(!1),m=Object(r.a)(x,2),v=m[0],S=m[1],C=Object(c.useState)("192.168.0.199"),p=Object(r.a)(C,2),N={filterState:{brightness:s,setBrightness:i,contrast:l,setContrast:d,nightVision:O,setNightVision:g},connectionState:{connected:v,setConnected:S,address:p[0],setAddress:p[1]}};return Object(j.jsx)(b.Provider,{value:N,children:t})},O=n(71),g=n(31),x=n(72),m=function(){var e=Object(c.useState)(!1),t=Object(r.a)(e,2),n=t[0],o=t[1],s=f().filterState,i=s.brightness,d=s.setBrightness,b=s.contrast,h=s.setContrast,m=s.nightVision,v=s.setNightVision;Object(c.useEffect)((function(){return o("granted"===Notification.permission)}),[]);return Object(j.jsx)(O.a,{fluid:"sm",className:"mt-3 mb-5",children:Object(j.jsxs)(x.a,{className:"align-items-center justify-content-center",children:[Object(j.jsx)(g.a,{xs:8,children:Object(j.jsx)(a.a,{label:"Brightness",min:-100,max:100,step:10,value:i,onChange:function(e){return d(e)},showValue:!0,originFromZero:!0})}),Object(j.jsx)(g.a,{xs:3,children:Object(j.jsx)(u.a,{label:"Nightvision",onText:"On",offText:"Off",onChange:function(e,t){return v(null!==t&&void 0!==t&&t)},checked:m})}),Object(j.jsx)(g.a,{xs:8,children:Object(j.jsx)(a.a,{label:"Contrast",min:-100,max:100,step:10,value:b,onChange:function(e){return h(e)},showValue:!0,originFromZero:!0})}),Object(j.jsx)(g.a,{xs:3,children:Object(j.jsx)(l.a,{text:"Reset",onClick:function(){d(0),h(0),v(!1)}})}),!n&&Object(j.jsx)(g.a,{xs:"auto",className:"mt-4",children:Object(j.jsx)(l.a,{text:"Enable notifications",onClick:function(){n||Notification.requestPermission().then((function(e){o("granted"===e)}))}})})]})})},v=n(166),S=n(21),C=n(53),p=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t={reconnectionAttempts:5,reconnectionDelay:1e3,reconnectionDelayMax:5e3,timeout:2e4,requestTimeout:1e3},n=e?Object(C.io)(e,t):Object(C.io)(t);return n.on("connect",(function(){n.io.engine.requestTimeout=0,console.log("Socket connected.")})),n.on("connect_error",(function(e){console.log("Connection failed... ".concat(e))})),n.on("disconnect",(function(e){console.log("Socket disconnected. Reason: ".concat(e))})),n.on("error",(function(e){console.log("Error: ".concat(e))})),n},N=(n(126),function(){var e=f(),t=e.filterState,n=t.brightness,o=t.contrast,s=t.nightVision,i=e.connectionState,a=i.connected,u=i.setConnected,l=Object(c.useState)(!1),d=Object(r.a)(l,2),b=d[0],h=d[1],O=Object(c.useRef)(null),g=Object(c.useRef)(null),x=Object(c.useState)("brightness(".concat(n+100,"%) \n        contrast(").concat(o+100,"%)\n        hue-rotate(").concat(s?"90deg":"0",")\n        saturate(").concat(s?"10":"1",")")),m=Object(r.a)(x,2),C=m[0],N=m[1];Object(c.useEffect)((function(){N("brightness(".concat(n+100,"%) \n            contrast(").concat(o+100,"%) \n            hue-rotate(").concat(s?"90deg":"0",") \n            saturate(").concat(s?"10":"1",")"))}),[n,o,s]),Object(c.useEffect)((function(){p().on("motion",(function(){var e,t;null===(e=g.current)||void 0===e||e.classList.remove("motion-alert"),null===(t=g.current)||void 0===t||t.classList.add("motion-alert")}))}),[]);return Object(j.jsxs)(j.Fragment,{children:[!a&&Object(j.jsx)("div",{id:"loader",children:Object(j.jsx)(v.a,{label:"Connecting to camera...",size:S.a.large})}),Object(j.jsx)("div",{ref:O,children:Object(j.jsx)("img",{id:"videoFeed",style:{filter:C},src:"/video_feed",onClick:function(){var e;null===(e=g.current)||void 0===e||e.classList.remove("motion-alert")},onDoubleClick:function(){var e;b?document.exitFullscreen().then((function(){return h(!1)})).catch((function(e){return console.error(e)})):null===(e=O.current)||void 0===e||e.requestFullscreen({navigationUI:"hide"}).then((function(){return h(!0)})).catch((function(e){return console.error(e)}))},onLoad:function(){return u(!0)},ref:g})})]})});var k=function(){var e=f().connectionState.connected;return Object(j.jsxs)("div",{className:"App",children:[Object(j.jsx)("header",{className:"App-header"}),Object(j.jsx)(N,{}),e&&Object(j.jsx)(m,{})]})};n(127),n(128);i.a.render(Object(j.jsx)(o.a.StrictMode,{children:Object(j.jsx)(h,{children:Object(j.jsx)(k,{})})}),document.getElementById("root"))}},[[129,1,2]]]);