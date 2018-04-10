/* eslint-disable indent,no-console */
// import * as Chartist from "Chart.bundle.min.js";

$(document).ready(function() {
  $.mobile.changePage("#general");
});
// let walletType; // No need for global variable

// data structure

let walletController;
walletController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, desc, val) {
      let newItem, ID;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === "exp") {
        newItem = new Expense(ID, desc, val);
      } else if (type === "inc") {
        newItem = new Income(ID, desc, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function(type, id) {
      let ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      let index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateTotal: function(type) {
      let sum = 0;
      data.allItems[type].forEach(function(curr) {
        sum = sum + curr.value;
      });
      data.totals[type] = sum;
    },

    getTotals: function() {
      return {
        totalIncome: data.totals.inc,
        totalExpenses: data.totals.exp
      };
    },

    getItem: function(type, id) {
      let ids = data.allItems[type].map(function(current) {
        return current.id;
      });
        console.log("available ids: ", ids);
      let index = ids.indexOf(id);
        console.log("index", index);
      if (index !== -1) {
        return {
          itemData: data.allItems[type][index],
          itemType: type
        };
      } else {
        console.log(`No such item: type: ${type}, id: ${id}`);
      }
    },

    testing: function() {
      console.table(data);
    }
  };
  // }
})();

// UI controller

var uIController = (function() {
  let DOMstrings = {
    inputDescription: ".exp__add-description",
    inputValue: ".exp__add-value",
    inputDescriptionInc: ".inc__add-description",
    inputValueInc: ".inc__add-value",
    addBtnExpenses: ".add__btn-expenses",
    addBtnIncome: ".add__btn-income",
    modalAddExpense: "#add-expense",
    modalAddIncome: "#add-income",
    btnModalSaveAddExpense: ".save-modal-add-expense",
    btnModalSaveAddIncome: ".save-modal-add-income",
    btnModalCloseAddExpense: ".close-modal-add-expense",
    btnModalCloseAddIncome: ".close-modal-add-income",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    totalWalletFront: "#total",
    buttonValueIncome: "#button-value-income",
    buttonValueExpenses: "#button-value-expenses",

    // Edit modal \/\/\/\/\/

    itemsLists: ".lists",
    modalEditItem: "#edit-modal",
    btnEditModalSave: ".save-edit-modal",
    btnEditModalClose: ".close-edit-modal",
    btnEditModalDeleteItem: ".delete-edit-modal",
    inputEditDescription: ".edit__description",
    inputEditValue: ".edit__value",
    editModalTitle: "#edit-modal-card-title"
  };

  return {
    getInput: function(typeLoaded) {
      return {
        type: typeLoaded,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    // TODO DRY ???
    getInputIncome: function(typeLoaded) {
      return {
        type: typeLoaded,
        description: document.querySelector(DOMstrings.inputDescriptionInc)
          .value,
        value: parseFloat(
          document.querySelector(DOMstrings.inputValueInc).value
        )
      };
    },

    //Create HTML string with placeholder tag for adding items
    addListItem: function(obj, type) {
      let html, element;
      let id = `"target-${type}-${obj.id}"`;
      html = `<div class="column box margin-l-r is-4-tablet event-item" id=${id}> 
                    <table class="table is-fullwidth"> 
                        <tr class=""> 
                            <td class="" id=${id}>${obj.description}</td>
                            <td class="value" id=${id}><span class="tag is-medium" id=${id}>${
        obj.value
      }</span></td>
                        </tr>
                    </table>
                </div>`;

      // Insert HTML into the DOM
      if (type == "exp") {
        element = DOMstrings.expensesContainer;
      } else if (type == "inc") {
        element = DOMstrings.incomeContainer;
      }
      console.log(type, element);

      document.querySelector(element).insertAdjacentHTML("beforeend", html);
    },

    deleteListItem: function(selectorID) {
      if (document
        .querySelector(`#${selectorID}.event-item`)) {

        document
        .querySelector(`#${selectorID}.event-item`)
        .parentNode.removeChild(
          document.querySelector(`#${selectorID}.event-item`)
        );};
    },

    clearFields: function() {
      document.querySelector(DOMstrings.inputValue).value = "";
      document.querySelector(DOMstrings.inputDescription).value = "";
      document.querySelector(DOMstrings.inputValueInc).value = "";
      document.querySelector(DOMstrings.inputDescriptionInc).value = "";
    },

    displayTotals: function(obj) {
      document.querySelector(DOMstrings.totalWalletFront).textContent =
        obj.totalIncome - obj.totalExpenses;
      document.querySelector(DOMstrings.buttonValueIncome).textContent =
        obj.totalIncome;
      document.querySelector(DOMstrings.buttonValueExpenses).textContent =
        obj.totalExpenses;
    },
    /*

          /*
          Chart.js starts here
           */
    refreshChart: function(obj) {
      //first chart is deleted to avoid duplicates
      document.getElementById("chart-main").innerHTML =
        '<canvas id="myChart"></canvas>';
      var ctx = document.getElementById("myChart").getContext("2d");

      var data = {
        labels: ["Income", "Expenses"],
        datasets: [
          {
            backgroundColor: [
              "#2ecc71",
              // "#3498db",
              // "#95a5a6",
              // "#9b59b6",
              // "#f1c40f",
              "#e74c3c"
              // "#34495e"
            ],
            data: [obj.totalIncome, obj.totalExpenses],
            hashid: ["a1", "a2"]
          }
        ]
      };

      var myChart = new Chart(ctx, {
        type: "doughnut",
        data: data,
        options: {
          legend: {
            display: false, //true
            position: "right",
            labels: {
              padding: 8,
              usePointStyle: true
            }
          }
          // ,
          // tooltips: {
          //   callbacks: {
          //     label: function(tooltipItem, data) {
          //       var allData = data.datasets[tooltipItem.datasetIndex].data;
          //       var tooltipLabel = data.labels[tooltipItem.index];
          //       var tooltipData = allData[tooltipItem.index];
          //       var total = 0;
          //       for (var i in allData) {
          //         total += allData[i];
          //       }
          //       var tooltipPercentage = Math.round(tooltipData / total * 100);
          //       return (
          //         tooltipLabel +
          //         ": " +
          //         tooltipData +
          //         " (" +
          //         tooltipPercentage +
          //         "%)"
          //       );
          //     }
          //   }
          // }
        }
      });
    },

    setModalExpenseFocus: function() {
      document.querySelector(DOMstrings.inputDescription).focus();
    },

    setModalIncoFocus: function() {
      document.querySelector(DOMstrings.inputDescriptionInc).focus();
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

/*
: CONTROLLER IIFI
: walletCtrl = walletController (Model)
: uIctrl = uIController (View)
 */
var controller = (function(walletCtrl, uIctrl) {
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
        let wallet = walletCtrl.getTotals();
        uIctrl.refreshChart(wallet);
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
        let wallet = walletCtrl.getTotals();
        uIctrl.refreshChart(wallet);
      }
      event.handled = true;
    }

    return false;
  });

  var setupEventListeners = function() {
    var input;
    let DOM = uIctrl.getDOMstrings();

    let closeModalBtns = document.querySelectorAll(DOM.btnModalCloseAddExpense);

    for (let i of closeModalBtns) {
      i.addEventListener("click", function() {
        document
          .querySelector(DOM.modalAddExpense)
          .classList.remove("is-active");
      });
    }

    let closeModalBtnsIncome = document.querySelectorAll(
      DOM.btnModalCloseAddIncome
    );

    for (let i of closeModalBtnsIncome) {
      i.addEventListener("click", function() {
        document
          .querySelector(DOM.modalAddIncome)
          .classList.remove("is-active");
      });
    }

    var updateBudget = function() {
      // 4. Calculate the Wallet
      walletCtrl.calculateTotal("exp");
      walletCtrl.calculateTotal("inc");
      console.log(walletController.testing());

      // 5. Display the budget on UI

      let wallet = walletCtrl.getTotals();
      console.log(">>>>>", wallet);
      uIctrl.displayTotals(wallet);
    };
    // It is used only for expense b
    var ctrlAddItemExpense = function() {
      let newItem; //input is already declared

      document.querySelector(
        "#add-expense" /*DOM.modalAddExpense */
      ).className +=
        " is-active";

      uIctrl.setModalExpenseFocus();
      // 1. Get the field input data
      document
        .querySelector(DOM.btnModalSaveAddExpense)
        .addEventListener("click", function() {
          input = uIctrl.getInput("exp");
          // 2. Add the item to the budget controller
          console.log(
            document
              .querySelector(DOM.modalAddExpense)
              .classList.contains("is-active")
          );
          // TODO - done solution for a strange repetitions
          if (
            document
              .querySelector(DOM.modalAddExpense)
              .classList.contains("is-active") &&
            input.description !== "" &&
            !isNaN(input.value) &&
            input.value > 0
          ) {
            newItem = walletCtrl.addItem(
              input.type,
              input.description,
              input.value
            );
            // 3. Add the item to the UI
            uIctrl.addListItem(newItem, "exp");
            uIctrl.clearFields();
            updateBudget();
          }
          // closes the expense entry modal
          document
            .querySelector(DOM.modalAddExpense)
            .classList.remove("is-active");
        });
    };

    var ctrlAddItemIncome = function() {
      let newItem; //input is already declared

      document.querySelector(
        "#add-income" /*DOM.modalAddExpense */
      ).className +=
        " is-active";
      uIctrl.setModalIncoFocus();
      // 1. Get the field input data
      document
        .querySelector(DOM.btnModalSaveAddIncome)
        .addEventListener("click", function() {
          input = uIctrl.getInputIncome("inc");
          // 2. Add the item to the budget controller
          console.log(
            document
              .querySelector(DOM.modalAddIncome)
              .classList.contains("is-active")
          );
          // TODO - done solution for a strange repetitions
          if (
            document
              .querySelector(DOM.modalAddIncome)
              .classList.contains("is-active") &&
            input.description !== "" &&
            !isNaN(input.value) &&
            input.value > 0
          ) {
            newItem = walletCtrl.addItem(
              input.type,
              input.description,
              input.value
            );
            // 3. Add the item to the UI
            uIctrl.addListItem(newItem, "inc");
            uIctrl.clearFields();
            updateBudget();
          }
          // closes the expense entry modal
          document
            .querySelector(DOM.modalAddIncome)
            .classList.remove("is-active");
        });
    };

    document
      .querySelector(DOM.addBtnExpenses)
      .addEventListener("click", ctrlAddItemExpense);

    // starts add expense modal
    document
      .querySelector(DOM.addBtnIncome)
      .addEventListener("click", ctrlAddItemIncome);

    console.log("^^^^^^^^");
    console.log(document.getElementById("income-container"));

    //IMHERE  !!!
    let editModal = function(event) {
      console.log("edit modal is starting!!!:");
      console.log(event);
      console.log(event.toElement.id);
      id = event.toElement.id;
      //extract exp or inc + id number
      if (id.startsWith("target")) {
        let type = id.slice(7, 10);
        let idNr = parseInt(id.slice(11));
        console.log(type, idNr);

        // start edit modal with data acquired
        let startItemData = walletCtrl.getItem(type, idNr);
        console.log(startItemData);
        // Put data into the cells
        document.querySelector(DOM.inputEditDescription).value =
          startItemData.itemData.description;
        document.querySelector(DOM.inputEditValue).value =
          startItemData.itemData.value;

        // Set Edit modal header ot Expense or Income
        type === "inc"
          ? (document.querySelector(DOM.editModalTitle).innerHTML = "Income")
          : (document.querySelector(DOM.editModalTitle).innerHTML = "Expense");
        // Set close edit modal event listeners on 3 possible buttons
        let closeEditModalBtns = document.querySelectorAll(
          DOM.btnEditModalClose
        );

        for (let i of closeEditModalBtns) {
          i.addEventListener("click", function() {
            document
              .querySelector(DOM.modalEditItem)
              .classList.remove("is-active");
          });
        }

        document.querySelector(
          DOM.inputDescription
        ).Value = document.querySelector(
          // Open edit modal
          DOM.modalEditItem
        ).className +=
          " is-active";

        document
          .querySelector(DOM.btnEditModalDeleteItem)
          .addEventListener("click", function() {
            console.log(type, idNr);
            walletCtrl.deleteItem(type, idNr);
            // update totals
            walletCtrl.calculateTotal(type);
            let wallet = walletCtrl.getTotals();
            uIctrl.displayTotals(wallet);
            // delete list item
            uIctrl.deleteListItem(id);
            // Close edit modal
            document
              .querySelector(DOM.modalEditItem)
              .classList.remove("is-active");
          });

        // //TODO Close modal
        // document
        //     .querySelector(DOM.modalEditItem)
        //     .classList.remove("is-active");
      }
      // start edit modal with data acquired
      // write modal event listeners (cancel, edit, delete);

      // console.log(type);
    };

    //     document
    //   .getElementsByClassName(".event-item")
    //   .addEventListener("click", editModal);
    // //

    $(".lists").on("click", editModal);
    // document
    //   .getElementById("income-container")
    //   .addEventListener("click", editModal);
    //
    // document
    //   .getElementById("expenses-container")
    //   .addEventListener("click", editModal);

    //TODO TEST!!! to delete!!!
    // document.addEventListener("keypress", function(ev) {
    //   if (ev.keyCode === 13 || event.which === 13) {
    //     console.log("ENTER was pressed!");
    //   }
    // });
  };

  return {
    init: function() {
      console.log("Application has started! Init in controller!");
      // uIctrl.displayTotals({totalIncome: 0,
      //   totalExpenses: 0});
      setupEventListeners();
    }
  };
})(walletController, uIController);

// });
/*
Used with onkeypress to filter only numbers(and dot) during form entry
https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onkeypress
Example:
<p>Enter numbers only:
<input type="text" name="myInput" onkeypress="return numbersOnly(this, event);" onpaste="return false;" />
</p> */
function numbersOnly(oToCheckField, oKeyEvent) {
  return (
    oKeyEvent.charCode === 0 ||
    /\d|\./.test(String.fromCharCode(oKeyEvent.charCode))
  );
}

controller.init();
