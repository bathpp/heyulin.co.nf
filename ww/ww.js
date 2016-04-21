// Stage
function Stage(width, height, ggmon, stageElementID){
	this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
	this.player=null; // a special actor, the player
	
	// the logical width and height of the stage
	this.width=width;
	this.height=height;
	
	// the element containing the visual representation of the stage
	this.stageElementID=stageElementID;


	this.blankImageSrc=document.getElementById('blankImage').src;
	this.monsterImageSrc=document.getElementById('monsterImage').src;
	this.playerImageSrc=document.getElementById('playerImage').src;
	this.boxImageSrc=document.getElementById('boxImage').src;
	this.wallImageSrc=document.getElementById('wallImage').src;
	
}

// initialize an instance of the game
Stage.prototype.initialize=function(){
	// Create a table of blank images, give each image an ID so we can reference it later
	var s="<table style='border:1px solid black;'>";
	// YOUR CODE GOES HERE
	for (var i2=0; i2<this.height; i2++){
		s+="<tr>";
		for(var i1=0; i1<this.width; i1++){
		s+='<td> <img src=' + this.blankImageSrc + ' id= '+this.getStageId(i1, i2)+' height=25, width=25> </td>';
		}
		s+="</tr>";
	}
	s+="</table>";
	
	// Put it in the stageElementID (innerHTML)
	document.getElementById(this.stageElementID).innerHTML = s;
	// Add the player to the center of the stage
	
	this.addPlayer(new Player(this, Math.round(this.width/2), Math.round(this.height/2)));
	
	// Add walls around the outside of the stage, so actors can't leave the stage
	
	for(var i1=0; i1<this.width;i1++){
		this.addActor(new Wall(this, i1, 0));
		this.addActor(new Wall(this, i1, this.height-1));	
	}
	
	for(var i2=1; i2<this.height-1;i2++){
		this.addActor(new Wall(this, 0, i2));
		this.addActor(new Wall(this, this.width-1, i2));	
	}

	// Add some Boxes to the stage
	for(var i=0; i<this.height*this.width/5; i++){
		var n1 = this.width-1;
		var n2 = this.height-1;
		var i1=Math.floor((Math.random()*n1)+1);
		var i2=Math.floor((Math.random()*n2)+1);
		if(this.getActor(i1,i2)!=null){ i-=1;}
		else 
			 this.addActor(new Box(this, i1, i2));

	}
	
	// Add in some Monsters
	for(var i=0; i<6; i++){
		var n1 = this.width-1;
		var n2 = this.height-1;
		var i1=Math.floor((Math.random()*n1)+1);
		var i2=Math.floor((Math.random()*n2)+1);
		if(this.getActor(i1,i2)!=null){ i-=1;}
		else 
			this.addActor(new Monster(this, i1, i2));

	}


}
// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId=function(x,y){ return x+"-"+y; }

Stage.prototype.addPlayer=function(player){
	this.addActor(player);
	this.player=player;
}

Stage.prototype.removePlayer=function(){
	this.removeActor(this.player);
	this.player=null;
}

Stage.prototype.addActor=function(actor){
	this.actors.push(actor);
}

Stage.prototype.removeActor=function(actor){
	// Lookup javascript array manipulation (indexOf and splice).	
	this.actors.splice(this.actors.indexOf(actor),1);
	this.setImage(actor.x, actor.y, this.blankImageSrc );
	
}

// Set the src of the image at stage location (x,y) to src
Stage.prototype.setImage=function(x, y, src){
	var id=this.getStageId(x,y);
	document.getElementById(id).src= src;
}

// Take one step in the animation of the game.  


Stage.prototype.step=function(){
	if(this.player==null){
		
		clearInterval(interval1);
		clearInterval(interval2);
		interval1=null;
		interval2=null;
		return false;
	}
	var n=0;
	var l = this.actors.length;
	for(var i=0;i<l;i++){
		this.actors[i].step();
		if(this.actors[i].constructor==Monster){n++;}
	}
	if(n==0){
		for(var i=0;i<l;i++){
		var id=this.actors[i].x+"-"+this.actors[i].y;;
		document.getElementById(id).src= this.playerImageSrc;
		alert("You win!!!");
		return false;
	}	
	}
	
}

// return the first actor at coordinates (x,y) return null if there is no such actor
Stage.prototype.getActor=function(x, y){
	for(var i=0; i<this.actors.length; i++){
		if(this.actors[i].x==x && this.actors[i].y==y){
			return this.actors[i];
		}
	}
	return null;
}
// End Class Stage

// Class Player
function Player(stage, x, y){
	// this's location on the stage
	this.x=x;
	this.y=y;
	this.stage=stage; // the stage that this is on
	this.stage.setImage(x,y,this.stage.playerImageSrc);
}

// What we do at each tick of the clock
Player.prototype.step=function(){ return; }

/* other asked this to move. In this case, move if possible, return whether I moved.
if there is a space available go to it, otherwise, we may need to ask a neighbour 
to move to get our work done. */
Player.prototype.move=function(other, dx, dy){

	// Where we are supposed to move.
	
	var newx=this.x+dx;
	var newy=this.y+dy;
	
	if(this.stage.getActor(newx, newy)==null){
		this.stage.removePlayer();
		this.x=newx;
		this.y=newy;
		this.stage.addPlayer(new Player(this.stage, this.x, this.y));
		return true;	
	}
	else if(this.stage.getActor(newx, newy).constructor==Monster){
		alert("You are Dead, Game Over");
		this.stage.removePlayer();
		return false;
	}
	else if(this.stage.getActor(newx, newy).constructor==Box){
		//alert("box");
		this.stage.getActor(newx, newy).move(this, dx, dy);
		
		
	}	
		//return this.stage.getActor(newx, newy).move(other, dx, dy);
		
	
	else if(this.stage.getActor(newx, newy).constructor==Wall){
		
		return this.stage.getActor(newx, newy).move(other, newx, newy);
			
		}
	
	/* Determine if another Actor is occupying (newx, newy). If so,
	this asks them to move. If they moved, then we can occupy the spot. Otherwise
	we can't move. We return true if we moved and false otherwise. */

	// We move both logically, and on the screen (change the images in the table)

	
}
// End Class Player

// Class Wall (COMPLETE AS IS!)
function Wall(stage, x, y){
	// this's location on the stage
	this.x=x;
	this.y=y;
	this.stage=stage; // the stage that this is on
	this.stage.setImage(x,y,this.stage.wallImageSrc);
}

// What we do at each tick of the clock
Wall.prototype.step=function(){ return; }

// No one can push me around!
Wall.prototype.move=function(other, dx, dy){
	return false;
}
// End Class Wall

// Class Box
function Box(stage, x, y){
	// this's location on the stage
	this.x=x;
	this.y=y;
	this.stage=stage; // the stage that this is on
	this.stage.setImage(x,y,this.stage.boxImageSrc);
}

// What we do at each tick of the clock
Box.prototype.step=function(){ return; }

// If the Player or another Box asked us to me, we try. 
// return true if we moved, false otherwise.
Box.prototype.move=function(other, dx, dy){
	var newx=this.x+dx;
	var newy=this.y+dy;
	var oldx=this.stage.player.x+dx;
	var oldy=this.stage.player.y+dy;
	if(this.stage.getActor(newx, newy)==null){
		this.stage.removePlayer();
		this.stage.removeActor(this.stage.getActor(oldx, oldy));
		this.stage.addActor(new Box(this.stage, newx, newy));
		this.stage.addPlayer(new Player(this.stage, oldx, oldy));
		return true;
	}
	else if(this.stage.getActor(newx, newy).constructor==Wall || this.stage.getActor(newx, newy).constructor==Monster){
		return false;
	}
	else if(this.stage.getActor(newx, newy).constructor==Box){
		this.stage.getActor(newx, newy).move(this,dx,dy);		
	}
}
// End Class Box


// Class Monster
function Monster(stage, x, y){
	// this's location on the stage
	this.x=x;
	this.y=y;
	this.dx=0;
	this.dy=0;
	this.stage=stage; // the stage that this is on
	this.stage.setImage(x,y,this.stage.monsterImageSrc);
	this.dead=false;
}

Monster.prototype.whereToGo=function(){
	if(this.stage.getActor(this.x + this.dx, this.y + this.dy)==null){
		this.dx = this.dx;
		this.dy = this.dy;
	}
	else{
		var i;
		var block = 0;
		var around = [
			[this.stage.getActor(this.x+1, this.y), 1, 0],
			[this.stage.getActor(this.x-1, this.y), -1, 0],
			[this.stage.getActor(this.x, this.y+1), 0, 1],
			[this.stage.getActor(this.x, this.y-1), 0, -1],

		];

		var r = Math.floor((Math.random()*4)+0);
		if (around[r][0]!=null && around[r][0].constructor==Player){
			this.dx = around[r][1];
			this.dy = around[r][2];
		}
		else if(around[r][0]==null){
			this.dx = around[r][1];
			this.dy = around[r][2];
		}
		else{
			for(i=0;i<4;i++){
				if (around[i][0]!=null && around[i][0].constructor!=Player && around[i][0].constructor!=Monster){
					block = block + 1;
				}
				if (around[i][0]!=null && around[i][0].constructor==Player){
					this.dx = around[i][1];
					this.dy = around[i][2];
					break;
				}
				else if(around[i][0]==null){
					this.dx = around[i][1];
					this.dy = around[i][2];
					break;
				}
			}
		}
		if(block==4){
			this.dead=true;
		}
		
	}
}



// What we do at each tick of the clock
Monster.prototype.step=function(){ 
	// we may be dead, so we had better check if we should be removed from the stage
	// otherwise we should move
	if(this.dead==true){
		this.stage.removeActor(this.stage.getActor(this.x, this.y));
		alert("Monster killed");
	}
	else{
	this.move(this, this.dx, this.dy);
	}
}

// Move the way we wish to move. no one can push a monster around.
// return true if we moved, false otherwise
Monster.prototype.move=function(other){
	this.whereToGo();
	if(this.dead==true){
		return true;
	}
	var newx=this.x+this.dx;
	var newy=this.y+this.dy;
	if(!(other===this)){ return false; }
	if(this.stage.getActor(newx, newy)==null){
		this.stage.removeActor(this.stage.getActor(this.x, this.y));
		monster=new Monster(this.stage, newx, newy);
		monster.dx=this.dx;
		monster.dy=this.dy;
		this.stage.addActor(monster);
		return true;
	}
	
	else if(this.stage.getActor(newx, newy).constructor==Player){
		this.stage.removePlayer();
		this.stage.removeActor(this.stage.getActor(this.x, this.y));	
		this.stage.addActor(new Monster(this.stage, newx, newy));
		alert("You are Dead, Game Over!");
		return false;
	}
	
	//else if(this.stage.getActor(newx, newy).constructor==Monster || this.stage.getActor(newx, newy).constructor==ggMonster){
	//	this.move(this.stage.player, -dx, -dy);
	//}
}




