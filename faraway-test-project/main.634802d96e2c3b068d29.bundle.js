(()=>{"use strict";var e,t={855:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});class i extends Phaser.GameObjects.Container{constructor(e,t={}){var i,n,s;super(e),this.settings={},this.elements={},this.settings=t,this.setPosition(null!==(i=t.x)&&void 0!==i?i:0,null!==(n=t.y)&&void 0!==n?n:0),this.setScale(null!==(s=t.scale)&&void 0!==s?s:1),this.initButton()}initButton(){this.addSprite(),this.initInput(),this.toggleInput(!0)}addSprite(){const{scene:e,elements:t,settings:i}=this,{atlas:n,sprites:s}=i;if(n&&s&&s.spriteActive){const i=new Phaser.GameObjects.Image(e,0,0,n,s.spriteActive);this.add(i),t.buttonImage=i}}initInput(){const{elements:e,settings:t}=this,{sprites:i}=t,{buttonImage:n}=e;i.spriteInactive||(i.spriteInactive=i.spriteActive),n.on("pointerdown",(()=>{console.log("click"),n.setFrame(i.spriteInactive)})),n.on("pointerup",(()=>{n.setFrame(i.spriteActive)})),n.on("pointerout",(()=>{n.setFrame(i.spriteActive)})),n.on("pointerover",(()=>{}))}toggleInput(e=!1){const{elements:t}=this,{buttonImage:i}=t;e?i.setInteractive():i.disableInteractive()}}t.default=i},788:function(e,t,i){var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))((function(s,o){function a(e){try{d(n.next(e))}catch(e){o(e)}}function r(e){try{d(n.throw(e))}catch(e){o(e)}}function d(e){var t;e.done?s(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(a,r)}d((n=n.apply(e,t||[])).next())}))},s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=i(3),a=s(i(855));class r extends o.Scene3D{constructor(){super({key:"Game"}),this.elements={},this.elements.arcSegments=200,this.elements.cameraBaseRotation,this.elements.characters=[]}init(){this.accessThirdDimension()}preload(){this.load.atlas("button_shoot","assets/img/button/button_shoot/button_shoot.png","assets/img/button/button_shoot/button_shoot.json"),this.third.load.preload("hero","assets/img/hero/hero.png"),this.third.load.preload("villain","assets/img/villain/villain.png")}create(){this.initScene(),this.addGround(),this.addFence(new o.THREE.Vector3(0,1.65,5)),this.addFence(new o.THREE.Vector3(0,1.65,-5)),this.addCharacter("hero",new o.THREE.Vector3(0,2.65,7)),this.addCharacter("villain",new o.THREE.Vector3(0,2.65,-7)),this.addTestCurve(),this.addFireButton(),this.addWeaponButtons()}update(){const{third:e,elements:t}=this,{characters:i}=t;(e.camera.position.y<2||e.camera.position.y>27)&&this.easeCameraToStart(),i.length&&i.forEach((t=>t.flipX(e.camera.rotation.y<0)))}initScene(){return n(this,void 0,void 0,(function*(){const{orbitControls:e}=yield this.third.warpSpeed("-ground");this.orbitControls=e;const{third:t,elements:i}=this;t.camera.position.set(28,10,0),t.camera.lookAt(0,0,0),i.cameraBaseRotation=Object.assign({},t.camera.rotation)}))}addGround(){const{third:e}=this,{scene:t}=e;t.background=new o.THREE.Color(15658734),t.fog=new o.THREE.Fog(15658734,40,75),e.add.ground({width:20,depth:3,height:20},{lambert:{color:"#55BB33"}}),e.add.ground({width:2e4,height:2e4,y:-2}),this.addWater()}addWater(){return n(this,void 0,void 0,(function*(){const{third:e}=this,t=yield Promise.all([e.load.texture("/assets/img/water/water_heightmap_0.jpg"),e.load.texture("/assets/img/water/water_heightmap_1.jpg")]);t[0].needsUpdate=!0,t[1].needsUpdate=!0,e.misc.water({width:150,height:150,y:.5,normalMap0:t[0],normalMap1:t[1]})}))}addFence(e){return n(this,void 0,void 0,(function*(){const{third:t}=this,i=new o.ExtendedObject3D,n=yield t.load.fbx("assets/fbx/fence.fbx");i.add(n),i.scale.set(.003,.003,.003),i.position.set(e.x,e.y,e.z),i.traverse((e=>{e.isMesh&&(e.castShadow=!0,e.material=new o.THREE.MeshPhongMaterial({color:16765696,flatShading:!0,shininess:1}))})),t.add.existing(i)}))}addCharacter(e,t){return n(this,void 0,void 0,(function*(){const{third:i,elements:n}=this,s=yield i.load.texture(e);s.magFilter=o.THREE.NearestFilter,s.minFilter=o.THREE.NearestFilter;const a=new o.FLAT.SpriteSheet(s,{width:32,height:32});a.anims.add("idle",{start:0,end:3,rate:5}),a.anims.play("idle"),a.setScale(.075),a.position.set(t.x,t.y,t.z),n.characters.push(a),i.scene.add(a)}))}easeCameraToStart(){const{orbitControls:e}=this;if(!e)return;const{third:t,elements:i}=this,{cameraBaseRotation:n}=i;e.enabled=!1,this.add.tween({targets:[t.camera.position],x:28,y:10,z:0,duration:350,ease:Phaser.Math.Easing.Sine.Out,onComplete:()=>{e.enabled=!0}}).play(),this.add.tween({targets:[t.camera.rotation],x:n._x,y:n._y,z:n._z,duration:350,ease:Phaser.Math.Easing.Sine.Out}).play()}addFireButton(){const{elements:e}=this,t=window.innerWidth,i=window.innerHeight,n=new a.default(this,{atlas:"button_shoot",sprites:{spriteActive:"button_shoot_0",spriteInactive:"button_shoot_1"},x:t-125,y:i-125,scale:5});this.children.add(n),e.fireButton=n}addWeaponButtons(){}addTestCurve(){const e=new o.THREE.BufferGeometry,t=[];let i=0;for(let e=0;e<50;++e)i+=.3,t.push(0,-.1*Math.pow(i,2)+i,-i);e.setAttribute("position",new o.THREE.Float32BufferAttribute(t,3));const n=new o.THREE.LineSegments(e.clone(),new o.THREE.LineBasicMaterial({color:16711680,opacity:.35}));n.castShadow=!0,n.position.set(0,2.5,7.5),this.third.add.existing(n),this.elements.line=n}updateTestCurve(){const e=[];let t=0;for(let i=0;i<50;++i)t+=.3,e.push(0,-.1*Math.pow(t,2)+t,-t);this.elements.curve.points=e;const i=this.elements.line.geometry.attributes.position;for(let e=0;e<this.elements.ARC_SEGMENTS;++e){const t=e/(this.elements.ARC_SEGMENTS-1);let n;n=this.elements.curve.getPoint(t),i.setXYZ(e,n.x,n.y,n.z)}i.needsUpdate=!0}}t.default=r},441:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});class i extends Phaser.Scene{constructor(){super({key:"Preload"})}preload(){}create(){this.scene.start("Game")}}t.default=i},550:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(t,i);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,s)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),s=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return s(t,e),t},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=o(i(260)),d=i(3),l=a(i(441)),c=a(i(788)),h=Object.assign({type:r.WEBGL,transparent:!0,scale:{mode:r.Scale.FIT,autoCenter:r.Scale.CENTER_BOTH,width:window.innerWidth*Math.max(1,window.devicePixelRatio/2),height:window.innerHeight*Math.max(1,window.devicePixelRatio/2)},scene:[l.default,c.default],pixelArt:!0},(0,d.Canvas)());(0,d.enable3d)((()=>new r.Game(h)))}},i={};function n(e){var s=i[e];if(void 0!==s)return s.exports;var o=i[e]={exports:{}};return t[e].call(o.exports,o,o.exports,n),o.exports}n.m=t,e=[],n.O=(t,i,s,o)=>{if(!i){var a=1/0;for(c=0;c<e.length;c++){for(var[i,s,o]=e[c],r=!0,d=0;d<i.length;d++)(!1&o||a>=o)&&Object.keys(n.O).every((e=>n.O[e](i[d])))?i.splice(d--,1):(r=!1,o<a&&(a=o));if(r){e.splice(c--,1);var l=s();void 0!==l&&(t=l)}}return t}o=o||0;for(var c=e.length;c>0&&e[c-1][2]>o;c--)e[c]=e[c-1];e[c]=[i,s,o]},n.d=(e,t)=>{for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={179:0};n.O.j=t=>0===e[t];var t=(t,i)=>{var s,o,[a,r,d]=i,l=0;if(a.some((t=>0!==e[t]))){for(s in r)n.o(r,s)&&(n.m[s]=r[s]);if(d)var c=d(n)}for(t&&t(i);l<a.length;l++)o=a[l],n.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return n.O(c)},i=self.webpackChunkphaser_project_template=self.webpackChunkphaser_project_template||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))})();var s=n.O(void 0,[216],(()=>n(550)));s=n.O(s)})();