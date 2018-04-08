// import * as Chartist from "Chart.bundle.min.js";

$(document).ready(function() {
  let walletType;

  $.mobile.changePage("#general");

  $(document).on("swipeleft", ".ui-page", function(event) {
    if (event.handled !== true) {
      // This will prevent event triggering more then once
      var nextpage = $.mobile.activePage.next('[data-role="page"]');
      // swipe using id of next page if exists
      if (nextpage.length > 0) {
        $.mobile.changePage(
          nextpage,
          { transition: "slide", reverse: false },
          true,
          true
        );
      }
      event.handled = true;
    }
    return false;
  });

  $(document).on("swiperight", ".ui-page", function(event) {
    if (event.handled !== true) {
      // This will prevent event triggering more then once
      var prevpage = $(this).prev('[data-role="page"]');
      if (prevpage.length > 0) {
        $.mobile.changePage(
          prevpage,
          { transition: "slide", reverse: true },
          true,
          true
        );
      }
      event.handled = true;
    }
    return false;
  });

  // TODO Chart starts here

  // Create a new line chart object where as first parameter we pass in a selector
  // that is resolving to our chart container element. The Second parameter
  // is the actual data object.
  new Chartist.Pie(
    ".ct-chart",
    {
      labels: ["Income", "Revenue"],
      series: [45, 55]
      // fill: [red, green]
    },
    {
      donut: true,
      donutWidth: 60,
      donutSolid: true,
      startAngle: 270,
      showLabel: true,
      height: 200
    }
  );
  // });

  // TODO data structure

  let walletController = (function() {})();

  //TODO UI controller

  let uIController = (function() {
    return {
      getInput: function() {
        return {
          type: walletType, // inc or exp from a global module var
          description: document.querySelector(".exp__add-description").value,
          value: document.querySelector(".exp__add-value").value
        };
      }
    };
  })();

  // TODO controller

  let controller = (function(walletCtrl, uIctrl) {
    let ctrlAddItem = function() {
      document.querySelector("#add-expense").className += " is-active";
      walletType = "exp"; //changing global for module variable!!!

      let closeModalBtns = document.querySelectorAll(
        ".close-modal-add-expense"
      );

      for (let i of closeModalBtns) {
        console.log(i);
        i.addEventListener("click", function() {
          // document.querySelector("#add-expense".className = "modal")
          document.querySelector("#add-expense").classList.remove("is-active");
        });
      }

      // 1. Get the field input data
      document
        .querySelector(".save-modal-add-expense")
        .addEventListener("click", function() {
          let input = uIctrl.getInput();
          console.log(input);
          // TODO To be executed only if values are valid
          document.querySelector("#add-expense").classList.remove("is-active");
        });

      // 2. Add the item to the budget controller

      // 3. Add the item to the UI

      // 4. Calculate the Wallet

      // 5. Display the budget on UI
    };

    document
      .querySelector(".add__btn-expenses")
      .addEventListener("click", ctrlAddItem);

    // Used with onkeypress to filter only numbers(and dot) during form entry
    // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onkeypress
    //Example:
    // <p>Enter numbers only:
    // <input type="text" name="myInput" onkeypress="return numbersOnly(this, event);" onpaste="return false;" />
    // </p>
    function numbersOnly(oToCheckField, oKeyEvent) {
      return (
        oKeyEvent.charCode === 0 ||
        /\d|\./.test(String.fromCharCode(oKeyEvent.charCode))
      );
    }

    // starts add expense modal
    document
      .querySelector(".add__btn-income")
      .addEventListener("click", function() {
        console.log("Hola add__btn-income was just clicked!!!");
      });

    //TODO TEST!!! to delete!!!
    document.addEventListener("keypress", function(ev) {
      if (ev.keyCode === 13 || event.which === 13) {
        console.log("ENTER was pressed!");
      }
    });
  })(walletController, uIController);
});
