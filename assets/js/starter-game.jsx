import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}
class Starter extends React.Component {
  constructor(props) {
    super(props);
    let creCards = this.createCards();
    this.state = { 
      cards: creCards,
      firstCardID: null,
      secondCardID: null,
      listOfCards: ["A","B","C","D","E","F","G","H"],
      score: 0
    };
    this.createCards = this.createCards.bind(this);
    this.checkCards = this.checkCards.bind(this);
    this.disableAll = this.disableAll.bind(this);
    this.enableAll = this.enableAll.bind(this);
    this.createCards = this.createCards.bind(this);
    this.shuffleCard = this.shuffleCard.bind(this);
    this.restart = this.restart.bind(this);
    this.returnElement = this.returnElement.bind(this);
    this.renderCards = this.renderCards.bind(this);
  }

  /*
  This function is used to create a grid of 4*4 16 buttons with values ranging from A to H.
  Each button is created as a column and added to an array.
  Then 4 rows are created and the array containing the columns is sliced by 4 each time and added to the row to get the 4*4 grid.

  */
  createCards(){
    let values = ["A","B","C","D","E","F","G","H"];
    let cards = [];
    for(let i=0; i< 16; i++){
        cards.push(<div className="column" key ={i}><button id={i} value={values[i%8]} onClick={this.evaluate.bind(this)} disabled={false}>Click</button></div>);
    }
    cards = this.shuffleCard(cards);
    return cards;
  }

  //Attribution: Durtenfeld Shuffle algorithm.
  /*
  This is the function that takes the cards created in createCards function and shuffles them. Returns a new array.
  */
  shuffleCard(cards){
    for (var i = cards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = cards[i];
      cards[i] = cards[j];
      cards[j] = temp;
    }
    return cards;
  }

  renderCards(){
    let cards = this.state.cards;
    let cardsView = [];
    let j = 0;
    for(let i=0; i< 4; i++){
      cardsView.push(<div className="row" key={i}>{cards.slice(j, (j+4))}</div>);
      j = j+4;
    }
    return cardsView;
  }

  /*
  This function is used to disable all buttons except the restart button.
  */
  disableAll(){
    $('button').each(function(){
      if(this.innerHTML != "Restart Game!"){
        this.disabled = true;
      }
    });
  }

  /*
  This function is used to enable all buttons that have their inner HTML set to Click.
  */
  enableAll(){
    $('button').each(function(){
      if(this.innerHTML === "Click"){
        this.disabled = false;
      }
    });
  }

  /*
  This function is called on click on the buttons in the grid.
  It checks if the button clicked is the first card that is flipped.
  If it is, it flips the card to display the value and disable it so that user does not click on it again. Also, updates the state object.
  If it is the second card that is clicked, then it disables all the buttons so that no button is clicked at this point.
  It sets the state object, displays the value of the card and calls checkCards function after a delay of 1ms.
  */
  evaluate(ev){
    let id = ev.target.id;
    let cards = this.state.cards;
    let res = this.returnElement(id);
    cards[res[1]] = <div className="column" key ={res[0].key}><button id={res[0].key} value={res[2]} onClick={this.evaluate.bind(this)} disabled={true}>{res[2]}</button></div>;
    if(this.state.firstCardID === null){
      let state1 = _.extend(this.state, {cards: cards, firstCardID: id});
      this.setState(state1);
    }
    else{
      this.disableAll();
      let state2 = _.extend(this.state, {cards: cards, secondCardID: id});
      this.setState(state2);
      setTimeout(() => {
        this.checkCards();
      }, 1000);
    }
  }

  /*
  This function is used to restart the game at any given point. It reloads the page so that state object can be set to initial state.
  */
  restart(){
    window.location.reload(false);
  }

  /*
  This function is used to validate if the two cards clicked match.
  It checks if the card values are equal. It adds the points to the score and pops the value from the state object. It also enables all the buttons
  and disables the two matched buttons so that user doesn'y click on them again. State object is updated so that user can select a new card again.
  If the cards do not match, 10 points is deducted an dthe state object
  is updated so that user can select a new card again.
  */
  checkCards(){
    let score = this.state.score;

    let cards1 = this.state.cards;
    let res = this.returnElement(this.state.firstCardID);
    let res1 = this.returnElement(this.state.secondCardID);

    if(res[2] === res1[2]){

      let cards = this.state.listOfCards;
      score += 100;
      cards.pop(res[2]);
      this.enableAll();
      cards1[res[1]] = <div className="column" key ={res[0].key}><button id={res[0].key} value={res[2]} onClick={this.evaluate.bind(this)} disabled={true}>{res[2]}</button></div>;
      cards1[res1[1]] = <div className="column" key ={res1[0].key}><button id={res1[0].key} value={res1[2]} onClick={this.evaluate.bind(this)} disabled={true}>{res1[2]}</button></div>;
      let state1 = _.extend(this.state, {cards: cards1, firstCardID:null, secondCardID:null, listOfCards: cards, score: score});
      this.setState(state1);
    }
    else{
      cards1[res[1]] = <div className="column" key ={res[0].key}><button id={res[0].key} value={res[2]} onClick={this.evaluate.bind(this)} disabled={false}>Click</button></div>;
      cards1[res1[1]] = <div className="column" key ={res1[0].key}><button id={res1[0].key} value={res1[2]} onClick={this.evaluate.bind(this)} disabled={false}>Click</button></div>;
      this.enableAll();
      score -= 10;
      let state1 = _.extend(this.state, {cards: cards1, firstCardID: null, secondCardID: null, score:score});
      this.setState(state1);
    }
  }

  returnElement(val){
    let cards = this.state.cards;
    let found = cards.find((element) => {
      return element.key === val;
    });
    let index = cards.indexOf(found);
    let value = found.props.children.props.value;
    return [found, index, value];
  }

  /*
  This is the render function to display the different components required for this game.
  */
  render() {
    
    let score = "Your score so far: " + this.state.score;
    return(
      <div className="container">
        <HeaderComponent />
        <RulesComponent />
        <div className="row">
          <DisplayScoreComponent root={this} />
        </div>
        <div className="row">
          <p>{score}</p>
        </div>
          {this.renderCards()}
        <div className="row">
          <div className="column column-25 column-offset-25">
            <button className="button button-outline" onClick={this.restart}>Restart Game!</button>
          </div>
        </div>
      </div>
    );
  }
}

/*
This is the presentational component for displaying the header of the game.
*/

function HeaderComponent(){
	return(
		<div className="row">
		   <div className="column column-offset-25">
		      <p><strong>Memory Game- Flip the cards</strong></p>
		   </div>
		</div>
	);
}

/*
This is the presentational component for displaying the rules of the game.
*/

function RulesComponent(){
  return(
		<div className="row">
		   <div className="column">
		      <ul>
		         <li>You start with 16 cards with 8 identical pairs. Click on any card and the value of that card is revealed.</li>
             <li>Try to match the card with its twin. If the cards match, you gain 100 points, else you lose 10 points and the cards get flipped back.</li>
             <li>You win once all the cards are revealed and matched. You can restart the game at any point in time by clicking on Restart Game button at the bottom.</li>
             <li><small><em>HINT: Try to memorise the cards as you flip</em></small></li>
		      </ul>
		   </div>
		</div>
  );
}

/*
This is the presentational component for displaying the score of the current game.
*/

function DisplayScoreComponent(params){
  let root = params.root;
  let displayVal = "Cards to go: " + root.state.listOfCards.length;
  if(root.state.listOfCards.length === 0){
    displayVal = "You Win!";
  }
  return(
    <p><strong>{displayVal}</strong></p>
  );
}


