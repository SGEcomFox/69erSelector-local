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

function updateLocal(id, array) {
    const jsonArray = JSON.stringify(array);    
    
    if(id === "j") {
        localStorage.setItem("savedImagesJ", jsonArray);
    }
    if(id === "l") { 
        localStorage.setItem("savedImagesL", jsonArray);
    } 
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
    $('#dialogBox').empty();
    $('#addButton').length > 0 && $('#addButton').remove();
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
    let plusImg = $('<img>', {
        src: './ressources/plusIcon.png',
        id: "addButton",
        class: "addButton"
    });
    let targetZone = '#collageZone' + ((array.length % 3) + 1); // Continue cycling to the next zone
    $(targetZone).append(plusImg);
    $('#addButton').click(function() {
        addImage(array)
    });
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
    console.log("trying to delete")
    if(id === "j") {
        savedImagesJ = savedImagesJ.filter(item => !selectedImages.includes(item)); 
        storeLocal("savedImagesJ", savedImagesJ);
        buildCollage(savedImagesJ, "j");
        $('#janikButton').html("Janik | "+savedImagesJ.length);
    }
    if(id === "l") {
        console.log("l")
        savedImagesL = savedImagesL.filter(item => !selectedImages.includes(item));
        storeLocal("savedImagesL", savedImagesL);
        buildCollage(savedImagesL, "l")
        $('#lukasButton').html("Lukas | "+savedImagesL.length);  
    }  
    console.log("failed") 
    selectedImages = selectedImages.filter(item => savedImagesJ.includes(item) || savedImagesL.includes(item)); 
    checkStartCondition();  
}

$('#addButton').click(function() {
    addImage(array);
});

function addImage(array) {
    $('#dialogBox').empty();
    // Create the input field and submit button
    let inputField = $('<input>', {
        type: 'text',
        id: 'urlInput',
        placeholder: 'Enter image URL'
    });

    let submitButton = $('<button>', {
        text: 'Add Image',
        id: 'submitButton'
    });

    // Show the dialog box with the input field and button
    $('#dialogBox').css('opacity', '100%');
    $('#dialogBoxText').text('Enter the image URL:');
    $('#dialogBox').append(inputField, submitButton);

    // Handle the submit button click event
    submitButton.click(function() {
        let imageUrl = inputField.val(); // Get the URL entered by the user
        if (array.includes(imageUrl)) {
            alert('This image is already in the collage!');
            return;
        }
        if (imageUrl) {
            // Add the URL to the array
            array.push(imageUrl);
            updateLocal(activeId, array);
            // Call buildCollage to update the collage
            buildCollage(array);

            // Clear the input field and hide the dialog box
            inputField.val('');

            // Remove the input field and submit button after submission
            inputField.remove();
            submitButton.remove();
        } else {
            alert('Please enter a valid URL.');
        }
        $('#dialogBox').css('opacity', '0');
        $('#dialogBox').empty();
    });

}

function startGame() {
    window.location.href = "game.html";    
}
