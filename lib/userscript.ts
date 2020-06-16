// ==UserScript==
// @name         Better /tg/ Guides
// @namespace    https://faulty.equipment
// @version      0.2.2
// @description  Make /tg/station guides better with extra features
// @author       Hamcha
// @collaborator D
// @license      ISC
// @copyright    2020, Hamcha (https://openuserjs.org/users/Hamcha), D
// @match        https://tgstation13.org/wiki/Guide_to_*
// @grant        GM_addStyle
// ==/UserScript==

const DEFAULT_OPTS = {
  alignment: "center",
};

export default function (root: HTMLElement, docname: string) {
  // Tell user that better chemistry is loading
  const postbody = root;
  const statusMessage = document.createElement("div");
  statusMessage.innerHTML = `
      <table style="background-color: black; margin-bottom:10px;" width="95%" align="center">
      <tbody><tr><td align="center">
      <b>Hang on...</b> Better guides is loading.
      </td></tr></tbody>
      </table>`;
  postbody.insertBefore(statusMessage, postbody.firstChild);

  // TODO Refactor this mess
  function searchBox(el, search_candidate, options = DEFAULT_OPTS) {
    // Fuzzy search box
    const resultList = document.createElement("ul");
    const searchBox = document.createElement("div");
    let selected_result = null;
    let results = [];

    const jumpTo = function (id) {
      el[id].scrollIntoView({
        block: options.alignment,
        inline: "nearest",
        behavior: "auto",
      });
      document
        .querySelectorAll("table.wikitable .bgus_fz_selected")
        .forEach((el) => el.classList.remove("bgus_fz_selected"));
      el[id].parentElement.classList.add("bgus_fz_selected");
    };

    const setSelectedResult = function (i) {
      selected_result = i;
      resultList
        .querySelectorAll(".selected")
        .forEach((el) => el.classList.remove("selected"));
      resultList.children[i].classList.add("selected");
      jumpTo(results[i].id);
    };

    const search = (str) => {
      if (!str) {
        return;
      }
      const regex = new RegExp(
        "^(.*?)([" +
          str
            .split("")
            .map((c) => (c.includes(["\\", "]", "^"]) ? "\\" + c : c))
            .join("])(.*?)([") +
          "])(.*?)$",
        "i"
      );
      const arr = search_candidate
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
            .map((str) => str.join(""));
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
          const clean = (el) => !/[^a-zA-Z0-9]*$/.test(el);
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
            .map((c, i) => (i % 2 ? "<strong>" + c + "</strong>" : c))
            .join("");
          li.addEventListener("click", () => {
            jumpTo(id);
            searchBox.classList.add("bgus_hidden");
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
    searchBox.id = "bgus_fz_searchbox";
    searchBox.classList.add("bgus_hidden");
    searchBox.appendChild(sel);
    searchBox.appendChild(resultList);
    root.appendChild(searchBox);

    // Bind events
    let oldValue = "";
    sel.addEventListener("keyup", function (event) {
      switch (event.keyCode) {
        case 27: // Escape - Hide bar
          searchBox.classList.add("bgus_hidden");
          return;
        case 13: // Enter - Jump to first result and hide bar
          if (results.length > 0) {
            jumpTo(results[selected_result].id);
          }
          searchBox.classList.add("bgus_hidden");
          return;
        case 40: // Down arrow - Select next result
          if (selected_result < results.length - 1) {
            setSelectedResult(selected_result + 1);
          }
          return;
        case 38: // Up arrow - Select previous result
          if (selected_result > 0) {
            setSelectedResult(selected_result - 1);
          }
          return;
        default:
          if (this.value != oldValue) {
            search(this.value);
            oldValue = this.value;
          }
      }
    });

    document.body.addEventListener("keyup", function (ev) {
      if (ev.keyCode === 83) {
        sel.focus();
      }
    });

    document.body.addEventListener("keydown", function (ev) {
      if (ev.shiftKey) {
        switch (ev.keyCode) {
          // SHIFT+S = Fuzzy search
          case 83: {
            searchBox.classList.remove("bgus_hidden");
            sel.value = "";
            return;
          }
        }
      }
    });
  }

  function betterChemistry() {
    // Fix inconsistencies with <p> on random parts
    // Ideally I'd like a <p> or something on every part, wrapping it completely, but for now let's just kill 'em
    new Set(
      Array.from(
        root.querySelectorAll(
          "table.wikitable > tbody > tr:not(:first-child) > td:nth-child(2) p"
        )
      ).map((p) => p.parentNode)
    ).forEach((parent) => {
      const tmp = parent.cloneNode();
      // The cast to Array is necessary because, while childNodes's NodeList technically has a forEach method, it's a live list and operations mess with its lenght in the middle of the loop
      // Nodes can only have one parent so append removes them from the original NodeList and shifts the following one back into the wrong index
      Array.from(parent.childNodes).forEach((el: HTMLElement) => {
        if (el.tagName === "P") {
          tmp.append(...el.childNodes);
        } else {
          tmp.append(el);
        }
      });
      parent.parentNode.replaceChild(tmp, parent);
    });

    // Enrich "x part" with checkboxes and parts
    Array.from(root.querySelectorAll("td"))
      .filter((el) => el.innerText.indexOf(" part") >= 0)
      .map((el) => [el, el.innerHTML])
      .forEach(([el, innerHTML]) => {
        el.innerHTML = innerHTML.replace(
          /((\d+)\s+(?:parts?|units?))(.*?(?:<\s*(\/\s*a|br\s*\/?)\s*>|\n|$))/gi,
          (match, ...m) =>
            `<label class="bgus_part ${
              m[2].includes("</a>") ? "bgus_part_tooltip" : ""
            }" data-amount="${
              m[1]
            }"><input type="checkbox" class='bgus_checkbox bgus_hidden'/> <span class="bgus_part_label" data-src="${
              m[0]
            }">${m[0]}</span></label>${m[2].replace(
              /(<a .+?<\/a>)/gi,
              '<span class="bgus_nobreak bgus_nested_element">$1<span class="bgus_twistie"></span></span>'
            )}`
        );
      });
    Array.from(root.querySelectorAll(".bgus_nested_element")).forEach((el) => {
      el.parentElement.classList.add("bgus_collapsable");
    });
    // Add event to autofill child checkboxes
    document
      .querySelectorAll(".bgus_part_tooltip > .bgus_checkbox")
      .forEach((box) => {
        const tooltip = box.parentElement.nextElementSibling;
        box.addEventListener("click", function () {
          tooltip
            .querySelectorAll(".bgus_checkbox")
            .forEach((el: HTMLInputElement) => (el.checked = this.checked));
        });
      });

    // Add event to collapse subsections
    root.querySelectorAll(".bgus_nested_element").forEach((twistie) => {
      twistie.addEventListener("click", function (evt) {
        twistie.parentElement.classList.toggle("bgus_collapsed");
      });
    });

    // Wrap every recipe with extra metadata
    root.querySelectorAll(".bgus_part").forEach((el: HTMLElement) => {
      if ("parts" in el.parentElement.dataset) {
        el.parentElement.dataset.parts = (
          parseInt(el.parentElement.dataset.parts) + parseInt(el.dataset.amount)
        ).toString();
      } else {
        el.parentElement.dataset.parts = el.dataset.amount;
      }
    });

    const setPartSize = function (labels, ml) {
      labels.forEach((el) => {
        const part = el.parentElement.dataset.amount;
        const total = el.parentElement.parentElement.dataset.parts;
        const amt = Math.ceil(ml * (part / total));
        el.innerHTML = `${amt} ml`;
        // Lookup tooltips
        let next = el.parentElement.nextElementSibling;
        while (next) {
          if (next.classList.contains("tooltip")) {
            let sublabels = [];
            next.querySelector(".tooltiptext").childNodes.forEach((ch) => {
              if (ch.classList && ch.classList.contains("bgus_part")) {
                sublabels.push(ch.querySelector(".bgus_part_label"));
              }
            });
            setPartSize(sublabels, amt);
          }
          if (next.classList.contains("bgus_part")) {
            // Done searching
            break;
          }
          next = next.nextElementSibling;
        }
      });
    };

    root.classList.add("bchem");
    // Init fuzzy search with elements
    const el = Array.from(
      root.querySelectorAll(
        "table.wikitable > tbody > tr:not(:first-child) > th"
      )
    );
    const name = el.map((elem) => {
      let name = "";
      elem.childNodes.forEach((t) => {
        if (t instanceof Text) {
          name += t.textContent;
        }
      });
      return name.trim();
    });
    searchBox(
      el,
      name.map((e, i) => ({ id: i, str: e }))
    );

    document.body.addEventListener("keydown", function (ev) {
      if (ev.shiftKey) {
        switch (ev.keyCode) {
          // SHIFT+C = Toggle checkboxes
          case 67: {
            root.classList.toggle("bgus_cbox");
            root
              .querySelectorAll(".bgus_checkbox:checked")
              .forEach((el: HTMLInputElement) => {
                el.checked = false;
              });
            return;
          }

          // SHIFT+B = Set whole size (beaker?) for parts/units
          case 66: {
            let size = parseInt(prompt("Write target ml (0 to reset)", "90"));
            if (isNaN(size) || size <= 0) {
              // Reset to parts/unit
              root
                .querySelectorAll(".bgus_part_label")
                .forEach((el: HTMLElement) => (el.innerHTML = el.dataset.src));
              return;
            }
            setPartSize(
              root.querySelectorAll("td > .bgus_part > .bgus_part_label"),
              +size
            );
            return;
          }
        }
      }
    });
  }

  function betterGeneric() {
    const el = Array.from(
      root.querySelectorAll("div.mw-headline-cont[id][data-name]")
    );
    const name = el.map((elem: HTMLDivElement) => elem.dataset.name.trim());

    // Init fuzzy search with headlines
    searchBox(
      el,
      name.map((e, i) => ({ id: i, str: e })),
      { alignment: "start" }
    );
  }

  window.requestAnimationFrame(() => {
    switch (docname) {
      case "Guide_to_chemistry":
        betterChemistry();
        break;
      default:
        betterGeneric();
        break;
    }
    // Everything is loaded, remove loading bar
    statusMessage.innerHTML = "";
  });
}
