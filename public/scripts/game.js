var savedImagesJ;
var savedImagesL;
var winnerJ = [];
var winnerL = [];
var activeJoker = [];
var activePlayer;
var activePlayerArray = [];
var activeArray = [];
var activeWinner = [];
var currentImage = 0;
let onKeyPress;
let roundOf;

$(document).ready(async function () {
    savedImagesJ = loadLocal("savedImagesJ");
    savedImagesL = loadLocal("savedImagesL");
    if (savedImagesJ.length > 0 && savedImagesL.length > 0) {
        activePlayer = "Janik";
        activePlayerArray = savedImagesJ;
        buildDom();
        startGame();
    } else {
        console.error("Error: Images arrays are empty. Please check localStorage.");
    }
});

function buildDom() {
    $(document).on("keyup", function( event ) {
        switch (event.which) {
            case 37: updateCurrentImage("left"); break;
            case 39: updateCurrentImage("right"); break;
        }
    });
    $('#jokerButton').click(function(){
        startJokerRound();
    })
    $('#advanceButton').click(function(){
        savedImagesJ = [...winnerJ];  // Ensure a copy is made, not a reference
        savedImagesL = [...winnerL];
        winnerJ = [];  // Reset winners for next round
        winnerL = [];
        startRound();
    })
}

function loadLocal(name) {
    let array = localStorage.getItem(name);
    if (array) {  
        return JSON.parse(array);
    } else {
        // If no item is found, return an empty array (or handle as needed)
        console.error("No data found for key:", name);
        return [];
    }    
}

//function to shuffle an array
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    //while there are Elements remaining
    while (currentIndex != 0) {
        // pick a random element
        randomIndex = Math.floor(Math.random()*currentIndex);
        currentIndex--;
        //swap random and current element	
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array
}

function updateCurrentImage(value) {
    if (value === "left") {    
        currentImage = (currentImage > 0) ? currentImage - 1 : activeArray.length - 1;
    } 
    if (value === "right") {        
        currentImage = (currentImage + 1) % activeArray.length;        
    }
    changeImage(activeArray[currentImage]);
}

function changeImage(url) {
    $('#mainImage').attr('src', url);    
}

async function startGame() {
    startRound()  
}

async function startRound() {
    $('#advanceButton').css('display', 'none');
    roundOf = roundOf = activePlayerArray.slice();
    shuffleArray(activePlayerArray);
    shuffleArray(savedImagesJ);
    shuffleArray(savedImagesL);
    updateLabel(roundOf.length);
    activeWinner = [];
    winnerJ = [];
    winnerL = [];
    let i = 0;
    while(savedImagesJ.length > winnerJ.length && savedImagesL.length > winnerL.length) {
        await startDuel(i);
        changeActivePlayer();
        await startDuel(i);
        changeActivePlayer();
        i++
    }
    if(winnerJ.length %2 == 0 && winnerL.length %2 == 0) {
        savedImagesJ = winnerJ;
        savedImagesL = winnerL;
        $('#advanceButton').css('display', 'block');
    } else if(savedImagesJ.length == 1 && savedImagesL.length == 1){
        console.log("finished")
        window.location.href = "index.html";
    } else {
        $('#jokerButton').css('display', 'block');       
    }
}

async function startDuel(i) {
    activeArray = [activePlayerArray[i],activePlayerArray[i+1]];
    currentImage=0;
    changeImage(activeArray[0]);
    const winner = await waitForEnter();
    updateArrays(winner);
    return
}

async function startJokerRound() {
    $('#jokerButton').css('display', 'none');
    while(winnerJ.length %2 != 0 || winnerL.length %2 != 0){
        await startJokerDuel();
        changeActivePlayerJoker();
        await startJokerDuel();
        changeActivePlayerJoker();
    }
    $('#advanceButton').css('display', 'block');
} 

async function startJokerDuel() {
    activeArray = activePlayerArray;
    currentImage = 0;
    changeImage(activeArray[0]);
    updateLabel("Joker");
    const winner = await waitForEnter();
    updateJoker(winner);
    return;
}

function changeActivePlayerJoker() {
    if(activePlayer === "Janik") {   
        winnerJ = activeWinner;
        savedImagesJ = winnerJ;
        activePlayer = "Lukas";
        activePlayerArray = savedImagesL;
        activeWinner = winnerL;
    } else if (activePlayer === "Lukas") {
        winnerL = activeWinner;
        savedImagesL = winnerL;
        activePlayer = "Janik";
        activePlayerArray = savedImagesJ;
        activeWinner = winnerJ;
    }
    updateLabel("Joker");
}

function changeActivePlayer() {
    if(activePlayer === "Janik") {
        savedImagesJ = activePlayerArray;
        winnerJ = activeWinner;
        activePlayer = "Lukas";
        activePlayerArray = savedImagesL;
        activeWinner = winnerL;
    } else if (activePlayer === "Lukas") {
        savedImagesL = activePlayerArray;
        winnerL = activeWinner;
        activePlayer = "Janik";
        activePlayerArray = savedImagesJ;
        activeWinner = winnerJ;
    }
    updateLabel(roundOf.length);
}
function updateArrays(element) {
    activeWinner.push(element);    
    // Find the index of the element
    const index = activePlayerArray.indexOf(element);    
    // If the element exists, remove it using splice
    if (index !== -1) {
        activePlayerArray.splice(index, 1);
    }
    return;
}

function updateJoker(element) {
    activeWinner.push(element);
    return
}

function waitForEnter() {
    return new Promise((resolve) => {
        onKeyPress = function(event) {
            if (event.key === "Enter") {
                document.removeEventListener("keydown", onKeyPress);

                // Get the src of the image element
                const imageElement = document.getElementById("mainImage");
                const imageSrc = imageElement ? imageElement.src : null;

                resolve(imageSrc); // Resolve with image src
            }
        };
        document.addEventListener("keydown", onKeyPress);
    });
}

function updateLabel(inputCase) {
    switch (inputCase) {
        case 2: msg="Finale "+activePlayer; break;
        case 4: msg="Halbfinale "+activePlayer; break;
        case 8: msg="Viertefinale "+activePlayer; break;
        case 16: msg="Achtefinale "+activePlayer; break;
        case "Joker": msg="Joker "+activePlayer; break;  
        default: msg="Round of "+inputCase+" "+activePlayer   
    }
    $('#activeRound').html(msg);
};    


