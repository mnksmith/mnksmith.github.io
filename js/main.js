(function () {
  // Hamburger menu toggle
  var burger = document.querySelector('.nav-burger');
  var navLinks = document.querySelector('.wing-nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + id);
  });

  function fmtTime(s) {
    if (!isFinite(s)) return '0:00';
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  document.querySelectorAll('[data-audio-player]').forEach(function (player) {
    var audio = player.querySelector('audio');
    var playBtn = player.querySelector('.mixtape-play');
    var progress = player.querySelector('.mixtape-progress');
    var fill = player.querySelector('.mixtape-progress-fill');
    var current = player.querySelector('.mixtape-current');
    var duration = player.querySelector('.mixtape-duration');
    if (!audio || !playBtn) return;

    audio.addEventListener('loadedmetadata', function () {
      if (duration) duration.textContent = fmtTime(audio.duration);
    });
    audio.addEventListener('timeupdate', function () {
      if (!audio.duration) return;
      var pct = (audio.currentTime / audio.duration) * 100;
      if (fill) fill.style.width = pct + '%';
      if (current) current.textContent = fmtTime(audio.currentTime);
    });
    audio.addEventListener('ended', function () {
      playBtn.classList.remove('playing');
      playBtn.setAttribute('aria-label', 'Play');
    });

    audio.addEventListener('error', function () {
      console.error('[mixtape] audio error', audio.error, 'src:', audio.currentSrc);
    });

    playBtn.addEventListener('click', function () {
      if (audio.paused) {
        var p = audio.play();
        if (p && p.catch) {
          p.catch(function (err) { console.error('[mixtape] play() failed', err); });
        }
        playBtn.classList.add('playing');
        playBtn.setAttribute('aria-label', 'Pause');
      } else {
        audio.pause();
        playBtn.classList.remove('playing');
        playBtn.setAttribute('aria-label', 'Play');
      }
    });

    if (progress) {
      progress.addEventListener('click', function (e) {
        if (!audio.duration) return;
        var rect = progress.getBoundingClientRect();
        var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = audio.duration * pct;
      });
    }
  });
})();
