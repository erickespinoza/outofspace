game.PlayScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
      //stuff to reset on state change
      //load a level
      me.levelDirector.loadLevel('area01');

      me.game.addHUD(0,480,320,100);
      me.game.HUD.addItem('score', new game.ScoreObject(50,10));
      me.game.sort();
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	  me.game.disableHUD();
	}
});
