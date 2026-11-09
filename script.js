// メニューの開閉（スマホ用）
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });
  siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'メニューを開く');
  }));
}

// 「images/menma-standing.png」に実際の立ち絵を入れると自動で切り替わります。
const standingImage = document.getElementById('standingImage');
const characterPlaceholder = document.getElementById('characterPlaceholder');
if (standingImage && characterPlaceholder) {
  standingImage.addEventListener('load', () => {
    standingImage.hidden = false;
    characterPlaceholder.hidden = true;
    characterPlaceholder.style.display = 'none';
  });
  standingImage.addEventListener('error', () => {
    standingImage.hidden = true;
    characterPlaceholder.hidden = false;
    characterPlaceholder.style.display = '';
  });
  if (standingImage.complete && standingImage.naturalWidth > 0) {
    standingImage.hidden = false;
    characterPlaceholder.hidden = true;
    characterPlaceholder.style.display = 'none';
  }
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
