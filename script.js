const tabs = Array.from(document.querySelectorAll('.mission-tab'));
const panels = Array.from(document.querySelectorAll('.content-panel'));
const fileName = document.getElementById('activeFileName');
const clock = document.getElementById('localClock');

function activatePanel(panelId, updateHash = true) {
  const nextPanel = document.getElementById(panelId);

  if (!nextPanel) return;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.panel === panelId;

    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.id === panelId;

    panel.classList.toggle('active', isActive);
    panel.setAttribute('aria-hidden', String(!isActive));
  });

  fileName.textContent =
    nextPanel.dataset.title || panelId.toUpperCase();

  if (updateHash) {
    history.replaceState(null, '', `#${panelId}`);
  }
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activatePanel(tab.dataset.panel);
  });

  tab.addEventListener('keydown', (event) => {
    if (
      ![
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End'
      ].includes(event.key)
    ) {
      return;
    }

    event.preventDefault();

    const currentIndex = tabs.indexOf(tab);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    }

    if (event.key === 'ArrowLeft') {
      nextIndex =
        (currentIndex - 1 + tabs.length) % tabs.length;
    }

    if (event.key === 'Home') {
      nextIndex = 0;
    }

    if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    tabs[nextIndex].focus();

    activatePanel(
      tabs[nextIndex].dataset.panel
    );
  });
});

function updateClock() {
  const now = new Date();

  clock.textContent =
    now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
}

updateClock();

setInterval(updateClock, 1000);

const initialPanel =
  location.hash.replace('#', '');

if (
  initialPanel &&
  document.getElementById(initialPanel)
) {
  activatePanel(initialPanel, false);
} else {
  activatePanel('about', false);
}