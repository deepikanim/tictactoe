$(function(){

     /** @global */
    window.size = 0;
    window.ticTacToeMatrix  = [[]];
    const emptyCells = () =>  $(".square").filter(':empty');
    let result = {
        WIN: 1,
        DRAW: 2,
        SIZE_ERROR: 3,
        SQUARE_NON_EMPTY: 4
    }

    /**
     * Invoked when "new game" button is clicked
     */
    $("#btn-game-start").click(function(){

        initializeGameBoard();       

        //validate input size. Valid input is a 'number' greater than or equal to 3 and less than or equal to 100
        let inputSize = $("#size").val()
        if(!inputSize || inputSize < 3 || inputSize > 100)
        {
           showResult(result.SIZE_ERROR)
            return;
        }   
        
        window.size = inputSize;
        window.ticTacToeMatrix  = [[]];

        //add one div for each row
        for (let i = 0; i < window.size; i++) {

            let $row = $("<div />", {
                class: 'divTableRow',
            });

            //add div with class=square for each cell in row. e.g. for 3*3 => rows = 3 and every row will have 3 cells.
            for (let j = 0; j < window.size; j++) {

                let $square = $("<div />", {
                    class: 'square'
                });

                //add id, row, col attributes to each square div
                $square.attr('id', "square" + i + j);
                $square.attr('row', i);
                $square.attr('col', j);

                $row.append($square);
            }
            $("#container").append($row);
        }

       $(".square").bind("click", humanTurn);
    });

     /**
     * Set game board to initial state
     */
    const initializeGameBoard = () => {
        //hide any results shown from previous games
        $("#result").empty(); 
        $("#result").hide();    
               
        //remove contents of container div before adding any content
        $("#container").empty();   
    }
  
    /**
     * make move for human or computer
     * @param  {Number} row     row of square clicked
     * @param  {Number} col     column of square clicked
     * @param  {String} player  player's move i.e 'x' for human, 'o' for computer
     * @return {Boolean}        true ==> win or draw
     *                          false ==> continue playing
     */
    const move = (row, col, player) => {      

        let winningSequence = [];

        //if row does not exist in matrix yet then create one
        if(!window.ticTacToeMatrix[row])
        {
            window.ticTacToeMatrix[row] = [];
        }
        window.ticTacToeMatrix[row][col] = player;
 
        //check row
        let win = true;
        for(let i = 0; i < window.size; i++){

            winningSequence.push($("#square" + row + i));

            if(window.ticTacToeMatrix[row][i] !== player){
                win = false;
                break;
            }
        }

        if(win) 
        {
            showResult(result.WIN, winningSequence, player);
            return win;
        }
            
        //check column
        win = true;
        winningSequence = [];
        for(let i = 0; i < window.size; i++){
            if(!window.ticTacToeMatrix[i])
            {
                win = false;
                break;
            }
            winningSequence.push($("#square" + i + col));
            if(window.ticTacToeMatrix[i][col] !== player){
                win = false;
                break;
            }
        }    
       
        if(win) 
        {
            showResult(result.WIN, winningSequence, player);
            return win;
        }
    
        //check back diagonal
        win = true;
        winningSequence = [];
        for(let i = 0; i < window.size; i++){
            if(!window.ticTacToeMatrix[i])
            {
                win = false;
                break;
            }
            winningSequence.push($("#square" + i + i));
            if(window.ticTacToeMatrix[i][i] !== player){
                win = false;
                break;
            }
        }    
       
        if(win) 
        {
            showResult(result.WIN, winningSequence, player);
            return win;
        }
     
        //check forward diagonal
        win = true;
        winningSequence = [];
        for(let i = 0; i < window.size; i++){
            if(!window.ticTacToeMatrix[i])
            {
                win = false;
                break;
            }
            winningSequence.push($("#square" + i + (window.size - i - 1)));
            if(window.ticTacToeMatrix[i][window.size - i - 1] !== player){
                win = false;
                break;
            }
        }     
     
        if(win) 
        {
            showResult(result.WIN, winningSequence, player);
            return win;
        }   
        
        //draw
        if(emptyCells().length === 0)
        {
            showResult(result.DRAW);
            return true;
        }
        
        return false;
    }     

    /**
     * show game result or error message
     * @param  {Enum}    type       result (WIN: 1, DRAW: 2, SIZE_ERROR: 3, SQUARE_NON_EMPTY: 4)
     * @param  {Array}   sequence   array of ids of cells in winning sequence
     * @param  {String}  player     player's move i.e 'x' for human, 'o' for computer
     */
    const showResult = (type, sequence, player) => {
        switch(type) {
            case result.WIN:
                if(sequence && player){
                    $.each(sequence, function(){ 
                        $(this).css('color', 'red')
                    });
                    $("#result").html("<span class='resultText'>"+ player + " wins!!</span>");
                }
              break;

            case result.DRAW:
                $("#result").html("<span class='resultText'>draw!!</span>");
              break;

            case result.SIZE_ERROR:
                $("#result").html("<span class='resultText'>enter size and try again!!</span>");
                break;
            case result.SQUARE_NON_EMPTY:
                    $("#result").html("<span class='resultText'>non empty. try again!!</span>");
                    break;
        }
        $("#result").show();
     
    }

     /**
     * Remove all event listeners from cells after win or draw. 
     */
    const endGame = () => {
        $('.square').unbind("click");      
    }

    /**
     * Randomly determines computer's selection
     * @return {Element} any randomly chosen empty div
     */
    const computerChoice = function(){
        let empty = emptyCells();
        let random = Math.random()*emptyCells().length;
        let index = Math.floor(random);
        let choice = empty[index];    
        return choice;
    };
    
    /**
     * Makes computer's play
     */
    const computerTurn = () =>{
        //remove click event from all square divs to prevent human from playing
        $('.square').unbind("click");

        setTimeout(() => {
            var square = computerChoice();
            square.innerText = 'o';
    
            let row = Number($(square).attr('row'));
            let col = Number($(square).attr('col'));
            
            if(!move(row, col, 'o')) 
            {
                //enable click event to let human take turn
                $('.square').bind("click", humanTurn);
            }     
            else{
                endGame();
            }    
        
        }, 1000);     
        
    }

    /**
     * Makes human's play
     * @param  {Event} event click event from the div clicked
     */
    const humanTurn = (event) => { 
        $("#result").empty(); 
        $("#result").hide();  

        var square = event.target;

        //if the square clicked already has an 'x' then show error message
        if(square.innerText)
        {
            showResult(result.SQUARE_NON_EMPTY);
            return;
        }
        square.innerText = 'x';

        let row = Number($(square).attr('row'));
        let col = Number($(square).attr('col'));

        if(!move(row, col, 'x')){
            computerTurn();
        }
        else{
            endGame();
        }              
    };
       
 
});


