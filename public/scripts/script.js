var currentImage;
var length;
var bookmarks;
var savedImagesJ;
var savedImagesL;


$(document).ready(async function () {
    //console.log('DOM fully loaded'); 
    savedImagesJ = loadLocal("savedImagesJ");
    savedImagesL = loadLocal("savedImagesL");
    bookmarks = loadLocal("importBookmarks");
    length = bookmarks.length; 
    currentImage = Number(localStorage.getItem("currentImage")) || 0;
    
    buildDom();
});

function buildDom() {
    $('#importButton').click(function() {
        $('#fileInput').click();
    });
    $('#index').click(function() {
        $('#indexInput').css('display', 'block');
        $('#index').css('display', 'none');
        $('#indexInput').focus();        
    }); 
    $('#indexInput').on("keyup", function(event) {
        enterInput(event); // Pass the event to the function
    }); 
    $('#overviewButton').click(function(){
        window.location.href = "overview.html";
    });
    $('#clearButton').click(function(){
        localStorage.clear();
        savedImagesJ = [];
        savedImagesL = [];
        openDialogBox("clear");
        $('#main > img').css("display", "none")
    });
    $('#linkButton').click(followLink); 
    $('#fileInput').change(async function(event) {
        try {
            // Call importHTML with the event and the current bookmarks
            currentImage = 0;
            localStorage.setItem('currentImage', currentImage);
            await importHTML(event);         
        } catch (error) {
            console.error('Error updating bookmarks:', error);
        }
    });
    $(document).on("keyup", function( event ) {
        switch (event.which) {
            case 37: updateCurrentImage("left"); break;
            case 39: updateCurrentImage("right"); break;
            case 74: saveImage("j"); break;
            case 76: saveImage("l"); break;     
        }
    });
    updateCurrentImage(currentImage);
    console.log(typeof currentImage)     
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

function followLink(){
    var url = $('#mainImage').attr('src');
        window.open(url, '_blank');
}   

function isFileUrl(url) {
    return url.startsWith('file://');
}  

function updateCurrentImage(value) {
    if(value == "left" && currentImage > 0) {
        currentImage--;
        changeImage(bookmarks, currentImage);
    }
    if(value == "right" && currentImage < length-1) {
        currentImage++;
        changeImage(bookmarks, currentImage);        
    }
    if(typeof value === 'number' && value >= 0 && value < length) {
        console.log("passed");
        currentImage = value;
        localStorage.setItem('currentImage', currentImage);
        changeImage(bookmarks, currentImage);
    }
    return;
}

function changeImage(array, index) {
    //$('#linkButton').css('opacity', 0);
    $('#dialogBox').css('opacity', 0);  
    const key = index.toString(); // Convert index to a string
    const imageObject = array[key]; // Access the object using the string key
    localStorage.setItem('currentImage', index);
     
    if (imageObject && imageObject.value) {
        const imageUrl = imageObject.value; // Get the URL from the 'value' property
        $('#mainImage').attr('src', imageUrl); // Update the image source
    } else {
        console.warn('No image found for index:', key); // Handle undefined key gracefully
    }
    updateCounter(index, length);
    if(isFileUrl(imageObject.value)) {
        openDialogBox("localFile");
    }    
}

function updateCounter(current, max) {
    currentImage = current;   
    current++;
    current = current.toString().padStart(2, '0');
    $('#counter').html("/"+max);
    $('#index').html(current);
}

function saveImage(name) {
    const imgSrc = $('#mainImage').attr('src');
    if(name == "j") {
        if (!savedImagesJ.includes(imgSrc)) {
            savedImagesJ.push(imgSrc);
            storeLocal("savedImagesJ", savedImagesJ);
            openDialogBox("download", "j");
        }   else {
            openDialogBox("download", "x"); 
        }   
    }
    if(name == "l") {
        if (!savedImagesL.includes(imgSrc)) {
            savedImagesL.push(imgSrc);
            storeLocal("savedImagesL", savedImagesL);
            openDialogBox("download", "l");
        }   else {
            openDialogBox("download", "x");  
        }   
    }
    
}

function openDialogBox(type, additional) {
    let message;
    if(type === "download") {
        if(additional == "j") {
            message = "saved for Janik"
        }
        if(additional == "l") {
            message = "saved for Lukas"
        }
        if(additional == "x") {
            message = "already saved"
        }
        if(message) {
            $('#dialogBoxText').html(message);
            $('#dialogBox')
                .animate({ opacity: 1 }, 0)      // Instantly set opacity to 100%
                .delay(3000)                     // Wait for 4 seconds
                .animate({ opacity: 0 }, 0);   // Fade back to 0% over 500ms
        }
    }
    if(type === "clear") {
        message = "Cleared";
        $('#dialogBoxText').html(message);
            $('#dialogBox')
                .animate({ opacity: 1 }, 0)      // Instantly set opacity to 100%
                .delay(3000)                     // Wait for 4 seconds
                .animate({ opacity: 0 }, 0);   // Fade back to 0% over 500ms
    }
    if(type === "localFile") {
        message = "local file";  
        $('#dialogBoxText').html(message);
            $('#dialogBox')
                .animate({ opacity: 1 }, 0)      // Instantly set opacity to 100%
                .delay(3000)                     // Wait for 4 seconds
                .animate({ opacity: 0 }, 0);   // Fade back to 0% over 500ms
    }
}

function enterInput(event) {
    if (event.which === 13) {
        var value = document.getElementById('indexInput').value;     
        $('#indexInput').blur(); // Unfocus the input
        $('#indexInput').css('display', 'none'); // Hide the input
        $('#index').css('display', 'block');
        if(value>length) {
            document.getElementById('indexInput').value = "";
            return;
        }
        document.getElementById('indexInput').value = "";
        changeImage(bookmarks, value-1);      
    }  
}

//importHandler Part
async function importHTML(event) {
    const file = event.target.files[0];
    // Check if the correct file is selected
    if (!file) {
        console.error('No file selected.');
        return;
    }
    if (file.type !== 'text/html') {
        console.error('Please select an HTML file.');
        return;
    }
    try {
        const htmlContent = await readFile(file);
        bookmarks = convertHTMLtoArray(htmlContent);
        storeLocal("importBookmarks", bookmarks);
        changeImage(bookmarks, 0);
        length = bookmarks.length;
        updateCounter(0, length)
        console.log('Bookmarks imported successfully:', bookmarks);
        $('#main > img').css("display", "block"); 
    } catch (error) {
        console.error('Error processing the HTML file:', error);
    }
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}

function convertHTMLtoArray(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Search for folders (H3 elements)
    const folders = Array.from(doc.querySelectorAll("DT > H3"));
    // Search for the folder named "69er"
    const targetFolder = folders.find(folder => folder.textContent === "69er");

    if (targetFolder) {
        // Select all A elements in the target folder ("69er")
        const links = Array.from(targetFolder.nextElementSibling.querySelectorAll("DT > A"));
        // Convert links to an array of objects
        return links.map((link, index) => ({
            key: index,
            value: link.href,
        }));
    } else {
        console.log("No folder called 69er found.");
        return [];
    }
}