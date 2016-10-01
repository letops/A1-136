var startTime = new Date().getTime();

function countTime() {
  var currentTime = new Date().getTime();
  var time = currentTime - startTime;
  return time / (60 * 60);
}

function submission() {
  time = countTime();
  document.getElementById('timer').value = time;
}

module.exports = {
  countTime: countTime,
  submission: submission,
};

// function getTotalQuestions(){
//   questions = document.getElementsByClassName("questionRow");
//   return questions.length;
// }

// function getCurrentQuestion(){
//   questions = document.getElementsByClassName("questionRow");
//   var current = 0;
//   while(current < questions.length){
//     if($(questions[current]).hasClass("active")){
//       break;
//     }
//     current++;
//   }
//   return current+1;
// }

// function getCurrentProgress() {
//   console.log(getCurrentQuestion());
//   console.log(getTotalQuestions());
//   scrollPercent = (getCurrentQuestion() / getTotalQuestions()) * 100;
//   var position = scrollPercent;
//   console.log(position);
//   return position;
//   // return getCurrentScroll()/getMaxScroll()*100;
// }

// function changeProgress() {
//   var newProgress = getCurrentProgress();
//   document.getElementById("progress-bar").style.width=getCurrentProgress()+"%";
//   if(newProgress == 100){
//     document.getElementById("poll-button").style.height="8%";
//     document.getElementById("poll-button").style.zIndex="2";
//   }
//   else{
//     document.getElementById("poll-button").style.height="0";
//     document.getElementById("poll-button").style.zIndex="0";
//   }
// }

// window.onload = function() {
//   $('#fullpage').fullpage();

//   startTime = new Date().getTime();

//   changeProgress();

//   var observer = new MutationObserver(function(mutations) {
//       mutations.forEach(function(mutationRecord) {

//          var q = changeProgress();
//           console.log('scrolled');
//       });
//   });

//   var target = document.getElementById('fullpage');
//   observer.observe(target, { attributes : true, attributeFilter : ['style'] });

// }


// function checkKeyboard(e) {
//         if (e.keyCode == 13 || e.keycode == 116) {
//             $('#fullpage').fullpage();
//             startTime = new Date().getTime();

//             changeProgress();

//             var observer = new MutationObserver(function(mutations) {
//                 mutations.forEach(function(mutationRecord) {

//                    var q = changeProgress();
//                     console.log('scrolled');
//                 });
//             });

//             var target = document.getElementById('fullpage');
//             observer.observe(target, { attributes : true, attributeFilter : ['style'] });
//                       return false;
//         }
//     }

// $('#fullpage').keypress(116);

// var e = jQuery.Event("keydown");
// e.which = 116; // # Some key code value
// e.keyCode = 116;



// $(window).bind("load", function() {
//    // code here
//    if(checkKeyboard(e))
//    {
//     alert(checkKeyboard);
//     alert(e.keyCode);
//    }

// });


// window.onkeypress = checkKeyboard;
