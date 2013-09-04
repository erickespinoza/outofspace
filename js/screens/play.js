game.PlayScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
      //stuff to reset on state change
      //load a level
      me.levelDirector.loadLevel('area01');

      me.game.addHUD(0,0,480,100);
      me.game.HUD.addItem('score', new game.ScoreObject(150,10));
      me.game.HUD.addItem('score_title',new game.ScoreObject(50,10));
      //me.game.HUD.addItem('lives_title', new game.ScoreObject(280,10));
      //me.game.HUD.addItem('lives', new game.ScoreObject(380,10));
      me.game.sort();
      me.game.HUD.setItemValue('score_title','SCORE:');
      //me.game.HUD.setItemValue('lives_title','LIVES:');
      //me.game.HUD.setItemValue('lives',3);
      //me.audio.playTrack("background2",0.4);
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	  me.game.disableHUD();

	  me.audio.stopTrack();
	}
});

game.OverScreen = me.ScreenObject.extend({
	init: function(){
		this.parent(true);
		this.title = null;
	},

	onResetEvent: function(){
		if(this.title == null){
			this.title = me.loader.getImage('over');
		}
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
	},
	draw:function(context){
		context.drawImage(this.title, 0, 0);
	},
	update: function(){
		if(me.input.isKeyPressed('enter')){
			me.state.change(me.state.MENU);
		}
	},
	onDestroyEvent: function(){
		me.input.unbindKey(me.input.KEY.ENTER);
	}
});

game.TitleScreen = me.ScreenObject.extend({
	init: function(){
		this.parent(true);
		this.title = null;
	},
	onResetEvent: function(){
		if(this.title == null){
			this.title = me.loader.getImage('menu');
		}
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		//me.audio.playTrack("background",0.4);
	},
	draw: function(context){
		context.drawImage(this.title,0,0);
	},
	update: function(){
		if(me.input.isKeyPressed('enter')){
			me.state.change(me.state.PLAY);
		}
	},
	onDestroyEvent:function(){
		me.input.unbindKey(me.input.KEY.ENTER);
		me.audio.stopTrack("background",0.4);

	}
});
