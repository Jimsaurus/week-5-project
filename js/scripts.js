// =============================================================================
// DECLARE GLOBAL APP OBJECT & playerObjs
// =============================================================================
var app = {};
app.player1Obj = {};
app.player2Obj = {};


//1. user 1 selects pokemon or presses random 
// =============================================================================
//GET POKEMON FUNCTION W DISPLAY POKEMON PASSED IN
// =============================================================================
app.getPokemon = function(){
	console.log('getPokemon fired!');
	$('.battle').fadeOut();
	// =============================================================================
	// SUBMIT BUTTON LISTENER
	// =============================================================================
	$('#poke-submit').on('click', function(e){
		//prevent page reload
		e.preventDefault();
		// fade out error if there is one
		$('.error').fadeOut();
		// assign the text in field to a variable
		app.userSelection = $('#poke-search').val().toLowerCase();
		// api call
		$.ajax({
			//grab the pokedex
			url: 'http://pokeapi.co/api/v1/pokedex/1',
			type: 'GET',
			dataType: 'json',
			success: function(result){
				console.log(result.pokemon);
				// loop through each pokemon
				app.selection = '';
				$.each(result.pokemon, function(index, value){
					//console.log(value.name + " " + value.resource_uri);
					// compare the pokedex name to the user input name
					if (value.name === app.userSelection){
						app.selection = value.resource_uri;
						console.log(app.selection);
						app.displayPokemon(app.selection);
					} 
				});
				// if there are no matches ask user to try again
				if (app.selection === ''){
					console.log('sorry! please try again!');
					$('.error').text('Try again').fadeIn();
				}
			}//ajax success function
		}); //ajax call
	}); // submit button listener

	// =============================================================================
	// random button listener
	// =============================================================================
	// WHEN RANDOM BUTTON IS PRESSED GET A RANDOM POKEMON W/ DISPLAY FUNCTION PASSED IN
	$('.random-pokemon').on('click', function(e){
		e.preventDefault();
		console.log('The Random Button Has Been Pressed...Capitals!');
		var randNum = Math.floor((Math.random()*718)+1);
		console.log(randNum);
		var randPokeUrl = 'http://pokeapi.co/api/v1/pokemon/' + randNum;
		console.log(randPokeUrl);
		// make a call
		$.ajax({
			url: randPokeUrl,
			type: 'GET',
			dataType: 'json',
			success: function(result){
				console.log(result);
				app.displayPokemon(result.resource_uri);
			} // success function
		}); // random ajax pokecall
	}); // random button listener
}; // get pokemon FUNCTION

// =============================================================================
// PLAYER SWITCH FUNCTION
// =============================================================================
// DECIDES WHICH SLOT THE DISPLAY POKEMON WRITES TO
app.playerSwitch = function(){
	//default to player 1
	app.selectedPlayer = 1;
	app.userSprite = '#user1Sprite';
	app.userName = '#user1Name';
	$('.player1').on('click', function(){
		app.selectedPlayer = 1;
		app.userSprite = '#user1Sprite';
		app.userName = '#user1Name';
		console.log(app.selectedPlayer);
		$('.player1').addClass('animated playerActive');
		$('.player2').removeClass('animated playerActive');
		$('#user2Sprite').removeClass('shake');
		$('#user1Sprite').addClass('shake');

	}); // end player1 click listener
	$('.player2').on('click', function(){
		app.selectedPlayer = 2;
		app.userSprite = '#user2Sprite';
		app.userName = '#user2Name';
		console.log(app.selectedPlayer);
		$('.player2').addClass('animated playerActive');
		$('.player1').removeClass('animated playerActive');
		$('#user1Sprite').removeClass('shake');
		$('#user2Sprite').addClass('shake');
	}); //end player2 click listener
}; // END PLAYER SWITCH FUNCTION

// =============================================================================
// 2. DISPLAY POKEMON ON THE SCREEN 
// =============================================================================
// GRABS THE STATS / IMAGE AND APPENDS THEM TO THE PAGE
app.displayPokemon = function(pokeUrl){
	$.ajax({
		url: 'http://pokeapi.co/' + pokeUrl,
		type: 'GET', 
		dataType: 'json',
		success: function(data){
			//display results to the page
			console.log(data);
			// change the picture
			var spriteUrl = 'http://pokeapi.co/media/img/' + data.national_id + '.png';
			$(app.userSprite).attr('src', spriteUrl).addClass('animated rotateInUpLeft');
			// change the name
			var pokeName = data.name;
			$(app.userName).text(pokeName);
			// add stats
			var hpStat = $('<p>').text('HP: ' + data.hp);
			var attackStat = $('<p>').text('Attack: ' + data.attack);
			var defenseStat = $('<p>').text('Defense: ' + data.defense);
			var speedStat = $('<p>').text('Speed: ' + data.speed);
			//var type = 0;
			var allStats = $('<div>').addClass('stats').append(hpStat, attackStat, defenseStat, speedStat);
			$(app.userName).append(allStats);

			//push resuts into playerObj =========================
			if (app.selectedPlayer === 1){
				app.player1Obj = {
					name: pokeName,
					sprite: spriteUrl,
					hp: data.hp,
					attack: data.attack,
					defense: data.defense, 
					speed: data.speed
				}
			}else{
				app.player2Obj = {
					name: pokeName,
					sprite: spriteUrl,
					hp: data.hp,
					attack: data.attack,
					defense: data.defense, 
					speed: data.speed
				} //player 2 obj
			}
		} // end of success function
	}); // end of api call for specific pokemon info
} // DISPLAY POKEMON FUNCTION 

//4. pokemon battle
// =============================================================================
//	LISTEN FOR READY BUTTON CLICK
// =============================================================================
$('.ready').on('click', function(){
	console.log('Battle button pressed');
	$('.battle').fadeIn();
	//check there are 2 players with jquery method 
	if ($.isEmptyObject(app.player1Obj) || $.isEmptyObject(app.player2Obj)) {
		console.log('Please select 2 pocket monsters to battle!');
	} else{ //else lets battle!
		//push pokemonOBJs into battle screen
		app.displayBattle(app.player1Obj, app.player2Obj);
		//scroll page down to battle
	    $('html, body').animate({
	        scrollTop: $('.battle').offset().top
	    }, 1000);
		//run battle function and return winner
		app.battle(app.player1Obj, app.player2Obj);
		
	}
}); // 	battle button listener


// =============================================================================
// DISPLAY BATTLE SCENE 
// =============================================================================
app.displayBattle = function(player1, player2){
	console.log('displayBattle function RUNNING!');
	// player 1 display
	//name
	$('.p1-name').text(player1.name);
	//HP
	$('.battle-p1 .stat-bottom span').text(player1.hp + "/" + player1.hp);
	//sprite
	$('.battle-p1 .poke-sprite').attr('src', player1.sprite).addClass('animated bounceInUp');
	// player 2 display
	//name
	$('.p2-name').text(player2.name);
	//HP
	$('.battle-p2 .stat-bottom span').text(player2.hp + "/" + player2.hp);
	//sprite
	$('.battle-p2 .poke-sprite').attr('src', player2.sprite).addClass('animated rollIn');
}; // displayBattle function



// =============================================================================
// BATTLE LOGIC FUNCTION
// =============================================================================
app.battle = function(player1, player2){
	console.log('Battle function IS GO!');
	console.log(player1.hp, player2.hp);
	// declare variables 
	var roundNum = 0;
	var whoFirst = '';
	var attack1 = '';
	var attack2 = '';
	var dead = '';
	var p1MaxHP = player1.hp;
	var p2MaxHP = player2.hp;
	// NEXT ROUND LISTENER
	$('.next-round').on('click', function(){
		console.log(player1.hp, player2.hp);
		// if either player HP below 0
		if ((player1.hp <= 0)  ||   (player2.hp <= 0)) {
			//check who has highest HP and return the winning obj
			if (player1.hp > player2.hp) {
				//take winner variable and put it into the display winner function
				app.displayWinner(player1);
			} else{
				app.displayWinner(player2);
			}
		}else{
			console.log('battle loop fired');
			//clear battle-log
			$('.battle-log').text('');
			//increment round number
			roundNum++;
			//display round number
			$('.round-counter').text('Round #' + roundNum);
			console.log('Battle round: ' + roundNum);
			//check who is faster and let them attack first
			if (player1.speed >= player2.speed) {
				//log resutls to the screen
				whoFirst = $('<p>').text(player1.name + ' is faster and attacks first!');
				$('.battle-p1 .poke-sprite').removeClass('bounceInUp').addClass('bounce');
				player2.hp = player2.hp - player1.attack + (player2.defense/2);
				//attack 1 log to screen
				attack1 = $('<p>').text(player1.name + " attacks " + player2.name + " for " + (player1.attack - (player2.defense/2)) + " damage!");
				//2nd attack
				player1.hp = player1.hp - player2.attack + (player1.defense/2);
				//attack 2 log to screen
				attack2 = $('<p>').text(player2.name + " attacks " + player1.name + " for " + (player2.attack - (player1.defense/2)) + " damage!");
				
			} else{
				//log resutls to the screen
				whoFirst = $('<p>').text(player2.name + ' is faster and attacks first!');
				$('.battle-p2 .poke-sprite').removeClass('rollIn').addClass('bounce');
				player1.hp = player1.hp - player2.attack + (player1.defense/2);
				//attack 1 log to screen
				attack1 = $('<p>').text(player2.name + " attacks " + player1.name + " for " + (player2.attack - (player1.defense/2)) + " damage!");
				//2nd attack
				player2.hp = player2.hp - player1.attack + (player2.defense/2);
				//attack 2 log to screen
				attack2 = $('<p>').text(player1.name + " attacks " + player2.name + " for " + (player1.attack - (player2.defense/2)) + " damage!");
			}
			
			$('.battle-log').append(whoFirst, attack1, attack2);
			console.log(player1.hp, player2.hp);
			//check for death
			if (player1.hp <= 0) {
				player1.hp = 0;
				dead = $('<p>').text(player1.name + ' got hurt and fainted!');
				//rotate when dead not working
				$('.battle-p1 .poke-sprite').removeClass('bounceInUp bounce').addClass('rollOut');

			} 
			if (player2.hp <= 0) {
				player2.hp = 0;
				dead = $('<p>').text(player2.name + ' got hurt and fainted!');
				//rotate when dead not working
				$('.battle-p2 .poke-sprite').removeClass('bounce rollIn').addClass('rollOut');
			}
			$('.battle-log').append(dead);
			//update hp totals
			$('.battle-p1 span').text(player1.hp + "/" + p1MaxHP);
			//update hp totals
			$('.battle-p2 span').text(player2.hp + "/" + p2MaxHP);


		}// end else
	}); //ROUND LISTENER

} // END BATTLE FUNCTION

//5. winner is declared
// =============================================================================
// DISPLAY WINNER FUNCTION 
// =============================================================================
app.displayWinner = function(winner){
	//log the winners name
	console.log(winner.name);
	//winner modal
	$('.modal-container').addClass('show');
	//enter winner details
	//winner name
	$('.winner-name').text(winner.name);
	//winner sprite
	$('.modal img').attr('src', winner.sprite);
	//close modal
	$('.close-button').on('click', function(){
		$('.modal-container').removeClass('show');
	});

	//RESTART LISTENER
	$('.modal-new').on('click', function(){
		//close the modal
		$('.modal-container').removeClass('show');
		//scroll page up to selection screen
	    $('html, body').animate({
	        scrollTop: $('main').offset().top
	    }, 1000);

	    //reset player objects
	    app.player1Obj = {};
	    app.player2Obj = {};
	    //reset placeholder image
	    $('#user1Sprite').attr('src', 'assets/pokeball-flat.png');
	    $('#user2Sprite').attr('src', 'assets/pokeball-flat.png');
	    $('#user1Name').text('Player 1');
	    $('#user2Name').text('Player 2');
	    $('.stats').text('');
	    $('.battle').fadeOut(1100);
	    $('.battle-log').text('');
	    //$('.winner-name').text('Winner Name!');
	    //$('modal img').attr('src', 'assets/pokemon.png');
	});
}; // display winner function 

	


// =============================================================================
// INIT FUNCTION
// =============================================================================
app.init = function(){
	app.playerSwitch();
	app.getPokemon();
};

// =============================================================================
// DOC READY RUN app.init()
// =============================================================================
$(function(){
	console.log('document ready!');
	app.init();
});









