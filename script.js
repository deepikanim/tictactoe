$(function(){
    const winningCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    const cells =  $("#container").children("div");
    const emptyCells = () => cells.filter(':empty');
    const areSame = (arr) => arr.every(item => item.innerText === arr[0].innerText && item.innerText !== ''); 
  
    const takeTurn = (element, letter) => {
        if(!element.innerText)
        {
            element.innerText = letter;
            return true;
        }
        else{
            alert("the cell is not empty. try again.");
            return false;
        }
       
    };

    const computerChoice = () => emptyCells()[Math.floor(Math.random()*emptyCells().length)];
    

    const endGame = (winningSequence) => { 
        if(winningSequence)
            winningSequence.forEach(el => el.classList.add('winner'));
        cells.unbind('click');
    };

    const won = () =>{
        let win = false;  
    
        winningCombos.forEach(c => {   
            const sequence = [ cells[c[0]],  cells[c[1]],  cells[c[2]]];
            if(areSame(sequence))
            {
                win = true;
                endGame(sequence);
            }
        });
    
        return win;
    }
    
    const computerTurn = () =>{
        cells.unbind('click');
        setTimeout(() => {
            takeTurn(computerChoice(), 'o');

            if(!won() && emptyCells().length)
            {
                cells.bind('click',clickFunction);
            }
            else{
                endGame(); //draw
            }         
        
        }, 1000);     
        
    }

    const clickFunction = (event) => { 
        if(takeTurn(event.target, 'x'))
        {     
            if(!won() && emptyCells().length)
            {
                computerTurn();
            }
            else{
                endGame(); //draw
            }
        }      
              
    };
       
    $("#container").children("div").on("click", clickFunction);     
 
});


