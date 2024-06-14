const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

// global variables with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#5C5D61",
username;

const setCanvasBackground = () => {
    ctx.fillRect("#fff", "#fff", canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

// Get the submit button and username input field
const submitButton = document.getElementById("submit-name");
const usernameInput = document.getElementById("user-name");

// Initially disable the submit button
submitButton.disabled = true;

usernameInput.addEventListener("input", function() {
  if (!this.value.trim()) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
});

submitButton.onclick = function(event){
  const username = usernameInput.value;
  if (!username.trim()) { // Check if username is empty after trimming
    event.preventDefault(); // Prevent the form from being submitted
    return;
  }
  // Check if the button has two levels of parents before trying to hide it
  if (this.parentNode && this.parentNode.parentNode) {
      this.parentNode.parentNode.style.display = "none";
  }
  document.getElementById('fish-popup').style.display = 'block';
}

let selectedFishShape = 'fish.png'; // Default fish shape

window.selectFishShape = function(fishShape) {
  // Update the fish shape that will be drawn
  selectedFishShape = fishShape;
  // Update the fish image in the drawing canvas
  document.getElementById('fish-image').src = selectedFishShape;
  // Hide the fish shape selection popup
  document.getElementById('fish-popup').style.display = 'none';
};


const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

const drawTriangle = (e) => {
  ctx.beginPath(); // creating new path to draw triangle

  // Calculate the third point based on the direction of the mouse movement
  const dx = e.offsetX - prevMouseX;
  const dy = e.offsetY - prevMouseY;
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx * dx + dy * dy);
  const thirdX = prevMouseX + length * Math.cos(angle + Math.PI / 3);
  const thirdY = prevMouseY + length * Math.sin(angle + Math.PI / 3);

  ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
  ctx.lineTo(thirdX, thirdY); // creating the third line based on the calculated third point
  ctx.closePath(); // closing path of the triangle

  fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked, fill the triangle, else draw the border
};

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; // passing selectedColor as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas

    if(selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white 
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});

// Initialize Firebase
// Replace these values with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyArF6cI8sxfM91GiYXkFCMWDnw3iRxMbBE",
  authDomain: "dti-drawing.firebaseapp.com",
  projectId: "dti-drawing",
  storageBucket: "dti-drawing.appspot.com",
  messagingSenderId: "761976462662",
  appId: "1:761976462662:web:065a73ce309956faf91947"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const storageRef = storage.ref();

const imagesFolderRef = storageRef.child('drawings/'); // replace 'images/' with your folder path

imagesFolderRef.listAll()
  .then((res) => {
    const imageContainer = document.getElementById('image-container');
    res.items.forEach((itemRef) => {
      itemRef.getDownloadURL().then((url) => {
        const img = document.createElement('img');
        img.src = url;
        imageContainer.appendChild(img);
        img.classList.add('firebase-image'); // Add class
        img.addEventListener('click', () => {
          img.classList.toggle('picked');
          console.log('Image clicked:', img.src);
  });
  imageContainer.appendChild(img);
      });
    });
  })
  .catch((error) => {
    console.error('Error:', error);
  });

function showUploadPopup() {
  const uploadPopup = document.querySelector(".upload-popup");
  const closeBtn = document.getElementById("close-btn");

  uploadPopup.style.display = "block"; // Show the popup

  // Close the popup and the program when the close button is clicked
  closeBtn.addEventListener("click", () => {
    uploadPopup.style.display = "none"; // Hide the popup
    document.getElementById('inspiring-board-popup').style.display = 'block'; // Show the leaderboard
  });

  // Close the popup and the program when clicking outside the popup content
  window.addEventListener("click", (event) => {
    if (event.target === uploadPopup) {
      uploadPopup.style.display = "none"; // Hide the popup
      window.close(); // Close the program
    }
  });
}

saveImg.addEventListener("click", () => {
  // Create a new canvas to hold the final image
  const finalCanvas = document.createElement('canvas');
  const finalCtx = finalCanvas.getContext('2d');

  // Load the fish image
  const fishImage = new Image();
  fishImage.crossOrigin = "anonymous"; // Allow cross-origin images
  fishImage.onload = () => {
    // Set the final canvas size to match the fish image
    finalCanvas.width = fishImage.width;
    finalCanvas.height = fishImage.height;

    // Draw the fish image onto the final canvas
    finalCtx.drawImage(fishImage, 0, 0);

    // Draw the drawing canvas onto the final canvas, resizing it to match the fish image
    finalCtx.drawImage(canvas, 0, 0, fishImage.width, fishImage.height);

    // Get the final image as a Blob
    finalCanvas.toBlob((blob) => {
      // Create a reference to the Firebase Storage location
      const storageRef = storage.ref(`drawings/${usernameInput.value}_${Date.now()}.png`);

      // Upload the Blob to Firebase Storage
      storageRef.put(blob).then((snapshot) => {
        console.log("Drawing uploaded successfully!");
        showUploadPopup();
      }).catch((error) => {
        console.error("Error uploading drawing:", error);
      });
    }, "image/png", 1); // Specify the file type and quality (1 = 100%)
  };
  fishImage.src = selectedFishShape;
});

document.getElementById('vote-button').addEventListener('click', function() {
  document.getElementById('inspiring-board-popup').style.display = 'none';
  document.getElementById('thank-you-popup').style.display = 'block';
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
