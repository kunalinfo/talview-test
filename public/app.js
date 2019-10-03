angular.module("myApp", []).controller("MainController", MainCtrl);

MainCtrl.$inject = ["$http", "$window"];

function MainCtrl($http, $window) {
    this.app = "Angular App has connected successfully!";

    this.page = "pages/login.html";

    //===========================================
    // DEFINING CONSTANTS NECESSARY FOR OAUTH
    //===========================================
    const AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
    const REDIRECT_URI = "http://localhost:3000/callback";
    const ENCODED_REDIRECT_URI = encodeURIComponent(REDIRECT_URI);
    const CLIENT_ID = "6bd4fe34c7f29c380f10";

    //===========================================
    // FUNCTION THAT IS CALLED WHEN USER CLICKS
    // SIGN IN WITH GITHUB
    //===========================================
    this.loginWithGithub = () => {
        //===========================================
        // WE HAVE TO REDIRECT TO THE AUTHORIZE URL PROVIDED BY GITHUB
        //===========================================
        $window.location.href = `${AUTHORIZE_URL}?scope=user%3Aemail&client_id=${CLIENT_ID}
        &redirect_uri=${ENCODED_REDIRECT_URI}`;
        //===========================================
        // HERE WE PASS ENCODED URI AS A PARAMETER IN A URI
        // CANNOT HAVE '/', IN THE WAY URI'S HAVE
        //===========================================
    };

    //===========================================
    // FUNCTION THAT CHECKS IF THERE IS ANY DATA IN THE SESSION
    //===========================================
    this.checkForSession = () => {
        $http({
            method: "GET",
            url: "/sessions"
        }).then(res => {
            console.log(res);
            const { currentUser } = res.data;
            if (currentUser) {
                console.log("User exists");
                this.name = currentUser.name;
                this.repos_url = currentUser.repos_url;
                this.userData = currentUser;
                this.page = "pages/dashboard.html";
            } else {
                console.log("User does not exist");
            }
        });
    };
    this.checkForSession();
    
    
    //--------------------
      // GET USER MEDIA CODE
      //--------------------
          navigator.getUserMedia = ( navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia);

      var video;
      var webcamStream;

      function startWebcam() {
        if (navigator.getUserMedia) {
           navigator.getUserMedia (

              // constraints
              {
                 video: true,
                 audio: false
              },

              // successCallback
              function(localMediaStream) {
                  video = document.querySelector('video');
                 video.src = window.URL.createObjectURL(localMediaStream);
                 webcamStream = localMediaStream;
              },

              // errorCallback
              function(err) {
                 console.log("The following error occured: " + err);
              }
           );
        } else {
           console.log("getUserMedia not supported");
        }  
      }

      function stopWebcam() {
          webcamStream.stop();
      }
      //---------------------
      // TAKE A SNAPSHOT CODE
      //---------------------
      var canvas, ctx;

      function init() {
        // Get the canvas and obtain a context for
        // drawing in it
        canvas = document.getElementById("myCanvas");
        ctx = canvas.getContext('2d');
      }

      function snapshot() {
         // Draws current image from the video element into the canvas
        ctx.drawImage(video, 0,0, canvas.width, canvas.height);
      }

}
