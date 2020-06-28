import { nextAnimationFrame } from "../../utils";

export function welcomeScript(root: HTMLElement): void {
  const expandLink = document.getElementById("welcome_expand");
  expandLink.addEventListener("click", async () => {
    const featureDiv = root.querySelector<HTMLDivElement>(".features");
    featureDiv.style.display = "block";
    root.classList.remove("center");
    await nextAnimationFrame();
    featureDiv.style.opacity = "1";
    featureDiv.scrollIntoView({
      block: "start",
      inline: "nearest",
      behavior: "smooth",
    });
  });
}

export default { welcomeScript };
