import { nextAnimationFrame } from "../../utils";

function expandPage(root: HTMLElement) {
  // Show all sections
  root.querySelectorAll<HTMLElement>("div.hidden").forEach((div) => {
    div.style.display = "block";
    div.style.opacity = "1";
  });

  // Hide buttons
  root.querySelector<HTMLElement>(".action_buttons").style.display = "none";

  // Remove vertical centering
  root.classList.remove("center");
}

export function welcomeScript(root: HTMLElement): void {
  const buttonContainer = root.querySelector<HTMLElement>(".action_buttons");
  root.querySelectorAll<HTMLDivElement>("div[data-name]").forEach((sec) => {
    const { name } = sec.dataset;
    const button = document.createElement("button");
    button.className = "pretty-button";
    button.appendChild(document.createTextNode(name));
    button.addEventListener("click", async () => {
      expandPage(root);
      await nextAnimationFrame();
      sec.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    });
    buttonContainer.appendChild(button);
  });
}

export default { welcomeScript };
