/*!
 *
 * across-tabs "0.1.1"
 * https://github.com/wingify/across-tabs.js
 * MIT licensed
 *
 * Copyright (C) 2017-2018 Wingify - A project by Varun Malhotra(https://github.com/softvar)
 *
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("AcrossTabs",[],t):"object"==typeof exports?exports.AcrossTabs=t():e.AcrossTabs=t()}(this,function(){return function(e){function t(a){if(n[a])return n[a].exports;var r=n[a]={exports:{},id:a,loaded:!1};return e[a].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),i=a(r),o=n(11),s=a(o),u={Parent:i["default"],Child:s["default"]};t["default"]=u,e.exports=t["default"]},function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),s=n(2),u=a(s),d=n(3),l=a(d),f=n(9),c=a(f),h=n(6),v=a(h),_=n(7),b=a(_),p=n(4),w=a(p),g=n(10),y=a(g),O=void 0,E=void 0,N=function(){function e(t){r(this,e),t=t||{},"undefined"==typeof t.heartBeatInterval&&(t.heartBeatInterval=500),"undefined"==typeof t.shouldInitImmediately&&(t.shouldInitImmediately=!0),l["default"].closeAll(),this.Tab=u["default"],i(this,t),this.shouldInitImmediately&&this.init()}return o(e,[{key:"addInterval",value:function(){var e=void 0,t=l["default"].getAll(),n=l["default"].getOpened();if(!n||!n.length)return window.clearInterval(O),O=null,!1;for(e=0;e<t.length;e++)this.removeClosedTabs&&this.watchStatus(t[e]),t[e]&&(t[e].status=t[e].ref.closed?v["default"].CLOSE:v["default"].OPEN);this.onPollingCallback&&this.onPollingCallback()}},{key:"startPollingTabs",value:function(){var e=this;O=window.setInterval(function(){return e.addInterval()},this.heartBeatInterval)}},{key:"watchStatus",value:function(e){if(!e)return!1;var t=e.ref.closed?v["default"].CLOSE:v["default"].OPEN,n=e.status;return!(!t||t===n)&&void(n===v["default"].OPEN&&t===v["default"].CLOSE&&l["default"]._remove(e))}},{key:"customEventUnListener",value:function(e){this.enableElements(),this.onHandshakeCallback&&this.onHandshakeCallback(e.detail)}},{key:"addEventListeners",value:function(){var e=this;window.removeEventListener("message",y["default"].onNewTab),window.addEventListener("message",y["default"].onNewTab),window.removeEventListener("toggleElementDisabledAttribute",this.customEventUnListener),window.addEventListener("toggleElementDisabledAttribute",function(t){return e.customEventUnListener(t)}),window.onbeforeunload=function(){l["default"].broadCastAll(w["default"].PARENT_DISCONNECTED)}}},{key:"enableElements",value:function(){c["default"].enable("data-tab-opener")}},{key:"getAllTabs",value:function(){return l["default"].getAll()}},{key:"getOpenedTabs",value:function(){return l["default"].getOpened()}},{key:"getClosedTabs",value:function(){return l["default"].getClosed()}},{key:"closeAllTabs",value:function(){return l["default"].closeAll()}},{key:"closeTab",value:function(e){return l["default"].closeTab(e)}},{key:"broadCastAll",value:function(e){return l["default"].broadCastAll(e)}},{key:"broadCastTo",value:function(e,t){return l["default"].broadCastTo(e,t)}},{key:"openNewTab",value:function(e){if(!e)throw new Error(b["default"].CONFIG_REQUIRED);var t=e.url;if(!t)throw new Error(b["default"].URL_REQUIRED);return E=new this.Tab,E.create(e),O||this.startPollingTabs(),E}},{key:"init",value:function(){this.addEventListeners()}}]),e}();t["default"]=N,e.exports=t["default"]},function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),s=n(3),u=a(s),d=n(8),l=a(d),f=n(9),c=a(f),h=function(){function e(){r(this,e),window.name=window.name||"PARENT_TAB"}return o(e,[{key:"create",value:function(e){return e=e||{},i(this,e),this.id=l["default"].generate()||u["default"].tabs.length+1,this.status="open",this.ref=window.open(this.url,e.windowName||"_blank",e.windowFeatures),c["default"].disable("data-tab-opener"),window.newlyTabOpened={id:this.id,name:this.name,ref:this.ref},u["default"].addNew(this),this}}]),e}();t["default"]=h,e.exports=t["default"]},function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(4),i=a(r),o=n(5),s=a(o),u=n(6),d=a(u),l=n(7),f=a(l),c={tabs:[]};c._remove=function(e){var t=void 0;t=s["default"].searchByKeyName(c.tabs,"id",e.id,"index"),c.tabs.splice(t,1)},c._preProcessMessage=function(e){try{e=JSON.stringify(e)}catch(t){throw new Error(f["default"].INVALID_JSON)}return e.indexOf(i["default"].PARENT_COMMUNICATED)===-1&&(e=i["default"].PARENT_COMMUNICATED+e),e},c.addNew=function(e){c.tabs.push(e)},c.getOpened=function(){return c.tabs.filter(function(e){return e.status===d["default"].OPEN})},c.getClosed=function(){return c.tabs.filter(function(e){return e.status===d["default"].CLOSE})},c.getAll=function(){return c.tabs},c.closeTab=function(e){var t=s["default"].searchByKeyName(c.tabs,"id",e);return t&&(t.ref.close(),t.status=d["default"].CLOSE),c},c.closeAll=function(){var e=void 0;for(e=0;e<c.tabs.length;e++)c.tabs[e].ref.close(),c.tabs[e].status=d["default"].CLOSE;return c},c.broadCastAll=function(e){var t=void 0,n=c.getOpened();for(e=c._preProcessMessage(e),t=0;t<n.length;t++)c.sendMessage(n[t],e);return c},c.broadCastTo=function(e,t){var n=void 0,a=c.getAll();return t=c._preProcessMessage(t),n=s["default"].searchByKeyName(a,"id",e),c.sendMessage(n,t),c},c.sendMessage=function(e,t){e.ref.length>1?e.ref[0].postMessage(t,"*"):e.ref.postMessage(t,"*")},t["default"]=c,e.exports=t["default"]},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={LOADED:"__TAB__LOADED_EVENT__",CUSTOM:"__TAB__CUSTOM_EVENT__",ON_BEFORE_UNLOAD:"__TAB__ON_BEFORE_UNLOAD__",PARENT_DISCONNECTED:"__PARENT_DISCONNECTED__",HANDSHAKE_WITH_PARENT:"__HANDSHAKE_WITH_PARENT__",PARENT_COMMUNICATED:"__PARENT_COMMUNICATED__"};t["default"]=n,e.exports=t["default"]},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={},a={INDEX:"index",OBJECT:"object",BOTH:"both"};n.searchByKeyName=function(e,t,n,r){if(!e||!t)return!1;r=r||a[1];var i=void 0,o=void 0,s=void 0,u=-1;for(i=0;i<e.length;i++){if(o=e[i],!isNaN(n)&&parseInt(o[t],10)===parseInt(n,10)){u=i;break}if(isNaN(n)&&o[t]===n){u=i;break}}switch(u===-1&&(e[u]={}),r){case a.INDEX:s=u;break;case a.BOTH:s={obj:e[u],index:u};break;case a.OBJECT:default:s=e[u]}return s},t["default"]=n,e.exports=t["default"]},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={OPEN:"open",CLOSE:"close"};t["default"]=n,e.exports=t["default"]},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={INVALID_JSON:"Invalid JSON Object!",INVALID_DATA:"Some wrong message is being sent by Parent.",CONFIG_REQUIRED:"Configuration options required. Please read docs.",URL_REQUIRED:"Url is needed for creating and opening a new window/tab. Please read docs."};t["default"]=n,e.exports=t["default"]},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});/**
	 * UUID.js: The RFC-compliant UUID generator for JavaScript.
	 * ES6 port of only `generate` method of UUID by Varun Malhotra under MIT License
	 *
	 * @author  LiosK
	 * @version v3.3.0
	 * @license The MIT License: Copyright (c) 2010-2016 LiosK.
	 */
var n=void 0;n=function(){function e(){}return e.generate=function(){var t=e._getRandomInt,n=e._hexAligner;return n(t(32),8)+"-"+n(t(16),4)+"-"+n(16384|t(12),4)+"-"+n(32768|t(14),4)+"-"+n(t(48),12)},e._getRandomInt=function(e){return e<0?NaN:e<=30?0|Math.random()*(1<<e):e<=53?(0|Math.random()*(1<<30))+(0|Math.random()*(1<<e-30))*(1<<30):NaN},e._getIntAligner=function(e){return function(t,n){for(var a=t.toString(e),r=n-a.length,i="0";r>0;r>>>=1,i+=i)1&r&&(a=i+a);return a}},e._hexAligner=e._getIntAligner(16),e.prototype.toString=function(){return this.hexString},e}(n),t["default"]=n,e.exports=t["default"]},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={disable:function(e){if(!e)return!1;var t=void 0,n=document.querySelectorAll("["+e+"]");for(t=0;t<n.length;t++)n[t].setAttribute("disabled","disabled")},enable:function(e){if(!e)return!1;var t=void 0,n=document.querySelectorAll("["+e+"]");for(t=0;t<n.length;t++)n[t].removeAttribute("disabled")}};t["default"]=n,e.exports=t["default"]},function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(5),i=a(r),o=n(3),s=a(o),u=n(7),d=a(u),l=n(4),f=a(l),c={};c._onLoad=function(e){var t=void 0,n=void 0,a=e.split(f["default"].LOADED)[1];if(a)try{a=JSON.parse(a),a.id&&(t=s["default"].getAll(),t.length&&(window.newlyTabOpened=t[t.length-1],window.newlyTabOpened.id=a.id,window.newlyTabOpened.name=a.name))}catch(r){throw new Error(d["default"].INVALID_JSON)}if(window.newlyTabOpened)try{n=f["default"].HANDSHAKE_WITH_PARENT,n+=JSON.stringify({id:window.newlyTabOpened.id,name:window.newlyTabOpened.name,parentName:window.name}),s["default"].sendMessage(window.newlyTabOpened,n)}catch(r){throw new Error(d["default"].INVALID_JSON)}},c._onCustomMessage=function(e){var t=e.split(f["default"].CUSTOM)[1];try{t=JSON.parse(t)}catch(n){throw new Error(d["default"].INVALID_JSON)}var a=new CustomEvent("toggleElementDisabledAttribute",{detail:t});window.dispatchEvent(a),window.newlyTabOpened=null},c._onBeforeUnload=function(e){var t=void 0,n=e.split(f["default"].ON_BEFORE_UNLOAD)[1];try{n=JSON.parse(n)}catch(a){throw new Error(d["default"].INVALID_JSON)}s["default"].tabs.length&&(t=s["default"].getAll(),window.newlyTabOpened=i["default"].searchByKeyName(t,"id",n.id)||window.newlyTabOpened)},c.onNewTab=function(e){var t=e.data;return!!s["default"].tabs.length&&void(t.indexOf(f["default"].LOADED)>-1?c._onLoad(t):t.indexOf(f["default"].CUSTOM)>-1?c._onCustomMessage(t):t.indexOf(f["default"].ON_BEFORE_UNLOAD)>-1&&c._onBeforeUnload(t))},t["default"]=c,e.exports=t["default"]},function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),s=n(4),u=a(s),d=n(7),l=a(d),f=function(){function e(t){r(this,e),this.sessionStorageKey="__vwo_new_tab_info__",t||(t={}),"undefined"==typeof t.handshakeExpiryLimit&&(t.handshakeExpiryLimit=5e3),"undefined"==typeof t.shouldInitImmediately&&(t.shouldInitImmediately=!0),this.tabName=window.name,this.tabId=null,this.tabParentName=null,i(this,t),this.config=t,this.shouldInitImmediately&&this.init()}return o(e,[{key:"_isSessionStorage",value:function(){return!!("sessionStorage"in window&&window.sessionStorage)}},{key:"_getData",value:function(){return!!this.isSessionStorageSupported&&window.sessionStorage.getItem(this.sessionStorageKey)}},{key:"_setData",value:function(e){return!!this.isSessionStorageSupported&&(window.sessionStorage.setItem(this.sessionStorageKey,e),e)}},{key:"_restoreData",value:function(){if(!this.isSessionStorageSupported)return!1;if(this.isSessionStorageSupported){var e=this._getData();this._parseData(e)}}},{key:"_parseData",value:function(e){var t=void 0;try{t=JSON.parse(e),this.tabId=t&&t.id,this.tabParentName=t&&t.parentName}catch(n){throw new Error(l["default"].INVALID_DATA)}}},{key:"onCommunication",value:function(e){var t=this,n=void 0,a=e.data;if(window.clearTimeout(this.timeout),a.indexOf(u["default"].PARENT_DISCONNECTED)>-1&&(this.config.onParentDisconnect&&this.config.onParentDisconnect(),window.removeEventListener("message",function(e){return t.onCommunication(e)})),a.indexOf(u["default"].HANDSHAKE_WITH_PARENT)>-1){var r=void 0;n=a.split(u["default"].HANDSHAKE_WITH_PARENT)[1],this._setData(n),this._parseData(n),r=u["default"].CUSTOM+JSON.stringify({id:this.tabId}),this.sendMessageToParent(r),this.config.onInitialize&&this.config.onInitialize()}if(a.indexOf(u["default"].PARENT_COMMUNICATED)>-1){n=a.split(u["default"].PARENT_COMMUNICATED)[1];try{n=JSON.parse(n)}catch(i){throw new Error(l["default"].INVALID_JSON)}this.config.onParentCommunication&&this.config.onParentCommunication(n)}}},{key:"addListeners",value:function(){var e=this;window.onbeforeunload=function(t){var n=u["default"].ON_BEFORE_UNLOAD+JSON.stringify({id:e.tabId});e.sendMessageToParent(n)},window.removeEventListener("message",function(t){return e.onCommunication(t)}),window.addEventListener("message",function(t){return e.onCommunication(t)})}},{key:"setHandshakeExpiry",value:function(){var e=this;return window.setTimeout(function(){e.config.onHandShakeExpiry&&e.config.onHandShakeExpiry()},this.handshakeExpiryLimit)}},{key:"sendMessageToParent",value:function(e){window.top.opener&&window.top.opener.postMessage(e,"*")}},{key:"getTabInfo",value:function(){return{id:this.tabId,name:this.tabName,parentName:this.tabParentName}}},{key:"init",value:function(){this.config.onReady&&this.config.onReady(),this.isSessionStorageSupported=this._isSessionStorage(),this.addListeners(),this._restoreData(),this.sendMessageToParent(u["default"].LOADED+JSON.stringify(this.getTabInfo())),this.timeout=this.setHandshakeExpiry()}}]),e}();t["default"]=f,e.exports=t["default"]}])});
//# sourceMappingURL=across-tabs.min.js.map