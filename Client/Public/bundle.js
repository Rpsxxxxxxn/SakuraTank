/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./Src/Bullet.js":
/*!***********************!*\
  !*** ./Src/Bullet.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Bullet\": () => (/* binding */ Bullet)\n/* harmony export */ });\nclass Bullet {\n    constructor(id, type, x, y, radius) {\n        this.id = id;\n        this.type = type;\n        this.x = x;\n        this.y = y;\n        this.radius = radius;\n    }\n\n    Update(engine) {\n\n    }\n\n    Draw(engine) {\n        const ctx = engine.ctx;\n        \n        ctx.save();\n        ctx.beginPath();\n        ctx.fillStyle = \"#aaaaaa\"\n        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);\n        ctx.fill();\n        ctx.closePath();\n        ctx.restore();\n    }\n}\n\n//# sourceURL=webpack://server/./Src/Bullet.js?");

/***/ }),

/***/ "./Src/Engine.js":
/*!***********************!*\
  !*** ./Src/Engine.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Engine\": () => (/* binding */ Engine)\n/* harmony export */ });\n/* harmony import */ var _Bullet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bullet */ \"./Src/Bullet.js\");\n/* harmony import */ var _Key__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Key */ \"./Src/Key.js\");\n/* harmony import */ var _Mouse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Mouse */ \"./Src/Mouse.js\");\n/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Player */ \"./Src/Player.js\");\n/* harmony import */ var _Touch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Touch */ \"./Src/Touch.js\");\n/* harmony import */ var _Utility_Reader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Utility/Reader */ \"./Src/Utility/Reader.js\");\n/* harmony import */ var _Utility_Writer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Utility/Writer */ \"./Src/Utility/Writer.js\");\n\n\n\n\n\n\n\n\n\nclass Engine {\n    constructor() {\n        this.ws = null;\n        this.canvas = document.getElementById(\"canvas\");\n        this.ctx = this.canvas.getContext(\"2d\");\n        this.player = null;\n        this.players = [];\n        this.playerList = {};\n        this.bullets = [];\n        this.bulletList = {};\n        this.range = 1.0;\n        \n        this.roomSize = {\n            width: 0,\n            height: 0,\n        }\n\n        this.touch = new _Touch__WEBPACK_IMPORTED_MODULE_4__.Touch();\n        // if (!this.touch.isTouchStart) {\n        this.mouse = new _Mouse__WEBPACK_IMPORTED_MODULE_2__.Mouse();\n        this.key = new _Key__WEBPACK_IMPORTED_MODULE_1__.Key();\n        // }\n        this.debugText = document.getElementById(\"debugLogs\");\n\n        this.handler = {\n            0: this.PlayerInfo.bind(this),\n            1: this.UpdatePlayers.bind(this),\n            2: this.UpdateBullets.bind(this),\n            3: this.GameMyId.bind(this),\n            4: this.RoomSize.bind(this),\n            100: this.DebugServerInfo.bind(this),\n        }\n\n        this.frame = 0;\n        this.startTime = 0;\n        this.endTime = 0;\n\n        this.bulletStartTime = 0;\n        this.bulletEndTime = 0;\n\n    }\n\n    PlayerInfo(reader) {\n        const playerCount = reader.getUint8();\n        for (let i = 0; i < playerCount; i++) {\n            const player = new _Player__WEBPACK_IMPORTED_MODULE_3__.Player(0, \"\", \"\", 0, 0, 32, 0, 0);\n            player.id = reader.getUint32();\n            player.team = reader.getUint8();\n            player.name = reader.getString();\n            player.nx = reader.getFloat();\n            player.ny = reader.getFloat();\n            player.updateTime = this.GetUpdateTime();\n            this.players.push(player);\n            this.playerList[player.id] = player;\n        }\n        // console.log(\"PlayerInfo: %s\", this.players.length);\n    }\n\n    UpdatePlayers(reader) {\n        this.updateTime = Date.now();\n\n        const playerCount = reader.getUint8();\n        for (let i = 0; i < playerCount; i++) {\n            const playerId = reader.getUint32();\n            const player = this.playerList[playerId];\n            if (player) {\n                player.Update(this);\n                player.ox = player.nx;\n                player.oy = player.ny;\n                player.nx = reader.getFloat();\n                player.ny = reader.getFloat();\n                player.bulletAngle = reader.getFloat();\n                player.updateTime = Date.now();\n            }\n        }\n        this.EmitMoveAngle();\n        this.EmitBulletAngle();\n        // console.log(\"UpdatePlayers: %s\", this.players.length);\n    }\n\n    UpdateBullets(reader) {\n        const addViewCount = reader.getUint16();\n        for (let i = 0; i < addViewCount; i++) {\n            const bullet = new _Bullet__WEBPACK_IMPORTED_MODULE_0__.Bullet(0, 0, 0, 0);\n            bullet.id = reader.getUint32();\n            bullet.type = reader.getUint8();\n            bullet.x = reader.getFloat();\n            bullet.y = reader.getFloat();\n            bullet.radius = reader.getUint16();\n            this.bullets.push(bullet);\n            // this.bulletList[bullet.id] = bullet;\n        }\n        \n        const updateViewCount = reader.getUint16();\n        for (let i = 0; i < updateViewCount; i++) {\n            const bulletId = reader.getUint32();\n            // const bullet = this.bulletList[bulletId];\n            const bullet = this.bullets.find(element => element.id == bulletId);\n            if (bullet) {\n                bullet.id = bulletId;\n                bullet.type = reader.getUint8();\n                bullet.x = reader.getFloat();\n                bullet.y = reader.getFloat();\n                bullet.radius = reader.getUint16();\n            }\n            // this.bulletList[bulletId] = bullet;\n        }\n        \n        const deleteViewCount = reader.getUint16();\n        for (let i = 0; i < deleteViewCount; i++) {\n            const bulletId = reader.getUint32();\n            const bulletIndex = this.bullets.findIndex(element => element.id == bulletId);\n            this.bullets.splice(bulletIndex, 1);\n        }\n    }\n\n    GameMyId(reader) {\n        const id = reader.getUint32();\n        console.log(\"GameMyId: %s\", id);\n        this.player = this.players.find(element => element.id === id);\n        console.log(\"GetPlayerInfo: %s\", this.player ? \"YES\" : \"NO\");\n    }\n\n    DebugServerInfo(reader) {\n        this.Fps = reader.getUint8();\n        this.PlayerCount = reader.getUint8();\n        this.BulletCount = reader.getUint16();\n        this.GameStep = reader.getUint8();\n        // this.debugText.innerText = `ServerFPS: ${Fps} \\n PlayerCount: ${PlayerCount} \\n GameStep: ${GameStep}`;\n    }\n\n    RoomSize(reader) {\n        this.roomSize.width = reader.getUint32();\n        this.roomSize.height = reader.getUint32();\n        console.log(\"RoomSize: %s, %s\", this.roomSize.width, this.roomSize.height);\n    }\n\n    MainLoop() {\n        // フレーム計測\n        this.frame++;\n        this.endTime = this.bulletEndTime = this.updateTime = Date.now();\n        // 一秒経過\n        if (this.endTime - this.startTime >= 1000) {\n            this.debugText.innerText = `ServerFPS: ${this.Fps} \\n PlayerCount: ${this.PlayerCount} \\n BulletCount: ${this.BulletCount} \\n GameStep: ${this.GameStep} \\n ClientFPS: ${this.frame}`\n            this.frame = 0;\n            this.startTime = Date.now();\n        }\n\n        // this.updateTime = Date.now();\n        this.canvas.width = window.innerWidth;\n        this.canvas.height = window.innerHeight;\n        this.key.Update();\n\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\n\n        this.ctx.save();\n\n        if (this.player) {\n\n            // 背景のラインを引く ↓↓↓ ここから ↓↓↓\n            this.ctx.strokeStyle = \"#000000\";\n            this.ctx.globalAlpha = .1;\n            this.ctx.scale(this.range, this.range);\n\n            const a = this.canvas.width;\n            const b = this.canvas.height;\n            for (let c = -.5 + (-this.player.x + a * .5) % 50; c < a; c += 50) {\n                this.ctx.moveTo(c, 0);\n                this.ctx.lineTo(c, b);\n            }\n            this.ctx.stroke();\n            this.ctx.beginPath();\n            for (let c = -.5 + (-this.player.y + a * .5) % 50; c < b; c += 50) {\n                this.ctx.moveTo(0, c);\n                this.ctx.lineTo(a, c);\n            }\n            this.ctx.stroke()\n            this.ctx.restore()\n            // ↑↑↑ ここまで ↑↑↑\n\n            // カメラの処理\n            this.ctx.translate(this.canvas.width * .5, this.canvas.height * .5);\n            this.ctx.scale(this.range, this.range);\n            this.ctx.translate(-this.player.x, -this.player.y);\n\n            // ルームの壁を描画\n            this.ctx.save();\n            this.ctx.lineWidth = 30;\n            this.ctx.strokeStyle = \"yellow\";\n            this.ctx.strokeRect(0, 0, this.roomSize.width, this.roomSize.height);\n            this.ctx.restore();\n\n            this.bullets.forEach((bullet) => {\n                bullet.Draw(this)\n            })\n\n            // プレイヤーの更新\n            this.players.forEach((player) => {\n                // player.Update(this);\n                player.Draw(this);\n            })\n\n            if (this.key.getKeyDown(32)) {\n                if ((this.bulletEndTime - this.bulletStartTime) >= 1000) {\n                    this.WsSend(new Uint8Array([4]))\n                    this.bulletStartTime = Date.now();\n                }\n            }\n        }\n\n        this.ctx.restore();\n\n        this.touch.Draw(this.ctx);\n\n        requestAnimationFrame(this.MainLoop.bind(this));\n    }\n\n    ConnectServer() {\n        // this.ws = new WebSocket(\"ws://192.168.0.120:2000\");\n        this.ws = new WebSocket(\"ws://localhost:2000\");\n        this.ws.binaryType = \"arraybuffer\";\n        this.ws.onopen = this.WsOpen.bind(this);\n        this.ws.onmessage = this.WsMessage.bind(this);\n        this.ws.onclose = this.WsClose.bind(this);\n        this.ws.onerror = this.WsError.bind(this);\n        console.log(\"ConnectTo: %s BinaryType: %s\", \"ws://192.168.0.120:2000\", this.ws.binaryType)\n    }\n    \n    WsSend(packet) {\n        if (!this.ws) {\n            return;\n        }\n        if (this.ws.readyState != 1){\n             return;\n        }\n        if (packet.build) {\n            this.ws.send(packet.build());\n        } else {\n            this.ws.send(packet.buffer);\n        }\n    }\n\n    WsOpen() {\n        console.log(\"socket open\");\n        this.WsSend(new Uint8Array([1]))\n    }\n\n    WsClose() {\n        console.log(\"socket close\");\n    }\n\n    WsError() {\n        console.log(\"socket error\");\n    }\n\n    WsMessage(msg) {\n        const reader = new _Utility_Reader__WEBPACK_IMPORTED_MODULE_5__.Reader(new DataView(msg.data), 0, true);\n        const type = reader.getUint8();\n        if (this.handler[type]) {\n            this.handler[type](reader);\n        }\n    }\n\n    EmitMoveAngle() {\n        let isPress = false;\n        let x = 0;\n        let y = 0;\n        if (this.key.getKeyDown(87)) {\n            isPress = true;\n            y -= 1;\n        }\n        if (this.key.getKeyDown(65)) {\n            isPress = true;\n            x -= 1;\n        }\n        if (this.key.getKeyDown(83)) {\n            isPress = true;\n            y += 1;\n        }\n        if (this.key.getKeyDown(68)) {\n            isPress = true;\n            x += 1;\n        }\n        if (isPress) {\n            const writer = new _Utility_Writer__WEBPACK_IMPORTED_MODULE_6__.Writer(true);\n            writer.setUint8(2);\n            writer.setFloat32(Math.atan2(y, x));\n            this.WsSend(writer);\n        }\n    }\n\n    EmitBulletAngle() {\n        const x = this.mouse.x - (this.canvas.width / 2);\n        const y = this.mouse.y - (this.canvas.height / 2);\n        \n        const writer = new _Utility_Writer__WEBPACK_IMPORTED_MODULE_6__.Writer(true);\n        writer.setUint8(3);\n        writer.setFloat32(Math.atan2(y, x));\n        this.WsSend(writer);\n    }\n\n    GetUpdateTime() {\n        return this.updateTime;\n    }\n}\n\n//# sourceURL=webpack://server/./Src/Engine.js?");

/***/ }),

/***/ "./Src/Key.js":
/*!********************!*\
  !*** ./Src/Key.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Key\": () => (/* binding */ Key)\n/* harmony export */ });\nclass Key {\n    constructor() {\n        this.oldkey = new Array(256);\n        this.newkey = new Array(256);\n\n        const self = this;\n        document.onkeydown = function(e){\n            self.KeyDown(e)\n        };\n        document.onkeyup = function(e) {\n            self.KeyUp(e)\n        };\n    }\n\n    Update() {\n        for (let i = 0; i < 256; i++) {\n            this.oldkey[i] = this.newkey[i];\n        }\n    }\n\n    /**\n     * キーの押し込み\n     * @param {*} event \n     */\n    KeyDown(event) {\n        for (let i = 0; i < 256; i++) {\n            if (event.keyCode == i) {\n                this.newkey[i] = true;\n            }\n        }\n    }\n\n    /**\n     * キーの押上\n     * @param {*} event \n     */\n    KeyUp(event) {\n        for (let i = 0; i < 256; i++) {\n            if (event.keyCode == i) {\n                this.newkey[i] = false;\n            }\n        }\n    }\n\n    /**\n     * キーの取得\n     * @param {*} keyCode \n     */\n    getKeyDown(keyCode) {\n        return this.newkey[keyCode];\n    }\n\n    /**\n     * キーの取得\n     * @param {*} keyCode \n     */\n    getKeyUp(keyCode) {\n        return !this.newkey[keyCode] && this.oldkey[keyCode];\n    }\n\n    /**\n     * キーの取得\n     * @param {*} keyCode \n     */\n    getKeyPressed(keyCode) {\n        return this.newkey[keyCode] && !this.oldkey[keyCode];\n    }\n}\n\n//# sourceURL=webpack://server/./Src/Key.js?");

/***/ }),

/***/ "./Src/Mouse.js":
/*!**********************!*\
  !*** ./Src/Mouse.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Mouse\": () => (/* binding */ Mouse)\n/* harmony export */ });\nclass Mouse {\n    constructor() {\n        this.x = 0;\n        this.y = 0;\n\n        const self = this;\n        document.onmousedown = function(e){\n            self.MouseDown(e)\n        };\n        document.onmousemove = function(e) {\n            self.MouseMove(e)\n        };\n        document.onmousedown = function(e) {\n            self.MouseDown(e)\n        };\n    }\n\n    MouseDown(e) {\n\n    }\n\n    MouseMove(e) {\n        this.x = e.clientX;\n        this.y = e.clientY;\n        // this.position.set(e.clientX, e.clientY);\n    }\n\n    MouseDown(e) {\n\n    }\n}\n\n//# sourceURL=webpack://server/./Src/Mouse.js?");

/***/ }),

/***/ "./Src/Player.js":
/*!***********************!*\
  !*** ./Src/Player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Player\": () => (/* binding */ Player)\n/* harmony export */ });\nclass Player {\n    constructor(id, team, name, x, y, radius, updateTime) {\n        this.id = id;\n        this.team = team;\n        this.name = name;\n        this.x = this.nx = this.ox = x;\n        this.y = this.ny = this.oy = y;\n        this.radius = radius;\n        this.bulletAngle = 0;\n        this.updateTime = updateTime;\n    }\n\n    Update(engine) {\n        const time = (engine.GetUpdateTime() - this.updateTime);\n        const dt = Math.min(1, (Math.max(time / 120, 0)));\n        // console.log(\"Player: %s\", dt)\n        this.x = this.Lerp(this.nx, this.ox, dt);\n        this.y = this.Lerp(this.ny, this.oy, dt);\n    }\n\n    Draw(engine) {\n        const ctx = engine.ctx;\n        \n        // プレイヤーの描画\n        ctx.save();\n        ctx.beginPath();\n        ctx.fillStyle = \"#00ffff\"\n        ctx.strokeStyle = \"#6677ff\"\n        ctx.lineWidth = 5;\n        ctx.globalAlpha = 1;\n        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);\n        ctx.fill();\n        ctx.stroke();\n        ctx.closePath();\n        ctx.restore();\n\n        // バレット部分の描画\n        ctx.save();\n        ctx.beginPath();\n        ctx.fillStyle = \"#00ff00\"\n        ctx.strokeStyle = \"#6677ff\"\n        ctx.globalAlpha = 1;\n\n        const bulletX = this.x + Math.cos(this.bulletAngle) * this.radius;\n        const bulletY = this.y + Math.sin(this.bulletAngle) * this.radius;\n        ctx.arc(bulletX, bulletY, this.radius * .5, 0, Math.PI * 2, false);\n        ctx.fill();\n        ctx.stroke();\n        ctx.closePath();\n\n        // ↓↓↓ 四角での描画処理 ↓↓↓\n        // ctx.translate(\n        //     this.x + Math.sin(this.bulletAngle) * this.radius,\n        //     this.y + Math.cos(this.bulletAngle) * this.radius);\n        // ctx.rotate(this.bulletAngle);\n        // ctx.translate(\n        //     -(this.x + Math.sin(this.bulletAngle) * this.radius),\n        //     -(this.y + Math.cos(this.bulletAngle) * this.radius));\n\n        // const bulletX = this.x + Math.sin(this.bulletAngle) * this.radius;\n        // const bulletY = this.y + Math.cos(this.bulletAngle) * this.radius;\n        // ctx.fillRect(bulletX - 20, bulletY - 20, 40, 40);\n        // ctx.fillRect(this.x - 20, this.y - 20, 40, 40);\n        // ↑↑↑ 四角での描画処理 ↑↑↑\n\n        ctx.restore();\n    }\n\n    Lerp(a, b, dt) {\n        return dt * (a - b) + b;\n    }\n}\n\n//# sourceURL=webpack://server/./Src/Player.js?");

/***/ }),

/***/ "./Src/Touch.js":
/*!**********************!*\
  !*** ./Src/Touch.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Touch\": () => (/* binding */ Touch)\n/* harmony export */ });\nclass Touch {\n    constructor() {\n        this.touchable = 'createTouch' in document;\n        this.isTouchStart = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || this.touchable;\n\n        const self = this;\n        document.ontouchstart = function(e){\n            self.TouchStart(e)\n        };\n        document.ontouchmove = function(e) {\n            self.TouchMove(e)\n        };\n        document.ontouchend = function(e) {\n            self.TouchEnd(e)\n        };\n\n        // $('#overlays2').on('touchstart', (e) => this.touchStart(e));\n        // $('#overlays2').on('touchmove', (e) => this.touchMove(e));\n        // $('#overlays2').on('touchend', (e) => this.touchEnd(e));\n\n        this.touchButton = {\n            Menu: {\n                touchPosition: {\n                    x: 50,\n                    y: 50\n                },\n                touchSize: 50,\n                image: new Image(),\n                imageSrc: 'assets/img/menu.png',\n                action: function() {\n    \n                }.bind(this)\n            },\n            Chat: {\n                touchPosition: {\n                    x: 150,\n                    y: 50\n                },\n                touchSize: 50,\n                image: new Image(),\n                imageSrc: 'assets/img/chat.png',\n                action: function() {\n    \n                }.bind(this)\n            },\n            ZoomIn: {\n                touchPosition: {\n                    x: window.innerWidth - 50,\n                    y: 50\n                },\n                touchSize: 50,\n                image: new Image(),\n                imageSrc: 'assets/img/menu.png',\n                action: function() {\n    \n                }.bind(this)\n            },\n            ZoomOut: {\n                touchPosition: {\n                    x: window.innerWidth - 150,\n                    y: 50\n                },\n                touchSize: 50,\n                image: new Image(),\n                imageSrc: 'assets/img/chat.png',\n                action: function() {\n    \n                }.bind(this)\n            },\n            Setting: {\n                touchPosition: {\n                    x: window.innerWidth - 250,\n                    y: 50\n                },\n                touchSize: 50,\n                image: new Image(),\n                imageSrc: 'assets/img/minimap.png',\n                action: function() {\n    \n                }.bind(this)\n            },\n        }\n        \n        this.touchJoypad = {\n            startPosition: {\n                x: 0,\n                y: 0\n            },\n            padPosition: {\n                x: 0,\n                y: 0\n            },\n            touchSize: 50,\n            action: function() {\n\n            }.bind(this)\n        }\n    }\n    \n    TouchStart(e) {\n        e.preventDefault();\n        for (var i = 0; i < e.originalEvent.changedTouches.length; i++) {\n        }\n    }\n\n    TouchMove(e) {\n\n    }\n\n    TouchEnd(e) {\n\n    }\n\n    Draw(ctx) {\n        if (this.isTouchStart) {\n            for (let key in this.touchButton) {\n                const pos = this.touchButton[key].touchPosition;\n                const size = this.touchButton[key].touchSize;\n                \n                ctx.save();\n                ctx.beginPath();\n                ctx.fillStyle = \"#aaaaaa\"\n                ctx.globalAlpha = 0.8;\n                ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2, false);\n                ctx.fill();\n                ctx.closePath();\n                ctx.restore();\n            }\n        }\n    }\n\n    DetectionTouch(x, y) {\n        for (let key in this.touchConfig) {\n            const pos = this.touchConfig[key].touchPosition;\n            const size = this.touchConfig[key].touchSize;\n            \n            if (this.BoxCollision(x, y, pos.x, pos.y, size)) {\n\n            }\n        }\n    }\n\n    BoxCollision(x1, y1, x2, y2, size) {\n        return (\n            x1 > x2 - size &&\n            y1 > y2 - size &&\n            x1 < x2 + size &&\n            y1 < y2 + size)\n    }\n}\n\n//# sourceURL=webpack://server/./Src/Touch.js?");

/***/ }),

/***/ "./Src/Utility/Reader.js":
/*!*******************************!*\
  !*** ./Src/Utility/Reader.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Reader\": () => (/* binding */ Reader)\n/* harmony export */ });\nclass Reader {\n\tconstructor(view, offset, littleEndian) {\n\t\tthis.view = view;\n\t\tthis.offset = offset || 0;\n\t\tthis.endian = littleEndian;\n\t}\n\n\tgetUint8() {\n\t\treturn this.view.getUint8(this.offset++, this.endian);\n\t}\n\n\tgetInt8() {\n\t\treturn this.view.getInt8(this.offset++, this.endian);\n\t}\n\n\tgetUint16() {\n\t\tlet result = this.view.getUint16(this.offset, this.endian);\n\t\tthis.skipBytes(2);\n\t\treturn result;\n\t}\n\n\tgetInt16() {\n\t\tlet result = this.view.getInt16(this.offset, this.endian);\n\t\tthis.skipBytes(2);\n\t\treturn result;\n\t}\n\n\tgetUint32() {\n\t\tlet result = this.view.getUint32(this.offset, this.endian);\n\t\tthis.skipBytes(4);\n\t\treturn result;\n\t}\n\n\tgetInt32() {\n\t\tlet result = this.view.getInt32(this.offset, this.endian);\n\t\tthis.skipBytes(4);\n\t\treturn result;\n\t}\n\n\tgetFloat() {\n\t\tlet result = this.view.getFloat32(this.offset, this.endian);\n\t\tthis.skipBytes(4);\n\t\treturn result;\n\t}\n\n\tgetDouble() {\n\t\tlet result = this.view.getFloat64(this.offset, this.endian);\n\t\tthis.skipBytes(8);\n\t\treturn result;\n\t}\n\n\tgetString() {\n\t\tlet text = \"\";\n\t\tlet count = this.getUint16();\n\t\tfor (let i = 0; i < count; i++) {\n\t\t\ttext += String.fromCharCode(this.getUint16());\n\t\t}\n        return text;\n\t}\n\n\tgetStringUTF8() {\n\t\tlet char, name = \"\";\n\t\twhile((char = this.getUint8()) != 0) name += String.fromCharCode(char);\n\t\treturn window.decodeURIComponent(window.escape(name));\n\t}\n\n\tskipBytes(length) {\n\t\tthis.offset += length;\n\t}\n}\n\n//# sourceURL=webpack://server/./Src/Utility/Reader.js?");

/***/ }),

/***/ "./Src/Utility/Writer.js":
/*!*******************************!*\
  !*** ./Src/Utility/Writer.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Writer\": () => (/* binding */ Writer)\n/* harmony export */ });\nclass Writer {\n    constructor(littleEndian) {\n        this.buffer = new DataView(new ArrayBuffer(8));\n        this.endian = littleEndian;\n        this.reset();\n    }\n\n    reset() {\n        this.view = [];\n        this.offset = 0;\n    }\n\n    setUint8(a) {\n        if (a >= 0 && a < 256) this.view.push(a);\n    }\n\n    setInt8(a) {\n        if (a >= -128 && a < 128) this.view.push(a);\n    }\n\n    setUint16(a) {\n        this.buffer.setUint16(0, a, this.endian);\n        this.skipBytes(2);\n    }\n\n    setInt16(a) {\n        this.buffer.setInt16(0, a, this.endian);\n        this.skipBytes(2);\n    }\n\n    setUint32(a) {\n        this.buffer.setUint32(0, a, this.endian);\n        this.skipBytes(4);\n    }\n\n    setInt32(a) {\n        this.buffer.setInt32(0, a, this.endian);\n        this.skipBytes(4);\n    }\n\n    setFloat32(a) {\n        this.buffer.setFloat32(0, a, this.endian);\n        this.skipBytes(4);\n    }\n\n    setFloat64(a) {\n        this.buffer.setFloat64(0, a, this.endian);\n        this.skipBytes(8);\n    }\n\n    skipBytes(a) {\n        for (let i = 0; i < a; i++) \n            this.view.push(this.buffer.getUint8(i));\n    }\n\n    setString(s) {\n        this.setUint16(s.length);\n\t\tfor (let i = 0; i < s.length; i++) {\n            this.setUint16(s.charCodeAt(i));\n        }\n    }\n\n\tsetStringUTF8(s) {\n            let bytesStr = window.unescape(window.encodeURIComponent(s));\n            for (let i = 0, l = bytesStr.length; i < l; i++) this.view.push(bytesStr.charCodeAt(i));\n            this.view.push(0);\n    }\n\n    build() {\n        return new Uint8Array(this.view);\n    }\n}\n\n//# sourceURL=webpack://server/./Src/Utility/Writer.js?");

/***/ }),

/***/ "./Src/index.js":
/*!**********************!*\
  !*** ./Src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Engine */ \"./Src/Engine.js\");\n\n\nconst engine = new _Engine__WEBPACK_IMPORTED_MODULE_0__.Engine();\nengine.ConnectServer();\nengine.MainLoop();\n\n//# sourceURL=webpack://server/./Src/index.js?");

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