let side = document.getElementById("sideNav");
let opened = false;


function showSideNav() {
  if(!opened){
    opened = true;
    side.style.display = "block";
  } else {
    opened = false;
    side.style.display = "none";
  }
}



// Defining event listener function
function checkWindowSize(){
  // Get height of the window excluding scrollbars
  let w = document.documentElement.clientWidth;
  if(w >= 768) {
    opened = true;
    side.style.display = "block";
  } else {
    opened = false;
    side.style.display = "none";
  }
  console.log(w);
}

// Attaching the event listener function to window's resize event
window.addEventListener("resize", checkWindowSize);
