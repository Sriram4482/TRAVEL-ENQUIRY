function autocomplete(input, suggestions) {
    let currentFocus;
    input.addEventListener("input", function() {
      const val = this.value;
      closeAllLists();
      if (!val) return false;
      currentFocus = -1;
      const list = document.createElement("div");
      list.setAttribute("id", this.id + "autocomplete-list");
      list.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(list);
      suggestions.forEach((item) => {
        if (item.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
          const listItem = document.createElement("div");
          listItem.innerHTML = "<strong>" + item.substr(0, val.length) + "</strong>";
          listItem.innerHTML += item.substr(val.length);
          listItem.innerHTML += "<input type='hidden' value='" + item + "'>";
          listItem.addEventListener("click", function() {
            input.value = this.getElementsByTagName("input")[0].value;
            closeAllLists();
          });
          list.appendChild(listItem);
        }
      });
    });

    input.addEventListener("keydown", function(e) {
      let x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode === 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode === 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode === 13) {
        e.preventDefault();
        if (currentFocus > -1 && x) x[currentFocus].click();
      }
    });

    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = x.length - 1;
      x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
      for (let i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

    function closeAllLists(elmnt) {
      const x = document.getElementsByClassName("autocomplete-items");
      for (let i = 0; i < x.length; i++) {
        if (elmnt !== x[i] && elmnt !== input) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }

    document.addEventListener("click", function(e) {
      closeAllLists(e.target);
    });
  }

  // Example usage:
  const sampleSuggestions = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
  autocomplete(document.getElementById("searchInput"), sampleSuggestions);
