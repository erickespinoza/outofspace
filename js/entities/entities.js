game.PlayerEntity = me.ObjectEntity.extend({
	/*
	constructor
	*/
	init:function(x, y, settings){
		this.parent(x, y, settings);
		this.gravity = 0;

		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},
	/*
	update
	*/
	update:function(){
		
		// left / right movement
		if(me.input.isKeyPressed('left')){
			//this.flipX(true);
			this.vel.x -= 1;
			this.bullet_direction = 'left';
			this.renderable.angle = Number.prototype.degToRad(90);
		}else if(me.input.isKeyPressed('right')){
			//this.flipX(false);
			this.vel.x += 1;
			this.bullet_direction = 'right';
			this.renderable.angle = Number.prototype.degToRad(270);
		} else {
			this.vel.x = 0;
		}
		// up / down movement
		if(me.input.isKeyPressed('up')){
			//this.flipY(true);
			this.vel.y -= 1;
			this.bullet_direction = 'up';
			this.renderable.angle = Number.prototype.degToRad(180);
		}else if(me.input.isKeyPressed('down')){
			//this.flipY(false);
			this.vel.y += 1;
			this.bullet_direction = 'down';
			this.renderable.angle = Number.prototype.degToRad(0);
		} else {
			this.vel.y = 0;
		}
		if(me.input.isKeyPressed('shoot')){
			
			var shot = new ShotEntity(this.pos.x, this.pos.y, {image:'bullet',spritewidth:'16',spriteheight:'16'},this.bullet_direction);
			me.game.add(shot, this.z);
			me.game.sort();
		}
		//check & update player movement
		this.updateMovement();

		//update animation if necesary
		if(this.vel.x !=0 || this.vel.y !=0){
			this.parent();
			return true;
		}
		return false;
	},
	onCollision:function(res, obj){
		if(obj.type == 5){

		}
	}
});

var ShotEntity = me.ObjectEntity.extend({
	init:function(x, y, settings, direction){
		this.parent(x, y, settings);
		switch(direction){
			case 'left':
			this.setVelocity(5,0);
			break;
			case 'right':
			this.setVelocity(5,0);
			break;
			case 'up':
			this.setVelocity(0,5);
			break;
			case 'down':
			this.setVelocity(0,5);
			break;
			default:
			this.setVelocity(0,5);
			break;
		}
		
		this.gravity = 0;
		this.starX = x;
		this.endX = x + 300;
		this.direction = direction;
		this.collidable = true;
		this.type = me.game.ACTION_OBJECT;
		
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

var ShotEnemyEntity = me.ObjectEntity.extend({
	init:function(x, y, settings, direction){
		this.parent(x, y, settings);
		switch(direction){
			case 'left':
			this.setVelocity(2,0);
			break;
			case 'right':
			this.setVelocity(2,0);
			break;
			case 'up':
			this.setVelocity(0,2);
			break;
			case 'down':
			this.setVelocity(0,2);
			break;
			default:
			this.setVelocity(0,2);
			break;
		}
		
		this.gravity = 0;
		this.starX = x;
		this.endX = x + 300;
		this.direction = direction;
		this.collidable = true;
		this.type = 5;
		
	},
	update: function(){
		if(!this.inViewport){
			return false;
			me.game.remove(this);
		}	
		switch(this.direction){
			case 'left':
			this.vel.x -= 1;
			break;
			case 'right':
			this.vel.x += 1;
			break;
			case 'up':
			this.vel.y -= 1;
			break;
			case 'down':
			this.vel.y += 1;
			break;
			default:
			this.vel.y += 1;
			break;
		}
		var res = me.game.collide(this);
		if(res){
			
			if(res.obj.type == 0){
				me.game.remove(this);
			}
		}
		this.updateMovement();
		return true;
	}
});

game.EnemyEntityUp = me.ObjectEntity.extend({
	init:function(x, y, settings){
		this.parent(x, y, settings);
		this.setVelocity(0,1);
		this.gravity = 0;
		this.type = me.game.ENEMY_OBJECT;
		this.collidable = true;
		
	},
	update:function(){
		if(!this.inViewport){
			return false;
		}

		if(this.alive){
			var player = me.game.getEntityByName("player")[0];
			if(this.distanceTo(player)<60){
				console.log('move');
				this.vel.y -= 2;
				 var shot = new ShotEnemyEntity(this.pos.x, this.pos.y, {image:'bullet',spritewidth:'16',spriteheight:'16'},'up');
				 me.game.add(shot, this.z);
				 me.game.sort();

			}else{
				this.vel.y = 0;
			}
		}
		var res = me.game.collide(this);
		if(res){	
			if(res.obj.type == 0){
				me.game.remove(this);
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
		
		if(this.alive && obj.type == 3){
			this.alive = false;
			me.game.remove(this);
			me.game.HUD.updateItemValue('score','50');
		}
	}
});

game.ScoreObject = me.HUD_Item.extend({
	init:function(x, y){
		this.parent(x, y);
		this.font = new me.BitmapFont('16x16_font',16);
		this.font.set('right');
	},
	draw:function(context, x, y){
		this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
	}
});