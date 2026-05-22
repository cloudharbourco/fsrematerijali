(() => {
  'use strict';

  const EMAIL = ['zoraninjic', 'yandex.com'].join('@');
  const GITHUB_URL = 'https://cloudharbourco.github.io/fsrematerijali/';
  const root = document.body;
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const themeButtons = [...document.querySelectorAll('[data-theme-choice]')];
  const revealEmail = document.getElementById('revealEmail');
  const sendEmail = document.getElementById('sendEmail');
  const emailText = document.getElementById('emailText');
  const copyEmail = document.getElementById('copyEmail');
  const copyStatus = document.getElementById('copyStatus');
  const year = document.getElementById('year');
  const bookmarkGithub = document.getElementById('bookmarkGithub');
  const shareGithub = document.getElementById('shareGithub');
  const shareStatus = document.getElementById('shareStatus');
  const copyGithub = document.getElementById('copyGithub');
  const githubCopyStatus = document.getElementById('githubCopyStatus');

  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('fm-theme', theme);
    themeButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.themeChoice === theme);
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
    });
  };

  const initTheme = () => {
    const saved = localStorage.getItem('fm-theme');
    setTheme(['light', 'gray', 'dark'].includes(saved) ? saved : 'dark');
    themeButtons.forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.themeChoice)));
  };

  const closeMobileNav = () => {
    root.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  };

  const initNavigation = () => {
    navToggle?.addEventListener('click', () => {
      const isOpen = root.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => closeMobileNav());
    });

    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });

    sections.forEach((section) => observer.observe(section));
  };



  const setStatus = (element, message, delay = 3600) => {
    if (!element) return;
    element.textContent = message;
    if (delay) {
      window.setTimeout(() => {
        element.textContent = '';
      }, delay);
    }
  };

  const copyText = async (text, statusElement, successMessage) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(statusElement, successMessage);
      return true;
    } catch (error) {
      setStatus(statusElement, `Kopirajte ručno: ${text}`, 6000);
      return false;
    }
  };

  const initSharingTools = () => {
    bookmarkGithub?.addEventListener('click', async () => {
      await copyText(GITHUB_URL, shareStatus, 'GitHub link je kopiran. Za favorite pritisnite Ctrl+D na računalu ili opciju Bookmark/Add to favorites u pregledniku.');
    });

    shareGithub?.addEventListener('click', async () => {
      const shareData = {
        title: 'Fakultetski materijali - Elektrotehnika',
        text: 'Link za fakultetske materijale iz elektrotehnike:',
        url: GITHUB_URL
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          setStatus(shareStatus, 'Link je spreman za dijeljenje.');
          return;
        } catch (error) {
          if (error?.name === 'AbortError') return;
        }
      }

      await copyText(GITHUB_URL, shareStatus, 'GitHub link je kopiran za dijeljenje.');
    });

    copyGithub?.addEventListener('click', async () => {
      await copyText(GITHUB_URL, githubCopyStatus, 'GitHub link je kopiran.');
    });
  };

  const initFAQ = () => {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const button = item.querySelector('.faq-question');
      button?.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        button.setAttribute('aria-expanded', String(isOpen));
      });
    });
  };

  const revealContactEmail = () => {
    if (emailText) {
      emailText.textContent = EMAIL;
      emailText.classList.remove('email-hidden');
    }

    if (sendEmail) {
      sendEmail.href = `mailto:${EMAIL}`;
      sendEmail.classList.remove('hidden');
    }

    copyEmail?.classList.remove('hidden');
    revealEmail?.classList.add('hidden');

    if (copyStatus) copyStatus.textContent = 'Mail je prikazan.';
    window.setTimeout(() => {
      if (copyStatus) copyStatus.textContent = '';
    }, 1800);
  };

  const initContactEmail = () => {
    revealEmail?.addEventListener('click', revealContactEmail);

    copyEmail?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(EMAIL);
        copyStatus.textContent = 'Email je kopiran u međuspremnik.';
      } catch (error) {
        copyStatus.textContent = EMAIL;
      }

      window.setTimeout(() => {
        if (copyStatus) copyStatus.textContent = '';
      }, 2600);
    });
  };

  const initReveals = () => {
    const elements = [...document.querySelectorAll('.reveal')];
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach((element) => observer.observe(element));
  };

  const initExternalLinks = () => {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      link.addEventListener('click', () => {
        link.setAttribute('aria-label', `${link.textContent.trim()} - otvara se u novoj kartici`);
      });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    year.textContent = new Date().getFullYear();
    initTheme();
    initNavigation();
    initFAQ();
    initContactEmail();
    initSharingTools();
    initReveals();
    initExternalLinks();
  });
})();
