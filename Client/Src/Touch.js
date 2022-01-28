export class Touch {
    constructor() {
        this.touchable = 'createTouch' in document;
        this.isTouchStart = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || this.touchable;

        const self = this;
        document.ontouchstart = function(e){
            self.TouchStart(e)
        };
        document.ontouchmove = function(e) {
            self.TouchMove(e)
        };
        document.ontouchend = function(e) {
            self.TouchEnd(e)
        };

        this.touchButton = {
            Menu: {
                touchPosition: {
                    x: 50,
                    y: 50
                },
                touchSize: 50,
                image: new Image(),
                imageSrc: 'assets/img/menu.png',
                action: function() {
    
                }.bind(this)
            },
            Chat: {
                touchPosition: {
                    x: 150,
                    y: 50
                },
                touchSize: 50,
                image: new Image(),
                imageSrc: 'assets/img/chat.png',
                action: function() {
    
                }.bind(this)
            },
            ZoomIn: {
                touchPosition: {
                    x: window.innerWidth - 50,
                    y: 50
                },
                touchSize: 50,
                image: new Image(),
                imageSrc: 'assets/img/menu.png',
                action: function() {
    
                }.bind(this)
            },
            ZoomOut: {
                touchPosition: {
                    x: window.innerWidth - 150,
                    y: 50
                },
                touchSize: 50,
                image: new Image(),
                imageSrc: 'assets/img/chat.png',
                action: function() {
    
                }.bind(this)
            },
            Setting: {
                touchPosition: {
                    x: window.innerWidth - 250,
                    y: 50
                },
                touchSize: 50,
                image: new Image(),
                imageSrc: 'assets/img/minimap.png',
                action: function() {
    
                }.bind(this)
            },
        }
        
        this.touchJoypad = {
            startPosition: {
                x: 0,
                y: 0
            },
            padPosition: {
                x: 0,
                y: 0
            },
            touchSize: 50,
            action: function() {

            }.bind(this)
        }
    }
    
    TouchStart(e) {
        e.preventDefault();
        for (var i = 0; i < e.originalEvent.changedTouches.length; i++) {
        }
    }

    TouchMove(e) {

    }

    TouchEnd(e) {

    }

    Draw(ctx) {
        if (this.isTouchStart) {
            for (let key in this.touchButton) {
                const pos = this.touchButton[key].touchPosition;
                const size = this.touchButton[key].touchSize;
                
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = "#aaaaaa"
                ctx.globalAlpha = 0.8;
                ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }
        }
    }

    DetectionTouch(x, y) {
        for (let key in this.touchConfig) {
            const pos = this.touchConfig[key].touchPosition;
            const size = this.touchConfig[key].touchSize;
            
            if (this.BoxCollision(x, y, pos.x, pos.y, size)) {

            }
        }
    }

    BoxCollision(x1, y1, x2, y2, size) {
        return (
            x1 > x2 - size &&
            y1 > y2 - size &&
            x1 < x2 + size &&
            y1 < y2 + size)
    }
}