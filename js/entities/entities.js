game.PlayerEntity = me.ObjectEntity.extend({
	/*
	constructor
	*/
	init:function(x, y, settings){
		this.parent(x, y, settings);
		this.gravity = 0;
		this.setMaxVelocity(5, 5);
		this.renderable.addAnimation('idle',[ 0 ]);
		this.renderable.addAnimation('walk',[1,2,3,4,5,6])
		this.renderable.addAnimation('punch',[7,8]);
		this.renderable.animationspeed = 6;
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		this.updateColRect(3,20,0,30);
	},
	/*
	update
	*/
	update:function(){
		// this.renderable.animationspeed = ;
		// left / right movement
		if(me.input.isKeyPressed('left')){
			//this.flipX(true);
			//me.audio.play('walk');
			this.vel.x -= 1;
			this.bullet_direction = 'left';
			this.renderable.angle = Number.prototype.degToRad(180);
			this.renderable.setCurrentAnimation('walk');
			this.parent(true);
			this.updateColRect(10,20,0,30);
		}else if(me.input.isKeyPressed('right')){
			//me.audio.play('walk');
			//this.flipX(false);
			this.vel.x += 1;
			this.bullet_direction = 'right';
			this.renderable.angle = Number.prototype.degToRad(0);
			this.renderable.setCurrentAnimation('walk');
			this.parent(true);
			this.updateColRect(3,20,0,30);
		} else {
			this.vel.x = 0;
			// this.renderable.setCurrentAnimation('idle');
			// this.parent(true);
		}
		// up / down movement
		if(me.input.isKeyPressed('up')){
			//me.audio.play('walk');
			//this.flipY(true);
			this.vel.y -= 1;
			this.bullet_direction = 'up';
			this.renderable.angle = Number.prototype.degToRad(270);
			this.renderable.setCurrentAnimation('walk');
			this.parent(true);
			this.updateColRect(0,30,10,20);
		}else if(me.input.isKeyPressed('down')){
			//me.audio.play('walk');
			//this.flipY(false);
			this.vel.y += 1;
			this.bullet_direction = 'down';
			this.renderable.angle = Number.prototype.degToRad(90);
			this.renderable.setCurrentAnimation('walk');
			this.parent(true);
			this.updateColRect(0,30,3,20);
		} else {
			this.vel.y = 0;
			//this.renderable.setCurrentAnimation('idle');
		}
		if(me.input.isKeyPressed('shoot')){
			me.audio.play('shoot')
			var shot = new ShotEntity(this.pos.x, this.pos.y, {image:'bullet',spritewidth:'10',spriteheight:'10'},this.bullet_direction);
			me.game.add(shot, this.z);
			me.game.sort();
		}

		//this.renderable.setCurrentAnimation('punch');
		if(me.input.isKeyPressed('punch')){
			//this.renderable.animationspeed = 5;
			//this.renderable.image = me.loader.getImage('punch');
			//if(this.renderable.getCurrentAnimationFrame()==3){
				//alert('punch');
				//this.isAttacking = true;
			//}
			this.isAttacking = true;
			this.renderable.setCurrentAnimation('punch',function(){
				//console.log(this);
				//this.setCurrentAnimation('idle');
			});
			this.parent(true);
		}else{
			//this.renderable.image = me.loader.getImage('user');
			//this.renderable.setCurrentAnimation('idle');
			this.isAttacking = false;
		}
		var res = me.game.collide(this);

		if(res){
			
		}
		//check & update player movement
		this.updateMovement();

		//update animation if necesary
		// if(this.vel.x !=0 || this.vel.y !=0){
		// 	this.parent();
		// 	return true;
		// }
		return true;
	},
	onCollision:function(res, obj){
		//console.log(obj.type);
		if(obj.type == 1 && !this.isAttacking){
			me.audio.play('userdie');
			//me.state.change(me.state.PLAY);
			me.state.change(me.state.GAMEOVER);
			//me.game.HUD.updateItemValue('lives',-1);
		}
	}
});


var ShotEntity = me.ObjectEntity.extend({
	init:function(x, y, settings, direction){
		this.parent(x, y, settings);
		switch(direction){
			case 'left':
			this.setVelocity(20,0);
			break;
			case 'right':
			this.setVelocity(20,0);
			break;
			case 'up':
			this.setVelocity(0,20);
			break;
			case 'down':
			this.setVelocity(0,20);
			break;
			default:
			this.setVelocity(0,20);
			break;
		}
		
		this.gravity = 0;
		this.starX = x;
		this.endX = x + 300;
		this.direction = direction;
		this.collidable = true;
		this.type = 3;
		
	},
	update: function(){
		if(!this.inViewport){
			return false;
			me.game.remove(this);
		}	
		switch(this.direction){
			case 'left':
			this.vel.x -= 2;
			break;
			case 'right':
			this.vel.x += 2;
			break;
			case 'up':
			this.vel.y -= 2;
			break;
			case 'down':
			this.vel.y += 2;
			break;
			default:
			this.vel.y += 2;
			break;
		}

		
		var res = me.game.collide(this);
		if(res){
			if(res.obj.type == 1){
				me.game.remove(this);
			}
		}
		this.updateMovement();
		return true;
	}
});

// var ShotEnemyEntity = me.ObjectEntity.extend({
// 	init:function(x, y, settings, direction){
// 		this.parent(x, y, settings);
// 		switch(direction){
// 			case 'left':
// 			this.setVelocity(2,0);
// 			break;
// 			case 'right':
// 			this.setVelocity(2,0);
// 			break;
// 			case 'up':
// 			this.setVelocity(0,2);
// 			break;
// 			case 'down':
// 			this.setVelocity(0,2);
// 			break;
// 			default:
// 			this.setVelocity(0,2);
// 			break;
// 		}
		
// 		this.gravity = 0;
// 		this.starX = x;
// 		this.endX = x + 300;
// 		this.direction = direction;
// 		this.collidable = true;
// 		this.type = 5;
		
// 	},
// 	update: function(){
// 		if(!this.inViewport){
// 			return false;
// 			me.game.remove(this);
// 		}	
// 		switch(this.direction){
// 			case 'left':
// 			this.vel.x -= 1;
// 			break;
// 			case 'right':
// 			this.vel.x += 1;
// 			break;
// 			case 'up':
// 			this.vel.y -= 1;
// 			break;
// 			case 'down':
// 			this.vel.y += 1;
// 			break;
// 			default:
// 			this.vel.y += 1;
// 			break;
// 		}
// 		var res = me.game.collide(this);
// 		if(res){
			
// 			if(res.obj.type == 0){
// 				console.log(res.obj.isAttacking);
// 			}
// 		}
// 		this.updateMovement();
// 		return true;
// 	}
// });

game.EnemyEntityUp = me.ObjectEntity.extend({
	init:function(x, y, settings){
		this.parent(x, y, settings);
		this.setVelocity(2,2);
		this.gravity = 0;
		this.type = me.game.ENEMY_OBJECT;
		this.collidable = true;
		this.renderable.addAnimation('idle',[0]);
		this.renderable.addAnimation('walk',[1,2]);
		this.renderable.addAnimation('die',[3]);
		
	},
	update:function(){
		if(!this.inViewport){
			return false;
		}

		if(this.alive){
			var player = me.game.getEntityByName("player")[0];
			this.renderable.angle = this.angleTo(player);
			if(this.distanceTo(player)<100){
				//console.log('angle '+this.angleTo(player));
				//console.log('move');
				//alert(Math.cos(Number.prototype.radToDeg(player.renderable.angle+Math.PI)));
				this.vel.x += Math.sin(Number.prototype.radToDeg(player.renderable.angle-Math.PI))*this.distanceTo(player);
				this.vel.y += Math.cos(Number.prototype.radToDeg(player.renderable.angle-Math.PI))*this.distanceTo(player);
				 // var shot = new ShotEnemyEntity(this.pos.x, this.pos.y, {image:'bullet',spritewidth:'16',spriteheight:'16'},'up');
				 // me.game.add(shot, this.z);
				 // me.game.sort();
				 this.renderable.setCurrentAnimation('walk');
				 this.parent(true);

			}else{
				this.vel.x = 0;
				this.vel.y = 0;
				this.renderable.setCurrentAnimation('idle');
				this.parent(true);
			}
			// else if(this.distanceTo(player) == 0){
			// 	this.vel.y = 0;
			// }else{
			// 	this.vel.y = 0;
			// }
		}
		var res = me.game.collide(this);
		if(res){	
			if(res.obj.type == 0){
				//me.game.remove(this);
			}
		}
		this.updateMovement();
		if(this.vel.x !=0 || this.vel.y !=0){
			this.parent();
			return true;
		}
		return false;
	},
	onCollision: function(res, obj){
		
		if(obj.type == 3){
			//this.alive = false;
			me.audio.play('enemydie');
			me.game.remove(this);
			var blood = new BloodEntity(this.pos.x, this.pos.y, {image:'blood', spritewidth:32, spriteheight: 32});
			me.game.add(blood, 3);
			me.game.sort();

			me.game.HUD.updateItemValue('score',50);
		}

		if(obj.type == 0 && obj.isAttacking){
			me.audio.play('enemydie');
			me.game.remove(this);
			var blood = new BloodEntity(this.pos.x, this.pos.y, {image:'blood', spritewidth:32, spriteheight: 32});
			me.game.add(blood, 3);
			me.game.sort();
			me.game.HUD.updateItemValue('score',200);
		}
	}
});
var BloodEntity = me.ObjectEntity.extend({
	init:function(x, y, settings){
		this.parent(x, y, settings);
		this.gravity = 0;
		this.collidable = false;
	}
});
// var Playerpunch = me.ObjectEntity.extend({
// 	init:function(x,y, settings){
// 		this.parent(x,y, settings);
// 		this.gravity = 0;
// 	}
// });
game.ScoreObject = me.HUD_Item.extend({
	init:function(x, y){
		this.parent(x, y);
		this.font = new me.BitmapFont('16x16_font',16);
		//this.font.set('right');
	},
	draw:function(context, x, y){
		this.font.draw(context, this.value, this.pos.x +x, this.pos.y +y);
	}
});