import { registerProcess, registerScript } from "../register";
import { parseTable, makeTable } from "../utils";
import { registerSearchEntries } from "../search";

const page = "Infections";

registerProcess(page, (root) => {
  const diseaseTable = root.querySelector<HTMLElement>(
    "#Simple_Diseases .wikitable"
  );
  const diseases = parseTable(diseaseTable).map((row) => {
    const diseaseBlock = document.createElement("td");
    diseaseBlock.innerHTML = `
    <div class="disease-name btab-name">${row["Disease Name"].innerHTML}</div>
    <p class="vector">${row["Vector Name"].innerHTML}</p>
    <p class="source">${row["Source"].innerHTML}</p>
    <p class="spread">${row["Spread"].innerHTML}</p>
    <p class="description">${row["Description"].innerHTML}</p>
    `;
    return {
      Disease: diseaseBlock,
      Cure: row["Cure"],
    };
  });

  const diseaseBetterTable = makeTable(["Disease", "Cure"], diseases);
  diseaseBetterTable.className = "disease-ext tgh-btab wikitable";
  diseaseTable.replaceWith(diseaseBetterTable);

  const symptomsTable = root.querySelector<HTMLElement>(
    "#Symptoms_Table .wikitable"
  );
  const symptoms = parseTable(symptomsTable)
    .sort(
      (a, b) =>
        parseInt(a["Level"].textContent, 10) -
        parseInt(b["Level"].textContent, 10)
    )
    .map((row) => {
      const symptomBlock = document.createElement("td");
      symptomBlock.innerHTML = `
    <div class="disease-name btab-name">${row["Symptom"].innerHTML}</div>
    <p class="level">${row["Level"].innerHTML}</p>
    <p class="chemical">${row["Required Chemical"].innerHTML}</p>
    <p class="description">${row["Effect"].innerHTML}</p>
    `;
      const symptomStats = document.createElement("td");
      symptomStats.innerHTML = `
    <table class="stats">
      <tr><th>Stealth</th><td>${row["Stealth"].innerHTML}</td></tr>
      <tr><th>Resistance</th><td>${row["Resistance"].innerHTML}</td></tr>
      <tr><th>Stage speed</th><td>${row["Stage speed"].innerHTML}</td></tr>
      <tr><th>Transmission</th><td>${row["Transmission"].innerHTML}</td></tr>
    </table>
    `;
      const thresholds = row["Threshold (hover mouse over for details)"];
      thresholds.innerHTML = `<ul class="thresholds"><li>${thresholds.innerHTML
        .split(",")
        .join("</li><li>")}</li></ul>`;
      return {
        Symptom: symptomBlock,
        Stats: symptomStats,
        Thresholds: thresholds,
      };
    });
  const symptomsBetterTable = makeTable(
    ["Symptom", "Stats", "Thresholds"],
    symptoms
  );
  symptomsBetterTable.className = "symptoms-ext tgh-btab wikitable";
  symptomsTable.replaceWith(symptomsBetterTable);
});

registerScript(page, (root) => {
  // Init fuzzy search with elements
  const diseases = Array.from(
    root.querySelectorAll<HTMLElement>(".disease-ext tr:not(:first-child)")
  );
  registerSearchEntries(
    diseases.map((element, id) => ({
      page,
      name: element.querySelector(".disease-name").textContent.trim(),
      element,
      alignment: "center",
      id,
    }))
  );
  const symptoms = Array.from(
    root.querySelectorAll<HTMLElement>(
      ".symptoms-ext > tbody > tr:not(:first-child)"
    )
  );
  registerSearchEntries(
    symptoms.map((element, id) => ({
      page,
      name: element.querySelector(".disease-name").textContent.trim(),
      element,
      alignment: "center",
      id,
    }))
  );
});
