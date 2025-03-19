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
    console.log(savedImagesJ.length, savedImagesL.length)
    while(savedImagesJ.length>0 && savedImagesL.length>0) {
        await startRound()
    }    
}

async function startRound() {
    
    winnerJ = [];
    winnerL = [];
    let i = 0;
    while(savedImagesJ.length > winnerJ.length && savedImagesL.length > winnerL.length) {
        await startDuel(i);
        changeActivePlayer();
        await startDuel(i);
        changeActivePlayer();
        console.log(savedImagesJ.length+"J")
        console.log(winnerJ.length+"jWinner")
        console.log(savedImagesL.length+"L")
        console.log(winnerL.length+"lWinner")
        i++
    }
    console.log("loop broken");
    if(winnerJ.length %2 == 0 && winnerL.length %2 == 0) {
        return
    } else {
        startJokerRound();
    }
    savedImagesJ = winnerJ;
    savedImagesL = winnerL;
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
    while(winnerJ.length %2 == 0 && winnerL.length %2 == 0){
        await startJokerDuel();
        changeActivePlayer();
        await startJokerDuel();
        changeActivePlayer();
    }
}

async function startJokerDuel() {
    activeArray = activePlayerArray;
    currentImage=0;
    changeImage(activeArray[0]);
    const winner = await waitForEnter();
    updateJoker(winner);
    return
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
        function onKeyPress(event) {
            if (event.key === "Enter") {
                document.removeEventListener("keydown", onKeyPress);
                
                // Get the src of the image element
                const imageElement = document.getElementById("mainImage");
                const imageSrc = imageElement ? imageElement.src : null;

                resolve(imageSrc); // Resolve with image src
            }
        }
        document.addEventListener("keydown", onKeyPress);
    });
}
