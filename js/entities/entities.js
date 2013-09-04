game.PlayerEntity = me.ObjectEntity.extend({
	/*
	constructor
	*/
	init:function(x, y, settings){
		this.parent(x, y, settings);
		this.gravity = 0;
		this.setMaxVelocity(3, 3);
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
			// left / right movement
		if(me.input.isKeyPressed('left')){
			this.vel.x -= 1;
			this.bullet_direction = 'left';
			this.renderable.angle = Number.prototype.degToRad(180);
			this.renderable.setCurrentAnimation('walk');
			this.parent(true);
			this.updateColRect(10,20,0,30);
		}else if(me.input.isKeyPressed('right')){
			this.vel.x += 1;
			this.bullet_direction = 'right';
			this.renderable.angle = Number.prototype.degToRad(0);
			this.renderable.setCurrentAnimation('walk');
			this.parent(true);
			this.updateColRect(3,20,0,30);
		} else {
			this.vel.x = 0;
		}
		// up / down movement
		if(me.input.isKeyPressed('up')){
			this.vel.y -= 1;
			this.bullet_direction = 'up';
			this.renderable.angle = Number.prototype.degToRad(270);
			this.renderable.setCurrentAnimation('walk');
			this.parent(true);
			this.updateColRect(0,30,10,20);
		}else if(me.input.isKeyPressed('down')){
			this.vel.y += 1;
			this.bullet_direction = 'down';
			this.renderable.angle = Number.prototype.degToRad(90);
			this.renderable.setCurrentAnimation('walk');
			this.parent(true);
			this.updateColRect(0,30,3,20);
		} else {
			this.vel.y = 0;
		}
		if(me.input.isKeyPressed('shoot')){
			me.audio.play('shoot')
			var shot = new ShotEntity(this.pos.x+10, this.pos.y, {image:'bullet',spritewidth:'10',spriteheight:'10'},this.bullet_direction);
			me.game.add(shot, this.z);
			me.game.sort();
		}

		//this.renderable.setCurrentAnimation('punch');
		if(me.input.isKeyPressed('punch')){
			this.updateColRect(0,32,0,32);
			this.isAttacking = true;
			this.renderable.setCurrentAnimation('punch');
			this.parent(true);
		}else{
			this.isAttacking = false;
		}
		var res = me.game.collide(this);

		if(res){
			
		}
		//check & update player movement
		this.updateMovement();

		
		return true;
	},
	onCollision:function(res, obj){
		if(obj.type == 1 && !this.isAttacking){
			
			var blood = new BloodEntity(this.pos.x, this.pos.y, {image:'bloodU', spritewidth:32, spriteheight: 32});
			me.game.add(blood, 5);
			me.game.sort();
			
			me.input.unbindKey(me.input.KEY.LEFT);
		    me.input.unbindKey(me.input.KEY.RIGHT);
		    me.input.unbindKey(me.input.KEY.UP);
		    me.input.unbindKey(me.input.KEY.DOWN);
		    me.input.unbindKey(me.input.KEY.Z);
		    me.input.unbindKey(me.input.KEY.X);
			me.audio.play('userdie',false,function(){
				me.state.change(me.state.GAMEOVER);
			});
		}
	}
});
//Shot entity 
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
//Enemy Entity that follows the user
game.EnemyEntityUp = me.ObjectEntity.extend({
	init:function(x, y, settings){
		this.parent(x, y, settings);
		//this.setVelocity(0.5,0.5);
		this.setMaxVelocity(3,3);
		this.gravity = 0;
		this.type = me.game.ENEMY_OBJECT;
		this.collidable = true;
		this.renderable.addAnimation('idle',[0]);
		this.renderable.addAnimation('walk',[1,2]);
		this.renderable.addAnimation('die',[3]);
		this.moveX = 0;
		this.moveY = 0;
		this.updateColRect(3,30,0,10);
		
	},
	update:function(){
		if(!this.inViewport){
			return false;
		}

		if(this.alive){
			var player = me.game.getEntityByName("player")[0];
			this.renderable.angle = this.angleTo(player);
			this.distanceX = player.pos.x - this.pos.x;
			this.distanceY = player.pos.y - this.pos.y;
			this.distanceTotal = Math.sqrt(this.distanceX * this.distanceX + this.distanceY * this.distanceY);
			
			if(this.distanceTo(player)<150){
				this.moveDistanceX = 0.01 * this.distanceX / this.distanceTotal;
				this.moveDistanceY = 0.01 * this.distanceY / this.distanceTotal;
				this.moveX += this.moveDistanceX;
				this.moveY += this.moveDistanceY;

				this.totalmove = Math.sqrt(this.moveX * this.moveX + this.moveX * this.moveX);
				this.moveX = 1 * this.moveX / this.totalmove;
				this.moveY = 1 * this.moveY / this.totalmove;
				this.pos.x += this.moveX;
				this.pos.y += this.moveY;
				this.renderable.setCurrentAnimation('walk');
				this.parent(true);

			}else{
				this.renderable.setCurrentAnimation('idle');
				this.parent(true);
			}
			
		}
		var res = me.game.collide(this);
		if(res){	
			if(res.obj.type == 0){
				
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
// Blood when user or enemy day Object
var BloodEntity = me.ObjectEntity.extend({
	init:function(x, y, settings){
		this.parent(x, y, settings);
		this.gravity = 0;
		this.collidable = false;
	}
});
//ScoreOject
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