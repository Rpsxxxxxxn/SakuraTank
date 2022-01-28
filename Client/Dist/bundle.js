/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./Src/Engine.js":
/*!***********************!*\
  !*** ./Src/Engine.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Engine\": () => (/* binding */ Engine)\n/* harmony export */ });\n/* harmony import */ var _Server_Src_Utility_Reader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Server/Src/Utility/Reader */ \"../Server/Src/Utility/Reader.js\");\n/* harmony import */ var _Server_Src_Utility_Reader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Server_Src_Utility_Reader__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Player */ \"./Src/Player.js\");\n/* harmony import */ var _Touch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Touch */ \"./Src/Touch.js\");\n\n\n\n\nclass Engine {\n    constructor() {\n        this.ws = null;\n        this.canvas = document.getElementById(\"canvas\");\n        this.ctx = this.canvas.getContext(\"2d\");\n        this.player = null;\n        this.players = [];\n        this.range = 1.0;   \n\n        this.touch = new _Touch__WEBPACK_IMPORTED_MODULE_2__.Touch();\n\n        this.hander = {\n            0: this.PlayerInfo.bind(this),\n        }\n    }\n\n    PlayerInfo() {\n        const playerCount = reader.setUint8();\n        for (let i = 0; i < playerCount; i++) {\n            const player = new _Player__WEBPACK_IMPORTED_MODULE_1__.Player(0, \"\", \"\", 0, 0, 32);\n            player.id = reader.setUint32();\n            player.team = reader.setUint8();\n            player.name = reader.setString();\n            player.x = reader.setFloat();\n            player.y = reader.setFloat();\n            this.players.push(player);\n        }\n    }\n\n    MainLoop() {\n        this.canvas.width = window.innerWidth;\n        this.canvas.height = window.innerHeight;\n\n        this.ctx.save();\n        this.ctx.strokeStyle = \"#000000\";\n        this.ctx.globalAlpha = .2;\n        this.ctx.scale(this.range, this.range);\n\n        var a = this.canvas.width / 1,\n            b = this.canvas.height / 1;\n        for (var c = -.5 + (-0 + a / 2) % 50; c < a; c += 50) {\n            this.ctx.moveTo(c, 0);\n            this.ctx.lineTo(c, b);\n        }\n        this.ctx.stroke();\n        this.ctx.beginPath();\n        for (c = -.5 + (-0 + b / 2) % 50; c < b; c += 50) {\n            this.ctx.moveTo(0, c);\n            this.ctx.lineTo(a, c);\n        }\n        this.ctx.stroke()\n        this.ctx.restore()\n\n        this.ctx.save();\n        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);\n        this.ctx.scale(this.range, this.range);\n        this.ctx.translate(-0, -0);\n\n        this.ctx.restore();\n\n        this.touch.Draw(this.ctx);\n\n        requestAnimationFrame(this.MainLoop.bind(this));\n    }\n\n    ConnectServer() {\n        this.ws = new WebSocket(\"ws://192.168.0.120:2000\");\n        this.ws.binaryType = \"arraybuffer\";\n        this.ws.onopen = this.wsOpen.bind(this);\n        this.ws.onmessage = this.wsMessage.bind(this);\n        this.ws.onclose = this.wsClose.bind(this);\n        this.ws.onerror = this.wsError.bind(this);\n    }\n    \n    WsSend(a) {\n        if (!this.ws) return;\n        if (this.ws.readyState != 1) return;\n        if (a.build) this.ws.send(a.build());\n        else this.ws.send(a.buffer);\n    }\n\n    WsOpen() {\n        console.log(\"socket open\");\n    }\n\n    WsClose() {\n        console.log(\"socket close\");\n    }\n\n    WsError() {\n        console.log(\"socket error\");\n    }\n\n    WsMessage(msg) {\n        const reader = new (_Server_Src_Utility_Reader__WEBPACK_IMPORTED_MODULE_0___default())(new DataView(msg.data), 0, true);\n        const type = reader.getUint8();\n        if (this.handler[type]) {\n            this.handler[type](reader);\n        }\n    }\n}\n\n//# sourceURL=webpack://server/./Src/Engine.js?");

/***/ }),

/***/ "./Src/Player.js":
/*!***********************!*\
  !*** ./Src/Player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Player\": () => (/* binding */ Player)\n/* harmony export */ });\nclass Player {\n    constructor(id, team, name, x, y, radius) {\n        this.id = id;\n        this.team = team;\n        this.name = name;\n        this.x = x;\n        this.y = y;\n        this.radius = radius;\n    }\n\n    Update(engine) {\n\n    }\n\n    Draw(engine) {\n\n    }\n}\n\n//# sourceURL=webpack://server/./Src/Player.js?");

/***/ }),

/***/ "./Src/Touch.js":
/*!**********************!*\
  !*** ./Src/Touch.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Touch\": () => (/* binding */ Touch)\n/* harmony export */ });\nclass Touch {\n    constructor() {\n        this.touchable = 'createTouch' in document;\n        this.isTouchStart = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || this.touchable;\n\n        document.ontouchstart = this.TouchStart.bind(this);\n        document.ontouchmove = this.TouchMove.bind(this);\n        document.ontouchend = this.TouchEnd.bind(this);\n\n        // $('#overlays2').on('touchstart', (e) => this.touchStart(e));\n        // $('#overlays2').on('touchmove', (e) => this.touchMove(e));\n        // $('#overlays2').on('touchend', (e) => this.touchEnd(e));\n\n        this.touchButton = {\n            Menu: {\n                touchPosition: {\n                    x: 50,\n                    y: 50\n                },\n                touchSize: 50,\n                image: new Image(),\n                imageSrc: 'assets/img/menu.png',\n                action: function() {\n    \n                }.bind(this)\n            },\n            Chat: {\n                touchPosition: {\n                    x: 150,\n                    y: 50\n                },\n                touchSize: 50,\n                image: new Image(),\n                imageSrc: 'assets/img/chat.png',\n                action: function() {\n    \n                }.bind(this)\n            },\n            ZoomIn: {\n                touchPosition: {\n                    x: window.innerWidth - 50,\n                    y: 50\n                },\n                touchSize: 50,\n                image: new Image(),\n                imageSrc: 'assets/img/menu.png',\n                action: function() {\n    \n                }.bind(this)\n            },\n            ZoomOut: {\n                touchPosition: {\n                    x: window.innerWidth - 150,\n                    y: 50\n                },\n                touchSize: 50,\n                image: new Image(),\n                imageSrc: 'assets/img/chat.png',\n                action: function() {\n    \n                }.bind(this)\n            },\n            Setting: {\n                touchPosition: {\n                    x: window.innerWidth - 250,\n                    y: 50\n                },\n                touchSize: 50,\n                image: new Image(),\n                imageSrc: 'assets/img/minimap.png',\n                action: function() {\n    \n                }.bind(this)\n            },\n        }\n        \n        this.touchJoypad = {\n            startPosition: {\n                x: 0,\n                y: 0\n            },\n            padPosition: {\n                x: 0,\n                y: 0\n            },\n            touchSize: 50,\n            action: function() {\n\n            }.bind(this)\n        }\n    }\n    \n    TouchStart(e) {\n        e.preventDefault();\n        for (var i = 0; i < e.originalEvent.changedTouches.length; i++) {\n        }\n    }\n\n    TouchMove(e) {\n\n    }\n\n    TouchEnd(e) {\n\n    }\n\n    Draw(ctx) {\n        if (this.isTouchStart) {\n            for (let key in this.touchButton) {\n                const pos = this.touchButton[key].touchPosition;\n                const size = this.touchButton[key].touchSize;\n                \n                ctx.save();\n                ctx.beginPath();\n                ctx.fillStyle = \"#aaaaaa\"\n                ctx.globalAlpha = 0.8;\n                ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2, false);\n                ctx.fill();\n                ctx.closePath();\n                ctx.restore();\n            }\n        }\n    }\n\n    DetectionTouch(x, y) {\n        for (let key in this.touchConfig) {\n            const pos = this.touchConfig[key].touchPosition;\n            const size = this.touchConfig[key].touchSize;\n            \n            if (this.BoxCollision(x, y, pos.x, pos.y, size)) {\n\n            }\n        }\n    }\n\n    BoxCollision(x1, y1, x2, y2, size) {\n        return (\n            x1 > x2 - size &&\n            y1 > y2 - size &&\n            x1 < x2 + size &&\n            y1 < y2 + size)\n    }\n}\n\n//# sourceURL=webpack://server/./Src/Touch.js?");

/***/ }),

/***/ "./Src/index.js":
/*!**********************!*\
  !*** ./Src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Engine */ \"./Src/Engine.js\");\n\n\nconst engine = new _Engine__WEBPACK_IMPORTED_MODULE_0__.Engine();\nengine.MainLoop();\n\n//# sourceURL=webpack://server/./Src/index.js?");

/***/ }),

/***/ "../Server/Src/Utility/Reader.js":
/*!***************************************!*\
  !*** ../Server/Src/Utility/Reader.js ***!
  \***************************************/
/***/ ((module) => {

eval("class Reader {\r\n    /**\r\n     * バイナリ配列の読み取り\r\n     * @param {*} message バイナリ配列\r\n     */\r\n    constructor(message) {\r\n        this.offset = 0;\r\n        this.buffer = message;\r\n    }\r\n\r\n    getUint8() {\r\n        const value = this.buffer.readUInt8(this.offset);\r\n        this.skipByte(1);\r\n        return value;\r\n    }\r\n\r\n    getUint16() {\r\n        const value = this.buffer.readUInt16LE(this.offset);\r\n        this.skipByte(2);\r\n        return value;\r\n    }\r\n\r\n    getUint24() {\r\n        const value = this.buffer.readUIntLE(this.offset);\r\n        this.skipByte(3);\r\n        return value;\r\n    }\r\n\r\n    getUint32() {\r\n        const value = this.buffer.readUInt32LE(this.offset);\r\n        this.skipByte(4);\r\n        return value;\r\n    }\r\n\r\n    getInt8() {\r\n        const value = this.buffer.readInt8(this.offset);\r\n        this.skipByte(1);\r\n        return value;\r\n    }\r\n    \r\n    getInt16() {\r\n        const value = this.buffer.readInt16LE(this.offset);\r\n        this.skipByte(2);\r\n        return value;\r\n    }\r\n    \r\n    getInt24() {\r\n        const value = this.buffer.readIntLE(this.offset);\r\n        this.skipByte(3);\r\n        return value;\r\n    }\r\n    \r\n    getInt32() {\r\n        const value = this.buffer.readInt32LE(this.offset);\r\n        this.skipByte(4);\r\n        return value;\r\n    }\r\n    \r\n    getFloat() {\r\n        const value = this.buffer.readFloatLE(this.offset);\r\n        this.skipByte(4);\r\n        return value;\r\n    }\r\n    \r\n    getDouble() {\r\n        const value = this.buffer.readDoubleLE(this.offset);\r\n        this.skipByte(8);\r\n        return value;\r\n    }\r\n\r\n    getString() {\r\n        let value = \"\";\r\n        const length = this.getUint16();\r\n        for (let i = 0; i < length; i++) {\r\n            value += String.fromCharCode(this.getUint16());\r\n        }\r\n        return value;\r\n    }\r\n\r\n    skipByte(value) {\r\n        this.offset += value;\r\n    }\r\n}\r\n\r\nmodule.exports = Reader;\n\n//# sourceURL=webpack://server/../Server/Src/Utility/Reader.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./Src/index.js");
/******/ 	
/******/ })()
;