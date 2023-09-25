window.__require=function t(e,o,n){function i(c,s){if(!o[c]){if(!e[c]){var a=c.split("/");if(a=a[a.length-1],!e[a]){var l="function"==typeof __require&&__require;if(!s&&l)return l(a,!0);if(r)return r(a,!0);throw new Error("Cannot find module '"+c+"'")}c=a}var h=o[c]={exports:{}};e[c][0].call(h.exports,function(t){return i(e[c][1][t]||t)},h,h.exports,t,e,o,n)}return o[c].exports}for(var r="function"==typeof __require&&__require,c=0;c<n.length;c++)i(n[c]);return i}({AllScreenRedirect:[function(t,e){"use strict";cc._RF.push(e,"47c33C2uDNBvazNxoaSeoiu","AllScreenRedirect");var o=i(t("GameEvent")),n=i(t("Redirect"));function i(t){return t&&t.__esModule?t:{default:t}}cc.Class({extends:cc.Component,properties:{touchesToRedirect:{default:4,type:cc.Integer},_currentTouches:{default:0,serializable:!1}},onLoad:function(){this._handleSubscription(!0)},start:function(){this.node.getComponent(n.default)._handleSubscription(!1)},_handleSubscription:function(t){var e=t?"on":"off";cc.systemEvent[e](o.default.PLAYER_AIM_STOP,this.onPlayerAimStop,this)},onPlayerAimStop:function(){++this._currentTouches+1===this.touchesToRedirect&&this.node.getComponent(n.default)._handleSubscription(!0)}}),cc._RF.pop()},{GameEvent:"GameEvent",Redirect:"Redirect"}],CharacterLevel:[function(t,e){"use strict";var o;cc._RF.push(e,"04784Vd04dADKCHZd/DzgWt","CharacterLevel"),(o=t("GameEvent"))&&o.__esModule,cc.Class({extends:cc.Component,properties:{defaultLevel:{get:function(){return this._level},set:function(t){this._level=t},type:cc.Integer},color:{get:function(){return this._color},set:function(t){this._color=t},type:cc.Color},_level:{default:10,serializable:!1,type:cc.Integer},_label:{default:null,type:cc.Label},_color:{default:cc.Color.WHITE}},onLoad:function(){try{this._init()}catch(t){return void cc.warn(t)}this._handleSubscription(!0)},setup:function(t){this.set(t.level),this._setColor(t.color)},get:function(){return this._level},set:function(t){if("number"==typeof t){this._level=t,this._label.string=this._level.toString();var e=this.node.scaleX,o=this.node.scaleY;cc.tween(this.node).to(.2,{scaleX:2*e,scaleY:2*o},{easing:"smooth"}).to(.2,{scaleX:e,scaleY:o},{easing:"smooth"}).start()}},_handleSubscription:function(){},_init:function(){if(this._label=this.node.getComponent(cc.Label)||this.node.getComponentInChildren(cc.Label),!this._label)throw"CharacterLevel component can't find label component";this._label.string=this._level.toString(),this.node.color=this._color},_setColor:function(t){this._color=t,this.node.color=this._color}}),cc._RF.pop()},{GameEvent:"GameEvent"}],Character:[function(t,e){"use strict";cc._RF.push(e,"83cb7LtKQdDfZ7XAmXzphUg","Character"),n(t("GameEvent"));var o=n(t("CharacterLevel"));function n(t){return t&&t.__esModule?t:{default:t}}cc.Class({extends:cc.Component,properties:{_skeleton:{default:null,type:sp.Skeleton},_level:{default:null,type:o.default}},onLoad:function(){try{this._init()}catch(t){cc.warn(t)}this._handleSubscription(!0)},setup:function(t){this._skeleton.skeletonData=t.characterSpine,this._skeleton.setAnimation(0,t.characterSpineAnimation,!1),this._skeleton.getCurrent(0).animationStart=.5*Math.random(),this._skeleton.addAnimation(0,t.characterSpineAnimation,!0),this.node.setPosition(t.characterPosition),this.node.setScale(t.characterScale),this._level.node.setScale(Math.abs(1.5/t.characterScale.x)),this._level.node.scaleX*=t.characterScale.x>0?1:-1,this._level.setup(t)},lose:function(){cc.tween(this._skeleton.node).to(.75,{scale:this._skeleton.node.scaleY-.15,angle:-60,opacity:0},{easing:"smooth"}).start()},_handleSubscription:function(){},_init:function(){if(this._skeleton=this.node.getComponent(sp.Skeleton)||this.node.getComponentInChildren(sp.Skeleton),!this._skeleton)throw"Character component can't find skeleton component within it's node";if(this._level=this.node.getComponent(o.default)||this.node.getComponentInChildren(o.default),!this._level)throw"Character component can't find character level component within it's node or it's child nodes"}}),cc._RF.pop()},{CharacterLevel:"CharacterLevel",GameEvent:"GameEvent"}],FailScreen:[function(t,e){"use strict";cc._RF.push(e,"7ec44m9dnxOQ5QPW0sVWxh7","FailScreen");var o=i(t("GameEvent")),n=i(t("Redirect"));function i(t){return t&&t.__esModule?t:{default:t}}cc.Class({extends:cc.Component,properties:{blackout:{default:null,type:cc.Node},defeat:{default:null,type:cc.Node},tryAgain:{default:null,type:cc.Node}},onLoad:function(){try{this._init()}catch(t){return void cc.warn(t)}this._handleSubscription(!0)},start:function(){this.node.getComponent(n.default)._handleSubscription(!1)},_handleSubscription:function(t){var e=t?"on":"off";cc.systemEvent[e](o.default.FIGHT_LOSE,this.onFightLose,this)},_init:function(){if(!this.blackout||!this.defeat||!this.tryAgain)throw"FailScreen lack of entities";this.blackout.opacity=this.defeat.scale=this.tryAgain.opacity=0},_toggle:function(t){var e=this,o=t?100:0,i=t?.4:0,r=t?255:0;cc.tween(this.blackout).to(.5,{opacity:o}).call(function(){cc.tween(e.defeat).parallel(cc.tween().to(.65,{scale:i},{easing:"smooth"}),cc.tween().to(7,{angle:5},{easing:"smooth"})).start(),cc.tween(e.tryAgain).to(1,{opacity:r}).start(),e.node.getComponent(n.default)._handleSubscription(!0)}).start()},onFightLose:function(){this._toggle(!0)}}),cc._RF.pop()},{GameEvent:"GameEvent",Redirect:"Redirect"}],Floor:[function(t,e){"use strict";cc._RF.push(e,"44e94ZcAWdNtLFSbOapHyZu","Floor");var o=i(t("Character")),n=i(t("GameEvent"));function i(t){return t&&t.__esModule?t:{default:t}}cc.Class({extends:cc.Component,properties:{characterPrefab:{default:null,type:cc.Prefab},_sprite:{default:null,type:cc.Sprite,serializable:!1},_character:{default:null,type:o.default,serializable:!1},_selectTween:{default:null,type:cc.Tween,serializable:!1},_baseScale:{default:1,serializable:!1}},onLoad:function(){try{this._init()}catch(t){return void cc.warn(t)}this._handleSubscription(!0)},setup:function(t){this._sprite.spriteFrame=t.floorSprite,this.node.setPosition(this.node.position.add(t.floorOffset));var e=cc.instantiate(this.characterPrefab);e.parent=this.node,this._character=e.getComponent(o.default),this._character.setup(t)},selectCharacter:function(){this._selectTween||(this._baseScale=this._character.node.scaleY,this._selectTween=cc.tween(this._character.node).repeatForever(cc.tween(this._character.node).to(.5,{scale:this._baseScale+.1},{easing:"smooth"}).to(.5,{scale:this._baseScale},{easing:"smooth"}).delay(.35)).start())},unselectCharacter:function(){this._selectTween&&(this._selectTween.stop(),this._selectTween=null,cc.tween(this._character.node).to(.25,{scale:this._baseScale}).start())},_handleSubscription:function(t){var e=t?"on":"off";cc.systemEvent[e](n.default.FIGHT_START,this.onFightStart,this),cc.systemEvent[e](n.default.FIGHT_RESULT,this.onFightResult,this)},_init:function(){if(this._sprite=this.node.getComponent(cc.Sprite),!this._sprite)throw"Floor component can't find sprite component within it's node"},onFightStart:function(t){t===this&&cc.tween(this._character.node).to(.5,{position:this._character.node.position.add(cc.v2(80,0))},{easing:"smooth"}).call().start()},onFightResult:function(t,e){t===this&&(e._level.get()>this._character._level.get()?(cc.systemEvent.emit(n.default.FIGHT_WIN,this._character),this._character.lose()):(cc.systemEvent.emit(n.default.FIGHT_LOSE),e.lose()))}}),cc._RF.pop()},{Character:"Character",GameEvent:"GameEvent"}],GameEvent:[function(t,e,o){"use strict";cc._RF.push(e,"16167R+IBxGiqn1qzhaFhSJ","GameEvent"),o.__esModule=!0,o.default=void 0;var n=cc.Enum({NONE:0,PLAYER_AIM:2,PLAYER_AIM_STOP:3,FIGHT_START:4,FIGHT_RESULT:5,FIGHT_WIN:6,FIGHT_LOSE:7,TOWER_UPDATE:8});o.default=n,e.exports=o.default,cc._RF.pop()},{}],HeroTower:[function(t,e){"use strict";cc._RF.push(e,"99c11nC+A1Ep5Bomxsy1f2F","HeroTower");var o=c(t("GameEvent")),n=c(t("Tower")),i=c(t("Floor")),r=c(t("Character"));function c(t){return t&&t.__esModule?t:{default:t}}cc.Class({extends:cc.Component,properties:{heroFloorNumber:{default:0,type:cc.Integer},touchGraphics:{default:null,type:cc.Graphics},fightSmoke:{default:null,type:cc.Node},_tower:{default:null,type:n.default,serializable:!1},_heroFloor:{default:null,type:i.default},_hero:{default:null,type:r.default},_isDrawing:{default:!1,serializable:!1},_lastPoint:{default:cc.Vec2.ZERO,serializable:!1},_lineLength:{default:40,serializable:!1},_gapLength:{default:25,serializable:!1},_currentLength:{default:0,serializable:!1},_startPosition:{default:cc.Vec2.ZERO,serializable:!1},_fightFloor:{default:null,type:i.default,serializable:!1}},start:function(){try{this._init()}catch(t){return void cc.warn(t)}this._handleSubscription(!0)},_handleSubscription:function(t){var e=t?"on":"off";this._handleInput(t),cc.systemEvent[e](o.default.FIGHT_START,this.onFightStart,this),cc.systemEvent[e](o.default.FIGHT_WIN,this.onFightWin,this),cc.systemEvent[e](o.default.FIGHT_LOSE,this.onFightLose,this)},_handleInput:function(t){var e=t?"on":"off";this._heroFloor.node[e](cc.Node.EventType.TOUCH_START,this.onTouchStart,this),this._heroFloor.node[e](cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this),this._heroFloor.node[e](cc.Node.EventType.TOUCH_END,this.onTouchEnd,this),this._heroFloor.node[e](cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this)},_init:function(){if(this._tower=this.node.getComponent(n.default),!this._tower)throw"HeroTower component can't find Tower component within it's node";if(this._heroFloor=this._tower.floorsInternal[this.heroFloorNumber],!this._heroFloor)throw"Error finding hero floor";if(this._hero=this._heroFloor.node.getComponentInChildren(r.default),!this._hero)throw"Error finding hero";if(!this.touchGraphics)throw"Error finding graphics";this._startPosition=this._hero.node.position},_updateLevel:function(t){var e=this,n=t.node.convertToWorldSpaceAR(t._level.node.position),i=this._hero.node.convertToNodeSpaceAR(n),r=t._level;r.node.parent=this._hero.node,r.node.scaleX*=-1,r.node.setPosition(i),cc.tween(t._level.node).to(.5,{position:this._hero._level.node.position},{easing:"smooth"}).call(function(){e._hero._level.set(e._hero._level.get()+r.get()),e._hero._level.node.scale*=1.1,e._tower.addFloor(),e._handleInput(!0),cc.systemEvent.emit(o.default.TOWER_UPDATE,e._fightFloor)}).to(.15,{opacity:0}).start()},onTouchStart:function(t){this._isDrawing=!0,this._currentLength=0;var e=t.getTouches()[0].getLocation(),n=this.touchGraphics.node.convertToNodeSpaceAR(e);cc.Vec2.copy(this._lastPoint,n),this.touchGraphics.moveTo(n.x,n.y),this.touchGraphics.stroke(),cc.systemEvent.emit(o.default.PLAYER_AIM,e)},onTouchMove:function(t){var e=t.getTouches()[0].getLocation(),n=this.touchGraphics.node.convertToNodeSpaceAR(e),i=n.sub(this._lastPoint);this._currentLength+=i.mag(),cc.Vec2.copy(this._lastPoint,n),this._currentLength>this._lineLength&&this._isDrawing?(this._isDrawing=!1,this._currentLength=0):this._currentLength>this._gapLength&&!this._isDrawing&&(this._isDrawing=!0,this._currentLength=0),this._isDrawing?(this.touchGraphics.lineTo(n.x,n.y),this.touchGraphics.stroke()):this.touchGraphics.moveTo(n.x,n.y),cc.systemEvent.emit(o.default.PLAYER_AIM,e)},onTouchEnd:function(){this.touchGraphics.clear(),this._isDrawing=!1,cc.systemEvent.emit(o.default.PLAYER_AIM_STOP)},onTouchCancel:function(){this.touchGraphics.clear(),this._isDrawing=!1,cc.systemEvent.emit(o.default.PLAYER_AIM_STOP)},onFightStart:function(t){var e=this;this._handleInput(!1),this._fightFloor=t;var n=t.node.position,i=t.node.parent.convertToWorldSpaceAR(n),r=this._heroFloor.node.convertToNodeSpaceAR(i).add(cc.v2(-50,35));cc.tween(this._hero.node).to(.5,{position:r},{easing:"smooth"}).delay(.25).call(function(){e.fightSmoke.parent=e._tower.node,e.fightSmoke.setPosition(r.add(cc.v2(50,50)))}).delay(1).call(function(){e.fightSmoke.setPosition(cc.v2(-1e4,-1e4)),cc.systemEvent.emit(o.default.FIGHT_RESULT,t,e._hero)}).start()},onFightWin:function(t){var e=this;cc.tween(this._hero.node).delay(.3).to(.75,{position:this._startPosition},{easing:"smooth"}).delay(.3).call(function(){e._updateLevel(t)}).start()},onFightLose:function(){this._handleSubscription(!1)}}),cc._RF.pop()},{Character:"Character",Floor:"Floor",GameEvent:"GameEvent",Tower:"Tower"}],Logo:[function(t,e){"use strict";cc._RF.push(e,"1dcc4tY8tNPSJ0WbzhpGCfq","Logo");var o,n=(o=t("GameEvent"))&&o.__esModule?o:{default:o};cc.Class({extends:cc.Component,properties:{},onLoad:function(){this._handleSubscription(!0)},_handleSubscription:function(t){var e=t?"on":"off";cc.systemEvent[e](n.default.FIGHT_LOSE,this.onFightLose,this)},onFightLose:function(){var t=this;cc.tween(this.node).to(.5,{opacity:0}).call(function(){t.node.active=!1}).start()}}),cc._RF.pop()},{GameEvent:"GameEvent"}],Redirect:[function(t,e){"use strict";cc._RF.push(e,"d2d10JqX4NG9qRxLNohweZi","Redirect"),cc.Class({extends:cc.Component,properties:{androidUrl:{default:""},iosUrl:{default:""}},onLoad:function(){this._handleSubscription(!0)},_handleSubscription:function(t){var e=t?"on":"off";this.node[e](cc.Node.EventType.TOUCH_END,this.onTouchEnd,this),this.node[e](cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this)},_redirect:function(){cc.sys.os===cc.sys.ANDROID?cc.sys.openURL(this.androidUrl):cc.sys.openURL(this.iosUrl)},onTouchEnd:function(){this._redirect()},onTouchCancel:function(){this._redirect()}}),cc._RF.pop()},{}],Tower:[function(t,e){"use strict";cc._RF.push(e,"1b8edM/vO5IRox/R/pQ3BIJ","Tower"),n(t("GameEvent"));var o=n(t("../scripts/Floor"));function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){var o="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(o)return(o=o.call(t)).next.bind(o);if(Array.isArray(t)||(o=r(t))||e&&t&&"number"==typeof t.length){o&&(t=o);var n=0;return function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function r(t,e){if(t){if("string"==typeof t)return c(t,e);var o=Object.prototype.toString.call(t).slice(8,-1);return"Object"===o&&t.constructor&&(o=t.constructor.name),"Map"===o||"Set"===o?Array.from(t):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?c(t,e):void 0}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var o=0,n=new Array(e);o<e;o++)n[o]=t[o];return n}var s=cc.Class({name:"FloorHelper",properties:{floorSprite:{default:null,type:cc.SpriteFrame},floorOffset:{default:cc.Vec2.ZERO},characterSpine:{default:null,type:sp.SkeletonData},characterSpineAnimation:{default:""},characterPosition:{default:cc.Vec2.ZERO},characterScale:{default:cc.Vec2.ONE},level:{default:10,type:cc.Integer},color:{default:cc.Color.WHITE}}});cc.Class({extends:cc.Component,properties:{isActive:{default:!0},floorPrefab:{default:null,type:cc.Prefab},floorSprite:{default:null,type:cc.SpriteFrame},floorOffset:{default:cc.Vec2.ZERO},floors:{default:[],type:[s]},floorsInternal:{type:[o.default],default:[],visible:!1},towerRect:{default:new cc.Rect,visible:!1},_towerHeight:{default:0,type:cc.Float,serializable:!1}},onLoad:function(){try{this._init()}catch(t){return void cc.warn(t)}this._handleSubscription(!0)},start:function(){this.floorsNodes=[];for(var t,e=i(this.floors);!(t=e()).done;){var n=t.value,r=cc.instantiate(this.floorPrefab);r.parent=this.node,r.y=this._towerHeight,this._towerHeight+=n.floorSprite.getRect().height;var c=r.getComponent(o.default);this.floorsInternal.push(c),c.setup(n)}var s=this.floors[0].floorSprite.getRect().width;this.towerRect.x=this.node.x-s/2,this.towerRect.y=this.node.y,this.towerRect.width=s,this.towerRect.height=this._towerHeight},addFloor:function(){var t=this,e=cc.instantiate(this.floorPrefab);e.parent=this.node,e.y=this.floorsInternal[this.floorsInternal.length-1].node.y-this.floorSprite.getRect().height,e.x+=this.floorOffset.x,e.y+=this.floorOffset.y,this._towerHeight+=this.floorSprite.getRect().height;var n=e.getComponent(o.default);this.floorsInternal.push(n),n._sprite.spriteFrame=this.floorSprite,cc.tween(this.node).by(.3,{y:this.floorSprite.getRect().height*this.node.scaleY},{easing:"sineInOut"}).call(function(){cc.tween(t.floorsInternal[0].node).by(.5,{y:50},{easing:"backOut"}).by(.3,{y:-50},{easing:"bounceOut"}).start()}).start()},removeFloor:function(t){for(var e=this,o=0,n=0;n<this.floorsInternal.length;++n)if(this.floorsInternal[n]===t){o=n;break}var i=this.floorsInternal[o]._sprite.spriteFrame.getRect().height;cc.tween(this.floorsInternal[o].node).to(.7,{scaleY:0}).call(function(){e._towerHeight-=i;var t=e.floors[0].floorSprite.getRect().width;e.towerRect.x=e.node.x-t/2,e.towerRect.y=e.node.y,e.towerRect.width=t,e.towerRect.height=e._towerHeight,e.floorsInternal.splice(o,1)}).start();for(var r=o+1;r<this.floorsInternal.length;++r)cc.tween(this.floorsInternal[r].node).by(1,{y:-i},{easing:"bounceOut"}).start()},_handleSubscription:function(){},_init:function(){if(!this.floorPrefab)throw"floorPrefab is not defined within tower component"}}),cc._RF.pop()},{"../scripts/Floor":"Floor",GameEvent:"GameEvent"}],TutorialHand:[function(t,e){"use strict";cc._RF.push(e,"b3590wicFhP6IFwh0ghaKoG","TutorialHand");var o,n=(o=t("GameEvent"))&&o.__esModule?o:{default:o};cc.Class({extends:cc.Component,properties:{},onLoad:function(){this._handleSubscription(!0)},_handleSubscription:function(t){var e=t?"on":"off";cc.systemEvent[e](n.default.PLAYER_AIM,this.onPlayerAim,this)},onPlayerAim:function(){var t=this;cc.tween(this.node).to(.5,{opacity:0}).call(function(){t.node.active=!1}).start()}}),cc._RF.pop()},{GameEvent:"GameEvent"}],VillainsTower:[function(t,e){"use strict";cc._RF.push(e,"2a8b3Qec59LrbSJGf07aB+C","VillainsTower");var o=r(t("GameEvent")),n=r(t("Tower")),i=r(t("Floor"));function r(t){return t&&t.__esModule?t:{default:t}}cc.Class({extends:cc.Component,properties:{_tower:{default:null,type:n.default,serializable:!1},_floors:{default:[],type:[i.default],serializable:!1},_selectedFloor:{default:0,type:cc.Integer,serializable:!1}},onLoad:function(){},start:function(){try{this._init()}catch(t){return void cc.warn(t)}this._handleSubscription(!0)},_handleSubscription:function(t){var e=t?"on":"off";cc.systemEvent[e](o.default.PLAYER_AIM,this.onPlayerAim,this),cc.systemEvent[e](o.default.PLAYER_AIM_STOP,this.onPlayerAimStop,this),cc.systemEvent[e](o.default.TOWER_UPDATE,this.onTowerUpdate,this)},_init:function(){if(this._tower=this.node.getComponent(n.default),!this._tower)throw"VillainTower component can't find Tower component within it's node";if(this._floors=this._tower.floorsInternal,!this._floors)throw"Error finding floors"},onPlayerAim:function(t){var e=this.node.convertToNodeSpaceAR(t),o=this._tower.towerRect;if(o.contains(e)){var n=Math.floor(e.y/(o.height/this._floors.length));if(n<0&&(n=0),n!==this._selectedFloor){try{this._floors[this._selectedFloor].unselectCharacter()}catch(i){}this._selectedFloor=n}this._floors[this._selectedFloor].selectCharacter()}},onPlayerAimStop:function(){this._floors[this._selectedFloor].unselectCharacter(),this._selectedFloor>=0&&this._selectedFloor<this._floors.length&&cc.systemEvent.emit(o.default.FIGHT_START,this._floors[this._selectedFloor])},onTowerUpdate:function(t){this._tower.removeFloor(t)}}),cc._RF.pop()},{Floor:"Floor",GameEvent:"GameEvent",Tower:"Tower"}]},{},["Character","CharacterLevel","GameEvent","Floor","HeroTower","Tower","AllScreenRedirect","FailScreen","Logo","Redirect","TutorialHand","VillainsTower"]);