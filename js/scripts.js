function createListItem(inputValue, isChecked) {
  let li = $("<li></li>");
  li.append(document.createTextNode(inputValue));

  if (isChecked) {
    let checkmark = $("<span></span>");
    checkmark.addClass("checkmark");
    li.prepend(checkmark);
    li.addClass("strike");
  }

  let crossOutButton = $("<div></div>");
  crossOutButton.addClass("crossOutButton");
  li.append(crossOutButton);

  return li;
}

$("#list").on("dblclick", "li", function () {
  $(this).toggleClass("strike");
  let savedLists = JSON.parse(localStorage.getItem("lists"));
  let listTitle = $("#listTitle").text();
  let checked = false;
  let inputValue = $(this).text();

  if ($(this).hasClass("strike")) {
    let checkmark = $("<span></span>");
    checkmark.addClass("checkmark");
    $(this).prepend(checkmark);
    checked = true;
  } else {
    $(this).find(".checkmark").remove();
    checked = false;
  }

  let index = savedLists[listTitle].findIndex(
    (itemData) => itemData.item === inputValue
  );
  if (index != -1) {
    savedLists[listTitle][index].isChecked = checked;
    localStorage.setItem("lists", JSON.stringify(savedLists));
    updateSavedList(); // Add this line
  }
});

$("#list").on("click", ".crossOutButton", function () {
  let li = $(this).parent();
  let inputValue = li.text();
  li.addClass("delete");
  let savedLists = JSON.parse(localStorage.getItem("lists"));
  let listTitle = $("#listTitle").text();
  let index = savedLists[listTitle].findIndex(
    (itemData) => itemData.item === inputValue
  );
  if (index != -1) {
    savedLists[listTitle].splice(index, 1);
    localStorage.setItem("lists", JSON.stringify(savedLists));
    updateSavedList(); // Add this line
  }
});

function newItem() {
  let inputValue = $("#input").val();
  let listTitle = $("#listTitle").text();

  if (inputValue === "") {
    alert("You must write something!");
  } else if (listTitle !== "List without a name") {
    let li = createListItem(inputValue, false);
    $("#list").append(li);

    // Save the new item to localStorage
    let savedLists = JSON.parse(localStorage.getItem("lists"));
    if (savedLists && savedLists[listTitle]) {
      savedLists[listTitle].push({ item: inputValue, isChecked: false });
      localStorage.setItem("lists", JSON.stringify(savedLists));
      updateSavedList(); // Add this line
    }
  } else {
    let li = createListItem(inputValue, false);
    $("#list").append(li);
  }

  $("#list").sortable();

  // Reset the input field
  $("#input").val("");
}

$("#input").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
    newItem();
  }
});

$(document).ready(function () {
  var modal = document.getElementById("myModal");
  var yesBtn = document.getElementById("yesButton");
  var noBtn = document.getElementById("noButton");

  // load previous lists
  var savedLists = JSON.parse(localStorage.getItem("lists"));
  $("#previousLists").append(
    `<option value="List without a name">List without a name</option>`
  );

  if (savedLists && Object.keys(savedLists).length > 0) {
    $("#previousLists").show();
    Object.keys(savedLists).forEach(function (listName) {
      $("#previousLists").append(
        `<option value="${listName}">${listName}</option>`
      );
    });
  }

  modal.style.display = "block";

  yesBtn.onclick = function () {
    var listName = $("#listName").val();
    if (listName != "") {
      // update the list title inside the ol
      $("#listTitle").text(listName);
      modal.style.display = "none";
      // Save list to localStorage
      if (!savedLists) {
        savedLists = {};
      }
      savedLists[listName] = [];
      localStorage.setItem("lists", JSON.stringify(savedLists));
    } else {
      alert("Please enter a name for the list.");
    }
  };

  noBtn.onclick = function () {
    modal.style.display = "none";
    $("#listTitle").text("List without a name");
    $("#previousLists").val("List without a name"); // Set dropdown to 'List without a name'
    $("#list").empty(); // Clear the list
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  loadSavedList();

  $("#previousLists").change(function () {
    var selectedList = $(this).val();
    if (savedLists && savedLists[selectedList]) {
      $("#listTitle").text(selectedList);
      // Populate #list with items from savedLists[selectedList]
      $("#list").empty();
      savedLists[selectedList].forEach(function (itemData) {
        let li = createListItem(itemData.item, itemData.isChecked);
        $("#list").append(li);
      });
    }
    if (selectedList === "List without a name") {
      // Save the current list to localStorage before switching to an unsaved list
      if ($("#listTitle").text() !== "List without a name") {
        savedLists[$("#listTitle").text()] = [...$("#list").find("li")].map(
          (li) => {
            let isChecked = $(li).hasClass("strike");
            let item = $(li).text();
            return { item, isChecked };
          }
        );
        localStorage.setItem("lists", JSON.stringify(savedLists));
      }

      $("#list").empty();
    }
  });
});

function loadSavedList() {
  let savedLists = JSON.parse(localStorage.getItem("lists"));
  if (savedLists) {
    let selectedList = Object.keys(savedLists)[0];
    if (selectedList) {
      savedLists[selectedList].forEach(function (itemData) {
        let li = createListItem(itemData.item, itemData.isChecked);
        $("#list").append(li);
      });
    }
  }
}

function updateSavedList() {
  let savedLists = JSON.parse(localStorage.getItem("lists"));
  let listTitle = $("#listTitle").text();
  savedLists[listTitle] = [...$("#list").find("li")].map((li) => {
    let isChecked = $(li).hasClass("strike");
    let item = $(li).text();
    return { item, isChecked };
  });
  localStorage.setItem("lists", JSON.stringify(savedLists));
}
