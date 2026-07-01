const clues = document.querySelectorAll('.clue');
const caseBoard = document.getElementById('caseBoard');
const detailOverlay = document.getElementById('detailOverlay');
const detailTitle = document.getElementById('detailTitle');
const detailType = document.getElementById('detailType');
const detailYear = document.getElementById('detailYear');
const detailText = document.getElementById('detailText');
const detailClose = document.getElementById('detailClose');

let dragState = null;
let highestZ = 2;

clues.forEach((clue) => {
  const zIndex = Number.parseInt(window.getComputedStyle(clue).zIndex, 10);
  if (!Number.isNaN(zIndex)) {
    highestZ = Math.max(highestZ, zIndex);
  }
});

function showDetail(item) {
  const { title, type, year, detail } = item.dataset;

  detailTitle.textContent = title || 'Untitled Clue';
  detailType.textContent = type || 'Creative Direction';
  detailYear.textContent = year || '';
  detailText.innerHTML = '';
  const paragraphs = (detail || 'No additional details available.').split('||');
  paragraphs.forEach((para) => {
    const p = document.createElement('p');
    p.textContent = para.trim();
    if (p.textContent) detailText.appendChild(p);
  });
  detailText.scrollTop = 0;
  detailOverlay.hidden = false;
}

function closeDetail() {
  detailOverlay.hidden = true;
  detailTitle.textContent = 'Select any item on the board.';
  detailType.textContent = 'Creative Direction';
  detailYear.textContent = '2026';
  detailText.innerHTML = '<p>Click a photo, clipping, or note to reveal the story behind the clue.</p>';
}

function bringToFront(clue) {
  highestZ += 1;
  clue.style.zIndex = String(highestZ);
}

function lockClueToPixels(clue) {
  const left = clue.offsetLeft;
  const top = clue.offsetTop;
  const width = clue.offsetWidth;

  clue.style.left = `${left}px`;
  clue.style.top = `${top}px`;
  clue.style.width = `${width}px`;
  clue.style.marginLeft = '0';
}

clues.forEach((clue) => {
  clue.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return;
    }

    lockClueToPixels(clue);
    bringToFront(clue);

    const boardRect = caseBoard.getBoundingClientRect();
    const clueLeft = boardRect.left + clue.offsetLeft;
    const clueTop = boardRect.top + clue.offsetTop;
    dragState = {
      clue,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - clueLeft,
      offsetY: event.clientY - clueTop,
      moved: false,
    };

    clue.classList.add('dragging');
    clue.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  clue.addEventListener('click', () => {
    if (clue.dataset.suppressClick === 'true') {
      clue.dataset.suppressClick = 'false';
      return;
    }

    showDetail(clue);
  });
});

document.addEventListener('pointermove', (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  const { clue, startX, startY, offsetX, offsetY } = dragState;
  const boardRect = caseBoard.getBoundingClientRect();
  const maxLeft = boardRect.width - clue.offsetWidth;
  const maxTop = boardRect.height - clue.offsetHeight;

  let nextLeft = event.clientX - boardRect.left - offsetX;
  let nextTop = event.clientY - boardRect.top - offsetY;

  nextLeft = Math.max(0, Math.min(nextLeft, maxLeft));
  nextTop = Math.max(0, Math.min(nextTop, maxTop));

  clue.style.left = `${nextLeft}px`;
  clue.style.top = `${nextTop}px`;

  if (!dragState.moved) {
    const movedX = Math.abs(event.clientX - startX);
    const movedY = Math.abs(event.clientY - startY);
    if (movedX > 4 || movedY > 4) {
      dragState.moved = true;
    }
  }
});

document.addEventListener('pointerup', (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  const { clue, moved, pointerId } = dragState;

  clue.classList.remove('dragging');
  if (clue.hasPointerCapture(pointerId)) {
    clue.releasePointerCapture(pointerId);
  }

  if (moved) {
    clue.dataset.suppressClick = 'true';
  }

  dragState = null;
});

detailClose.addEventListener('click', closeDetail);

detailOverlay.addEventListener('click', (event) => {
  if (event.target === detailOverlay) {
    closeDetail();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !detailOverlay.hidden) {
    closeDetail();
  }
});
