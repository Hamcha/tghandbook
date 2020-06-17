interface SearchOption {
  alignment: ScrollLogicalPosition;
}

export function searchBox(
  el: HTMLElement[],
  searchCandidate,
  options: SearchOption = {
    alignment: "center",
  }
): HTMLElement {
  // Fuzzy search box
  const resultList = document.createElement("ul");
  const searchBoxElem = document.createElement("div");
  let selectedResult = null;
  let results = [];
  const jumpTo = (id: number) => {
    el[id].scrollIntoView({
      block: options.alignment,
      inline: "nearest",
      behavior: "auto",
    });
    document
      .querySelectorAll("table.wikitable .bgus_fz_selected")
      .forEach((sel) => sel.classList.remove("bgus_fz_selected"));
    el[id].parentElement.classList.add("bgus_fz_selected");
  };

  const setSelectedResult = (i) => {
    selectedResult = i;
    resultList
      .querySelectorAll(".selected")
      .forEach((sel) => sel.classList.remove("selected"));
    resultList.children[i].classList.add("selected");
    jumpTo(results[i].id);
  };

  const search = (str) => {
    if (!str) {
      return;
    }
    const combinations = str
      .split("")
      .map((c) => (c.includes(["\\", "]", "^"]) ? `\\${c}` : c))
      .join("])(.*?)([");
    const regex = new RegExp(`^(.*?)([${combinations}])(.*?)$`, "i");
    const arr = searchCandidate
      .map((o) => {
        o.matches = (o.str.match(regex) || [])
          .slice(1)
          .reduce((list, group, i, or) => {
            // Initialize first placeholder (always empty) and first matching "sections"
            if (i < 2) {
              list.push([group]);
            }
            // If group is second match in a row join to previous section
            else if (or[i - 1] === "") {
              list[list.length - 1].push(group);
            }
            // If group is a match create a new section
            else if (group !== "") {
              list.push([group]);
            }
            return list;
          }, [])
          .map((cstr) => cstr.join(""));
        return o;
      })
      // Strike non-matching rows
      .filter((o) => o.matches.length > 0)
      .sort((oA, oB) => {
        const iA = oA.id,
          a = oA.matches;
        const iB = oB.id,
          b = oB.matches;

        // Exact match
        if (a.length === 1 && b.length !== 1) return -1;
        if (a.length !== 1 && b.length === 1) return 1;

        // Most complete groups (alphanumeric)
        const clean = (cel) => !/[^a-zA-Z0-9]*$/.test(cel);
        const cLen = a.filter(clean).length - b.filter(clean).length;
        if (cLen !== 0) return cLen;

        // Least distant first gropus
        for (let i = 0; i < Math.min(a.length, b.length) - 1; i += 2) {
          const gLen = a[i].length - b[i].length;
          if (gLen !== 0) return gLen;
        }

        // Most complete groups (raw)
        const len = a.length - b.length;
        if (len !== 0) return len;

        // Make the search stable since ECMAScript doesn't mandate it
        return iA - iB;
      });
    results = arr;
    window.requestAnimationFrame(() => {
      resultList.innerHTML = "";
      arr.forEach(({ matches, id }) => {
        const li = document.createElement("li");
        li.innerHTML = matches
          .map((c, i) => (i % 2 ? `<strong>${c}</strong>` : c))
          .join("");
        li.addEventListener("click", () => {
          jumpTo(id);
          searchBoxElem.classList.add("bgus_hidden");
        });
        resultList.appendChild(li);
      });
      if (results.length > 0) {
        setSelectedResult(0);
      }
    });
  };

  // Create fuzzy search box
  const sel = document.createElement("input");

  // Bind events
  let oldValue = "";
  sel.addEventListener("keyup", (event) => {
    switch (event.keyCode) {
      case 27: // Escape - Hide bar
        searchBoxElem.classList.add("bgus_hidden");
        return;
      case 13: // Enter - Jump to first result and hide bar
        if (results.length > 0) {
          jumpTo(results[selectedResult].id);
        }
        searchBoxElem.classList.add("bgus_hidden");
        return;
      case 40: // Down arrow - Select next result
        if (selectedResult < results.length - 1) {
          setSelectedResult(selectedResult + 1);
        }
        return;
      case 38: // Up arrow - Select previous result
        if (selectedResult > 0) {
          setSelectedResult(selectedResult - 1);
        }
        return;
      default:
        if (sel.value !== oldValue) {
          search(sel.value);
          oldValue = sel.value;
        }
    }
  });

  document.body.addEventListener("keyup", (ev) => {
    if (ev.keyCode === 83) {
      sel.focus();
    }
  });

  document.body.addEventListener("keydown", (ev) => {
    if (ev.shiftKey) {
      switch (ev.keyCode) {
        // SHIFT+S = Fuzzy search
        case 83: {
          searchBoxElem.classList.remove("bgus_hidden");
          sel.value = "";
          break;
        }
        default:
        // Do nothing
      }
    }
  });

  searchBoxElem.id = "bgus_fz_searchbox";
  searchBoxElem.classList.add("bgus_hidden");
  searchBoxElem.appendChild(sel);
  searchBoxElem.appendChild(resultList);
  return searchBoxElem;
}

export default searchBox;
