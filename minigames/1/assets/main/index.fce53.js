window.__require=function t(e,i,n){function o(c,a){if(!i[c]){if(!e[c]){var h=c.split("/");if(h=h[h.length-1],!e[h]){var r="function"==typeof __require&&__require;if(!a&&r)return r(h,!0);if(s)return s(h,!0);throw new Error("Cannot find module '"+c+"'")}c=h}var u=i[c]={exports:{}};e[c][0].call(u.exports,function(t){return o(e[c][1][t]||t)},u,u.exports,t,e,i,n)}return i[c].exports}for(var s="function"==typeof __require&&__require,c=0;c<n.length;c++)o(n[c]);return o}({Game:[function(t,e){"use strict";cc._RF.push(e,"327e8GyhTpLuqpdLAR1nWOT","Game"),cc.Class({extends:cc.Component,properties:{starPrefab:{default:null,type:cc.Prefab},maxStarDuration:0,minStarDuration:0,numberOfStars:0,ground:{default:null,type:cc.Node},player:{default:null,type:cc.Node},scoreDisplay:{default:null,type:cc.Label},scoreAudio:{default:null,type:cc.AudioClip}},spawnNewStar:function(){var t=cc.instantiate(this.starPrefab);this.node.addChild(t),t.setPosition(this.getNewStarPosition()),t.getComponent("Star").game=this,t.getComponent("Star").starDuration=this.minStarDuration+Math.random()*(this.maxStarDuration-this.minStarDuration),t.getComponent("Star").timer=0},getNewStarPosition:function(){var t,e=this.groundY+Math.random()*this.player.getComponent("Player").jumpHeight+50,i=this.node.width/2;return t=2*(Math.random()-.5)*i,cc.v2(t,e)},gainScore:function(){++this.score,this.scoreDisplay.string="Score: "+this.score,cc.audioEngine.playEffect(this.scoreAudio,!1)},gameOver:function(){this.player.stopAllActions(),cc.director.loadScene("game")},onLoad:function(){this.groundY=this.ground.y+this.ground.height/2,this.spawnNewStar(),this.numberOfStars=1,this.score=0,this.player.getComponent("Player").game=this,this.node.on(cc.Node.EventType.MOUSE_DOWN,function(t){this.player.getComponent("Player").onMouseDown(t)},this),this.node.on(cc.Node.EventType.MOUSE_MOVE,function(t){this.player.getComponent("Player").onMouseMove(t)},this),this.node.on(cc.Node.EventType.MOUSE_UP,function(t){this.player.getComponent("Player").onMouseUp(t)},this),this.node.on(cc.Node.EventType.TOUCH_START,function(t){this.player.getComponent("Player").onTouchStart(t)},this),this.node.on(cc.Node.EventType.TOUCH_MOVE,function(t){this.player.getComponent("Player").onTouchMove(t)},this),this.node.on(cc.Node.EventType.TOUCH_END,function(t){this.player.getComponent("Player").onTouchEnd(t)},this)},onDestroy:function(){this.node.off(cc.Node.EventType.MOUSE_DOWN,function(t){this.player.getComponent("Player").onMouseDown(t)},this),this.node.off(cc.Node.EventType.MOUSE_MOVE,function(t){this.player.getComponent("Player").onMouseMove(t)},this),this.node.off(cc.Node.EventType.MOUSE_UP,function(t){this.player.getComponent("Player").onMouseUp(t)},this),this.node.off(cc.Node.EventType.TOUCH_START,function(t){this.player.getComponent("Player").onTouchStart(t)},this),this.node.off(cc.Node.EventType.TOUCH_MOVE,function(t){this.player.getComponent("Player").onTouchMove(t)},this),this.node.off(cc.Node.EventType.TOUCH_END,function(t){this.player.getComponent("Player").onTouchEnd(t)},this)}}),cc._RF.pop()},{}],Player:[function(t,e){"use strict";cc._RF.push(e,"4bb88thwU5E6bXlybJniQK8","Player"),cc.Class({extends:cc.Component,properties:{jumpHeight:0,jumpDuration:0,maxMoveSpeed:0,accel:0,jumpAudio:{default:null,type:cc.AudioClip}},runJumpAction:function(){var t=cc.tween().by(this.jumpDuration,{y:this.jumpHeight},{easing:"sineOut"}),e=cc.tween().by(this.jumpDuration,{y:-this.jumpHeight},{easing:"sineIn"}),i=cc.tween().sequence(t,e).call(this.playJumpSound,this);return cc.tween().repeatForever(i)},playJumpSound:function(){cc.audioEngine.playEffect(this.jumpAudio,!1)},onKeyDown:function(t){switch(t.keyCode){case cc.macro.KEY.a:this.accLeft=!0;break;case cc.macro.KEY.d:this.accRight=!0;break;case cc.macro.KEY.space:this.rotate=!0}},onKeyUp:function(t){switch(t.keyCode){case cc.macro.KEY.a:this.accLeft=!1;break;case cc.macro.KEY.d:this.accRight=!1;break;case cc.macro.KEY.space:this.rotate=!1}},onMouseDown:function(t){this.isMouseDown=!0,t._x<this.game.node.width/2?(this.accLeft=!0,this.accRight=!1):(this.accLeft=!1,this.accRight=!0)},onMouseMove:function(t){this.isMouseDown&&(t._x<this.game.node.width/2?(this.accLeft=!0,this.accRight=!1):(this.accLeft=!1,this.accRight=!0))},onMouseUp:function(){this.isMouseDown=!1,this.accRight=!1,this.accLeft=!1},onTouchStart:function(t){this.isFingerDown=!0,t._x<this.game.node.width/2?(this.accLeft=!0,this.accRight=!1):(this.accLeft=!1,this.accRight=!0)},onTouchMove:function(t){this.isFingerDown&&(t._x<this.game.node.width/2?(this.accLeft=!0,this.accRight=!1):(this.accLeft=!1,this.accRight=!0))},onTouchEnd:function(){this.isFingerDown=!1,this.accRight=!1,this.accLeft=!1},onLoad:function(){var t=this.runJumpAction();cc.tween(this.node).then(t).start(),this.accLeft=!1,this.accRight=!1,this.xSpeed=0,this.rotate=!1,this.isRotating=!1,this.isMouseDown=!1,this.isFingerDown=!1},update:function(t){this.accLeft?this.xSpeed-=this.accel*t:this.accRight&&(this.xSpeed+=this.accel*t),Math.abs(this.xSpeed)>this.maxMoveSpeed&&(this.xSpeed=this.maxMoveSpeed*this.xSpeed/Math.abs(this.xSpeed)),this.rotate&&!this.isRotating&&(this.isRotating=!0),this.isRotating&&Math.abs(this.node.angle)<=360?this.node.angle+=(this.accLeft?this.accel:-this.accel)*t:(this.isRotating=!1,this.node.angle=0),this.node.x+=this.xSpeed*t;var e=this.game.node.width/2;this.node.x=Math.min(Math.max(this.node.x,-e),e)}}),cc._RF.pop()},{}],Star:[function(t,e){"use strict";cc._RF.push(e,"3d187zoB7dCxItbN6pBsYUf","Star"),cc.Class({extends:cc.Component,properties:{pickRadius:0,timerDisplay:{default:null,type:cc.Label}},getPlayerDistance:function(){var t=this.game.player.getPosition();return this.node.position.sub(t).mag()},onPicked:function(){if(0==--this.game.numberOfStars){this.game.numberOfStars=Math.floor(3*Math.random()+1);for(var t=0;t<this.game.numberOfStars;++t)this.game.spawnNewStar()}this.game.gainScore(),this.node.destroy()},update:function(t){if(this.getPlayerDistance()<this.pickRadius)this.onPicked();else{var e=1-this.game.timer/this.game.starDuration;this.node.opacity=50+Math.floor(205*e),this.timerDisplay.string=(this.starDuration-this.timer).toFixed(1),this.timer>this.starDuration?this.game.gameOver():this.timer+=t}}}),cc._RF.pop()},{}]},{},["Game","Player","Star"]);