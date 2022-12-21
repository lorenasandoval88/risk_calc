
// hide button, then display button after loading 23 and me file
document.getElementById('23button').style.visibility = 'hidden';
var hidden = false;
function plotRisk() {
  console.log("hide button")
    hidden = !hidden;
    if(hidden) {
        document.getElementById('23button').style.visibility = 'visible';
    } else {
        document.getElementById('23button').style.visibility = 'hidden';
    }
}
//-------------------------------------


// map our commands to the classList methods
// const fnmap = {
//     'toggle': 'toggle',
//       'show': 'add',
//       'hide': 'remove'
//   };
//   const collapse = (selector, cmd) => {
//     const targets = Array.from(document.querySelectorAll(selector));
//     targets.forEach(target => {
//       target.classList[fnmap[cmd]]('show');
//     });
//   }
  
//   // Grab all the trigger elements on the page
//   const triggers = Array.from(document.querySelectorAll('[data-toggle="collapse2"]'));
//   // Listen for click events, but only on our triggers
//   window.addEventListener('click', (ev) => {
//     const elm = ev.target;
  
//     if (triggers.includes(elm)) {
//       const selector = elm.getAttribute('data-target');
//       collapse(selector, 'toggle');
//     }
//   } );
  
//   document.getElementById("pgsbutton").addEventListener("click", (e) => {
//       let textContent = e.target.textContent;
//       if (textContent == `plot ${pgsInput.value} scores`) {
//           e.target.textContent = `hide ${pgsInput.value} scores`;
//        }
//        else {
//          e.target.textContent = `plot ${pgsInput.value} scores`;
  
//        }
//    });
  
//   //when scores are updated, plot button should reset----->
//   // Grab all the trigger elements on the page
//   //https://medium.com/dailyjs/mimicking-bootstraps-collapse-with-vanilla-javascript-b3bb389040e7
//   const triggers2 = Array.from(document.querySelectorAll('[data-toggle="collapse1"]'));
//   // Listen for click events, but only on our triggers
//   window.addEventListener('click', (ev) => {
//     const elm = ev.target;
  
//     if (triggers2.includes(elm)) {
//       const selector = elm.getAttribute('data-target');
//       collapse(selector, 'hide');
//     }
//   } );
  
//   document.getElementById("pgs_scores_button").addEventListener("click", (e) => {
//       let textContent = document.getElementById("pgsbutton").innerHTML;
//       if (textContent == `hide ${pgsInput.value} scores`) {
//           document.getElementById("pgsbutton").innerHTML = `plot ${pgsInput.value} scores`;
//        }
//        else {
//           document.getElementById("pgsbutton").innerHTML = `plot ${pgsInput.value} scores`;
  
//        }
//    });