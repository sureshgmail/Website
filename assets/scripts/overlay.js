// window.onload = function () {
//   var loader = document.getElementById("page-loader");
//   var content = document.querySelector("main");

//   setTimeout(() => {
//     loader.style.display = "none"; // Hide the loader
//   }, 3000);
// };

// Function to hide the div
function hideLoader() {
  const loader = document.getElementById("page-loader");
  if (loader) {
    loader.classList.add("hidden");
  }
}

// Call the function to hide the div after 3 seconds (3000 milliseconds)
window.addEventListener("load", () => {
  setTimeout(hideLoader, 3000);
});
