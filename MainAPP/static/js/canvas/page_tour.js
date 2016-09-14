var hopscotch = require('hopscotch');
/* globals hopscotch: false */

/* ============ */
/* EXAMPLE TOUR */
/* ============ */
var tour = {
  id: 'hello-hopscotch',
  steps: [
    {
      target: 'sideBar',
      title: 'Bienvenido a A1-136',
      content: 'Para saber como usar esta aplicacion, por favor haz click en Siguiente ',
      placement: 'right',
      arrowOffset: 30,
      yOffset: 200,
      xOffset: 20,
    },
    {
      target: 'category-selector',
      placement: 'top',
      title: 'Seleccion de imagenes',
      content: 'Aqui debes escoger la categoria de las imagenes que te gustes, despues arrastralas al hacia los cuadros vacios',
    },
    {
      target: 'canvas',
      placement: 'bottom',
      title: 'Creación de la imagen',
      content: 'Aquí debes poner las imagenes que te más te gusten',
      arrowOffset: 150,
      yOffset: -400,
      xOffset: 200,
    },
    {
      target: 'button-submit',
      placement: 'left',
      title: '¡Terminamos!',
      content: 'Cuando termines, haz click en enviar',
      arrowOffset: 50,
      yOffset: -50,
      xOffset: -30,
    },
  ],
  i18n: {
    // the title of the done button - next
    nextBtn: 'Siguiente',
    prevBtn: 'Atras',
    doneBtn: 'Terminar',
  },
  showPrevButton: true,
  showNextButton: true,
  showCloseButton: true,
  scrollTopMargin: 100,
};

/* ========== */
/* TOUR SETUP */
/* ========== */
addClickListener = function (el, fn) {
  if (el.addEventListener) {
    el.addEventListener('click', fn, false);
  } else {
    el.attachEvent('onclick', fn);
  }
},

init = function () {
  var startBtnId = 'startTourBtn';
  var calloutId = 'startTourCallout';
  var mgr = hopscotch.getCalloutManager();
  var state = hopscotch.getState();

  if (state && state.indexOf('hello-hopscotch:') === 0) {
    // Already started the tour at some point!
    hopscotch.startTour(tour);
  } else {
    // Looking at the page for the first(?) time.
    setTimeout(function () {
      ;
    }, 100);
  }

  addClickListener(document.getElementById(startBtnId), function () {
    if (!hopscotch.isActive) {
      mgr.removeAllCallouts();
      hopscotch.startTour(tour);
    }
  });
};

init();

window.onload = function () {
  hopscotch.startTour(tour);
};
