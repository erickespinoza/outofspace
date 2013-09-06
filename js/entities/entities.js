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
			shot.renderable.angle = this.renderable.angle;
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
		this.renderable.addAnimation('walk',[1,2,3,4,5,6]);
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


/**
 * Basic Triangle class
 */
game.Triangle = Object.extend({

    /**
     * Constructor
     * @name game.Triangle#init
     * @function
     * @param {me.Vector2d} a Point a
     * @param {me.Vector2d} b Point b
     * @param {me.Vector2d} c Point c
     */
    "init" : function (a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    },

    /**
     * Check if a point lies within the triangle
     * @name game.Triangle#containsPoint
     * @function
     * @param {me.Vector2d} p Point to check
     * @return {Boolean}
     * @see http://goo.gl/6sAFR
     */
    "containsPoint" : function (x, y) {
        function sign(u, v) {
            return (x - v.x) * (u.y - v.y) - (u.x - v.x) * (y - v.y);
        }

        return (
            sign(this.a, this.b) > 0 &&
            sign(this.b, this.c) > 0 &&
            sign(this.c, this.a) > 0
        );
    },

    "draw" : function (context, color) {
        context.beginPath();
        context.moveTo(this.a.x, this.a.y);
        context.lineTo(this.b.x, this.b.y);
        context.lineTo(this.c.x, this.c.y);
        context.closePath();

        context.strokeStyle = color;
        context.stroke();

        if (this.pressed) {
            context.fillStyle = color;
            context.fill();
        }
    }
});

game.UI = me.Renderable.extend({
    "init" : function () {
        this.parent(new me.Vector2d(35, 395), 870, 220);
        this.isPersistent = true;
        this.floating = true;

        this.dpad = me.loader.getImage("ui-dpad");
        this.button = me.loader.getImage("ui-button");

        // Button areas
        var buttons = this.buttons = {
            // Directional pad
            "up"    : new game.Triangle(
                new me.Vector2d(140, 500),
                new me.Vector2d(-20, 360),
                new me.Vector2d(300, 360)
            ),
            "down"  : new game.Triangle(
                new me.Vector2d(140, 500),
                new me.Vector2d(300, 640),
                new me.Vector2d(-20, 640)
            ),
            "left"  : new game.Triangle(
                new me.Vector2d(140, 500),
                new me.Vector2d(0, 660),
                new me.Vector2d(0, 340)
            ),
            "right" : new game.Triangle(
                new me.Vector2d(140, 500),
                new me.Vector2d(280, 340),
                new me.Vector2d(280, 660)
            ),
            // Action buttons
            "b"     : new me.Rect(new me.Vector2d(690, 460), 80, 80),
            "a"     : new me.Rect(new me.Vector2d(810, 460), 80, 80)
        };

        // Set keys
        buttons.up.key      = me.input.KEY.UP;
        buttons.down.key    = me.input.KEY.DOWN;
        buttons.left.key    = me.input.KEY.LEFT;
        buttons.right.key   = me.input.KEY.RIGHT;
        buttons.b.key       = me.input.KEY.X;
        buttons.a.key       = me.input.KEY.Z;

        // Set default button properties
        for (var name in buttons) {
            buttons[name].pressed = false;
            buttons[name].id = 0;
        }

        // Event handlers
        function mousemove(e) {
console.log("mousedown", e);
            // Iterate each button
            for (var name in buttons) {
                var button = buttons[name];

                // Check if button is pressed by this touch
                var pressed = button.containsPoint(e.gameX, e.gameY);

                if (pressed && !button.pressed) {
                    // Button down
                    button.pressed = true;
                    button.id = e.pointerId;
                    me.input.triggerKeyEvent(button.key, true);
                }
                else if ((button.id === e.pointerId) &&
                    !pressed && button.pressed) {
                    // Button up
                    button.pressed = false;
                    button.id = 0;
                    me.input.triggerKeyEvent(button.key, false);
                }
            }
        }

        function mouseup(e) {
console.log("mouseup", e);
            // Iterate each button
            for (var name in buttons) {
                var button = buttons[name];

                // Check if button is released by this touch
                var released = (button.id === e.pointerId);

                if (button.pressed && released) {
                    // Button up
                    button.pressed = false;
                    button.id = 0;
                    me.input.triggerKeyEvent(button.key, false);
                }
            }
        }

        me.input.registerPointerEvent("mousedown", this, mousemove, true);
        me.input.registerPointerEvent("mousemove", this, mousemove, true);
        me.input.registerPointerEvent("mouseup", this, mouseup, true);
    },

    "destroy" : function () {
        me.input.releasePointerEvent("mousedown", this);
        me.input.releasePointerEvent("mousemove", this);
        me.input.releasePointerEvent("mouseup", this);
    },

    "draw" : function (context) {
        context.drawImage(this.dpad, 35, 395);
        context.drawImage(this.button, 686, 456);
        context.drawImage(this.button, 806, 456);

        if (me.debug.renderHitBox) {
            this.buttons.up.draw(context, "#00f");
            this.buttons.down.draw(context, "#0f0");
            this.buttons.left.draw(context, "#0ff");
            this.buttons.right.draw(context, "#f00");
            this.buttons.b.draw(context, "#f0f");
            this.buttons.a.draw(context, "#ff0");
        }
    }
});