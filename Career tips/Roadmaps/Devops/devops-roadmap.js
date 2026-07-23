(() => {
  const storageKey = "cyvora-devops-roadmap-v1";

  const readState = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  };

  const state = readState();

  const writeState = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // localStorage can be unavailable in some private modes; ignore quietly.
    }
  };

  const setTab = (button) => {
    const target = button.dataset.tabTarget;
    const tabShell = button.closest(".tab-shell");
    if (!tabShell) return;

    const buttons = tabShell.querySelectorAll(".tab-button");
    const panels = tabShell.querySelectorAll(".tab-panel");

    buttons.forEach((btn) => {
      const active = btn === button;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
      btn.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.id === `tab-${target}`;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  };

  const updateMonth = (month) => {
    const completed = Boolean(state[`month-${month}`]);
    const button = document.querySelector(`[data-month-complete="${month}"]`);
    const fill = document.querySelector(`[data-month-fill="${month}"]`);
    const label = document.querySelector(`[data-month-text="${month}"]`);
    const details = document.querySelector(`.timeline-month[data-month="${month}"]`);
    const status = details?.querySelector(".month-status");

    if (button) {
      button.classList.toggle("is-complete", completed);
      button.textContent = completed ? "Completed" : "Mark Complete";
      button.setAttribute("aria-pressed", String(completed));
    }
    if (fill) fill.style.width = completed ? "100%" : "0%";
    if (label) label.textContent = completed ? "100%" : "0%";
    if (details) details.classList.toggle("is-complete", completed);
    if (status) status.textContent = completed ? "Done" : status.dataset.defaultLabel || status.textContent;
  };

  const updateOverall = () => {
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    const completedMonths = months.filter((month) => state[`month-${month}`]).length;
    const overallFill = document.querySelector("[data-overall-fill]");
    const overallText = document.querySelector("[data-overall-progress]");
    const percent = Math.round((completedMonths / months.length) * 100);

    if (overallFill) overallFill.style.width = `${percent}%`;
    if (overallText) overallText.textContent = `${completedMonths} of 12 months completed`;
  };

  const updateResources = () => {
    document.querySelectorAll("[data-progress-key]").forEach((input) => {
      const key = input.dataset.progressKey;
      const checked = Boolean(state[key]);
      input.checked = checked;
      input.setAttribute("aria-checked", String(checked));
    });
  };

  const bindCompletionControls = () => {
    document.querySelectorAll("[data-month-complete]").forEach((button) => {
      const month = button.dataset.monthComplete;
      button.addEventListener("click", () => {
        state[`month-${month}`] = !state[`month-${month}`];
        writeState();
        updateMonth(month);
        updateOverall();
      });
    });

    document.querySelectorAll("[data-progress-key]").forEach((input) => {
      input.addEventListener("change", () => {
        state[input.dataset.progressKey] = input.checked;
        writeState();
      });
    });
  };

  const bindTabs = () => {
    document.querySelectorAll(".tab-shell").forEach((shell) => {
      const buttons = Array.from(shell.querySelectorAll(".tab-button"));
      buttons.forEach((button, index) => {
        button.tabIndex = index === 0 ? 0 : -1;
        button.addEventListener("click", () => setTab(button));
      });
    });
  };

  const bindStickyNav = () => {
    const nav = document.querySelector(".roadmap-sticky-nav");
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll("a[href^='#']"));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const highlight = (id) => {
      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) highlight(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.08, 0.18, 0.3] }
    );

    sections.forEach((section) => observer.observe(section));

    links.forEach((link) => {
      link.addEventListener("click", () => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  const bindPlaceholders = () => {
    document.querySelectorAll("[data-download-placeholder]").forEach((button) => {
      button.addEventListener("click", () => {
        const timeline = document.querySelector("#timeline");
        timeline?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  const init = () => {
    document.querySelectorAll(".timeline-month").forEach((details) => {
      const month = details.dataset.month;
      const status = details.querySelector(".month-status");
      if (status) status.dataset.defaultLabel = status.textContent;
      updateMonth(month);
    });
    updateResources();
    updateOverall();
    bindTabs();
    bindCompletionControls();
    bindStickyNav();
    bindPlaceholders();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
