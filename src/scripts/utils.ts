/**
 * Find closest parent that meets a specified condition
 * @param base Element to start from
 * @param matchFn Matching function, returns true if condition is met
 */
export function findParent(
  base: HTMLElement,
  matchFn: (candidate: HTMLElement) => boolean
): HTMLElement | null {
  let parent = base.parentElement;
  while (parent != null) {
    if (matchFn(parent)) {
      break;
    }
    parent = parent.parentElement;
  }
  return parent;
}

export type TableRowData = Record<string, HTMLElement>;
export type TableData = TableRowData[];

/**
 * Parse a HTML table and return a dictionary of rows as dictionaries
 * @param table Table element or any element from where you can query for "th" etc.
 */
export function parseTable(table: HTMLElement): TableData {
  const [headerRow, ...valueRows] = Array.from(table.querySelectorAll("tr"));
  const headers = Array.from(
    headerRow.querySelectorAll<HTMLTableRowElement>("th")
  ).map((th) => th.textContent.trim());
  return valueRows.map((tr) => {
    const obj = {};
    tr.querySelectorAll<HTMLElement>("td,th").forEach((val, i) => {
      obj[headers[i]] = val;
    });
    return obj;
  });
}

/**
 * Make table from generated or mutated (from parseTable) table data
 * @param headers List of strings to use as table headers, must be keys in object
 * @param data Table row data
 * @param decorator (Optional) decorator function to change table row elements
 */
export function makeTable(
  headers: string[],
  data: TableData,
  decorator?: (data: TableRowData, tr: HTMLTableRowElement) => void
): HTMLTableElement {
  const table = document.createElement("table");
  if (data.length < 1) {
    return table;
  }
  // Make header row
  const headerRow = document.createElement("tr");
  headers.forEach((head) => {
    const headerCell = document.createElement("th");
    headerCell.appendChild(document.createTextNode(head));
    headerRow.appendChild(headerCell);
  });
  table.appendChild(headerRow);

  // Make rows
  data.forEach((row) => {
    const tableRow = document.createElement("tr");
    headers.forEach((key) => {
      let cell = null;
      if (row[key].tagName === "TD" || row[key].tagName === "TH") {
        cell = row[key];
      } else {
        cell = document.createElement("td");
        cell.appendChild(row[key]);
      }
      tableRow.appendChild(cell);
    });
    if (decorator) {
      decorator(row, tableRow);
    }
    table.appendChild(tableRow);
  });

  return table;
}

export default { findParent, parseTable, makeTable };
