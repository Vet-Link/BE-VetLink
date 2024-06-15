const { ID } = require('../user/doctor/docRegistHandler');

document.addEventListener('DOMContentLoaded', () => {
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const passwordVerify = document.getElementById("passwordVerify");
  const messageForm = document.getElementById('send-container');

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission
    let postid = ID;
    let inputElem = document.getElementById("imgfile");
    let file = inputElem.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    // Create new file so we can rename the file
    let blob = file.slice(0, file.size, "image/jpeg");
    let newFile = new File([blob], `${postid}_post.jpeg`, { type: "image/jpeg" });

    // Build the form data
    let formData = new FormData();
    formData.append("username", username.value);
    formData.append("email", email.value);
    formData.append("password", password.value);
    formData.append("passwordVerify", passwordVerify.value);
    formData.append("imgfile", newFile);

    fetch("http://localhost:8080/upload", {
      method: "POST",
      body: formData,
    })
    .then((res) => res.text())
    .then((res) => {
      console.log(res);
      loadPosts(); // Load posts after successful upload
    })
    .catch((error) => console.error("Error:", error));
  });

  // Loads the posts on page load
  function loadPosts() {
    fetch("http://localhost:8080/upload")
      .then((res) => res.json())
      .then((x) => {
        const imagesContainer = document.getElementById("images");
        imagesContainer.innerHTML = ''; // Clear the existing images
        for (let y = 0; y < x[0].length; y++) {
          console.log(x[0][y]);
          const newimg = document.createElement("img");
          newimg.setAttribute(
            "src",
            "https://storage.googleapis.com/dansstorage/" + x[0][y].id
          );
          newimg.setAttribute("width", 50);
          newimg.setAttribute("height", 50);
          imagesContainer.appendChild(newimg);
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  // Call loadPosts when the page loads
  loadPosts();
});
