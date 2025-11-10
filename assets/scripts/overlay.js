window.onload = function () {
  var loader = document.getElementById("page-loader");
  var content = document.querySelector("main");

  setTimeout(() => {
    loader.style.display = "none"; // Hide the loader
  }, 3000);
};
