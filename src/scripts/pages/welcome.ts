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
  const expandLink = document.getElementById("welcome_expand");
  expandLink.addEventListener("click", async () => {
    expandPage(root);
    const featureDiv = root.querySelector<HTMLDivElement>(".features");
    await nextAnimationFrame();
    featureDiv.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: "smooth",
    });
  });
}

export default { welcomeScript };
