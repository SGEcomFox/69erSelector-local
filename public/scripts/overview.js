var savedImagesJ;
var savedImagesL;
var length;
var currentImage;
var selectedImages = [];
var activeId;

$(document).ready(async function () {
    //console.log('DOM fully loaded'); 
    savedImagesJ = loadLocal("savedImagesJ");
    console.log(savedImagesJ);
    savedImagesL = loadLocal("savedImagesL"); 
    currentImage = Number(localStorage.getItem("currentImage")) || 0;
    
    buildDom();
});

function buildDom() {
    $('#mainPageButton').click(function(){
        window.location.href = "index.html";
    });
    $('#janikButton').html("Janik | "+savedImagesJ.length);
    $('#lukasButton').html("Lukas | "+savedImagesL.length);
    $('#janikButton').click(function() {
        buildCollage(savedImagesJ, "j")});
    $('#lukasButton').click(function() {
        buildCollage(savedImagesL, "l")});
    $('.collageZone').on('click', '.collageImage', function() {
        imageSelect(this.id);
    });
    $('#deleteButton').click(function() {
        deleteSelected(activeId);
    })
    $('#startButton').click(function() {
        startGame(savedImagesJ,savedImagesL)
    })
    checkStartCondition();  
}

function storeLocal(arrayName, array) {
    const jsonArray = JSON.stringify(array);    
    localStorage.setItem(arrayName, jsonArray);
    console.log(arrayName+" saved to local Storage");
    console.log(array);
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

function buildCollage(array, newActive) {
    activeId = newActive;
    $('.collageZone').find('img').remove();
    $('#deleteButton').css('display', 'none'); 
    for(let i=0; i<array.length; i++) {
        let img = $('<img>', {
            src: array[i],
            id: "img"+i.toString(),
            class: "collageImage"
        });
        let targetZone = '#collageZone' + ((i % 3) + 1); // This will cycle between 1, 2, and 3
        $(targetZone).append(img);    
    }
}

function imageSelect(element) { 
    // visual part 
    $('#' + element).toggleClass('selected');
    if ($('.selected').length > 0) {
        $('#deleteButton').css('display', 'block');
    } else {
        $('#deleteButton').css('display', 'none');
    }
    //array control
    let imgSrc = $('#' + element).attr('src');
    if (selectedImages.includes(imgSrc)) {
        selectedImages = selectedImages.filter(src => src !== imgSrc);
        console.log(selectedImages);
    } else {
        selectedImages.push(imgSrc);
        console.log(selectedImages);
    }    
}
function checkStartCondition() {
    if(savedImagesJ.length == savedImagesL.length && savedImagesJ.length % 2 === 0 && savedImagesJ.length>0) {
        $('#startButton').css("display", "block");
    } else {
        $('#startButton').css("display", "none");
    }
}

function deleteSelected(id) {
    if(id === "j") {
        savedImagesJ = savedImagesJ.filter(item => !selectedImages.includes(item)); 
        storeLocal("savedImagesJ", savedImagesJ);
        buildCollage(savedImagesJ, "j");
        $('#janikButton').html("Janik | "+savedImagesJ.length);
    }
    if(id === "l") {
        savedImagesL = savedImagesL.filter(item => !selectedImages.includes(item));
        storeLocal("savedImagesL", savedImagesL);
        buildCollage(savedImagesL, "l")
        $('#lukasButton').html("Lukas | "+savedImagesL.length);  
    }   
    selectedImages = selectedImages.filter(item => savedImagesJ.includes(item) || savedImagesL.includes(item)); 
    checkStartCondition();  
}

function startGame() {
    window.location.href = "game.html";    
}
