var savedImagesJ;
var savedImagesL;
var length;
var currentImage;

$(document).ready(async function () {
    //console.log('DOM fully loaded'); 
    savedImagesJ = loadLocal("savedImagesJ");
    savedImagesL = loadLocal("savedImagesL"); 
    currentImage = Number(localStorage.getItem("currentImage")) || 0;
    
    buildDom();
});

function buildDom() {
    $('#mainPageButton').click(function(){
        window.location.href = "index.html";
    });
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