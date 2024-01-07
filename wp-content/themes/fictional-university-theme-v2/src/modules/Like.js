class Like {
    constructor() {
      if (document.querySelector(".like-box")) {
        this.headers = {
          'Content-Type': 'application/json',
          'X-WP-Nonce': universityData.nonce,
        };
        this.events();
      }
    }
  
    events() {
      document.querySelector(".like-box").addEventListener("click", e => this.ourClickDispatcher(e));
    }
  
    // methods
    ourClickDispatcher(e) {
      let currentLikeBox = e.target;
      while (!currentLikeBox.classList.contains("like-box")) {
        currentLikeBox = currentLikeBox.parentElement;
      }
  
      if (currentLikeBox.getAttribute("data-exists") == "yes") {
        this.deleteLike(currentLikeBox);
      } else {
        this.createLike(currentLikeBox);
      }
    }
  
    async createLike(currentLikeBox) {
      try {
        const response = await fetch(universityData.root_url + "/wp-json/university/v1/manageLike", {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({ "professorId": currentLikeBox.getAttribute("data-professor") }),
        });
  
        const data = await response.json();
  
        if (data !== "Only logged in users can create a like.") {
          currentLikeBox.setAttribute("data-exists", "yes");
          var likeCount = parseInt(currentLikeBox.querySelector(".like-count").innerHTML, 10);
          likeCount++;
          currentLikeBox.querySelector(".like-count").innerHTML = likeCount;
          currentLikeBox.setAttribute("data-like", data);
        }
  
        console.log(data);
      } catch (e) {
        console.log("Sorry");
      }
    }
  
    async deleteLike(currentLikeBox) {
      try {
        const response = await fetch(universityData.root_url + "/wp-json/university/v1/manageLike", {
          method: 'DELETE',
          headers: {
            ...this.headers,
            'Content-Type': 'application/x-www-form-urlencoded', // Required for DELETE requests
          },
          body: `like=${currentLikeBox.getAttribute("data-like")}`,
        });
  
        const data = await response.json();
  
        currentLikeBox.setAttribute("data-exists", "no");
        var likeCount = parseInt(currentLikeBox.querySelector(".like-count").innerHTML, 10);
        likeCount--;
        currentLikeBox.querySelector(".like-count").innerHTML = likeCount;
        currentLikeBox.setAttribute("data-like", "");
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    }
  }
  
  export default Like;  