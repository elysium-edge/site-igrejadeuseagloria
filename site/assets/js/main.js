(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -36px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const emberField = document.getElementById('particulas');
  if (emberField && !reduceMotion) {
    const particleCount = window.innerWidth < 620 ? 11 : 19;
    for (let index = 0; index < particleCount; index += 1) {
      const ember = document.createElement('span');
      const drift = `${Math.round(Math.random() * 46 - 23)}px`;
      ember.className = 'ember';
      ember.style.left = `${Math.round(Math.random() * 100)}%`;
      ember.style.setProperty('--size', `${Math.random() * 2.2 + 1.5}px`);
      ember.style.setProperty('--duration', `${Math.round(Math.random() * 8 + 10)}s`);
      ember.style.setProperty('--delay', `${-Math.round(Math.random() * 18)}s`);
      ember.style.setProperty('--drift', drift);
      emberField.appendChild(ember);
    }
  }

  const mapLink = document.getElementById('maps-link');
  const mapContainer = document.getElementById('map-container');
  if (mapLink && mapContainer) {
    const mapUrl = mapLink.dataset.mapsUrl.trim();
    const embedUrl = mapContainer.dataset.mapsEmbedUrl.trim();
    const isMapsUrl = (value) => {
      try {
        const parsed = new URL(value);
        return parsed.protocol === 'https:' && /(^|\.)google\.[a-z.]+$|(^|\.)goo\.gl$/.test(parsed.hostname);
      } catch {
        return false;
      }
    };
    const isConfiguredMapsEmbedUrl = (value) => {
      try {
        const parsed = new URL(value);
        return parsed.protocol === 'https:'
          && parsed.hostname === 'www.google.com'
          && parsed.pathname === '/maps/embed/v1/place'
          && Boolean(parsed.searchParams.get('key')?.trim())
          && Boolean(parsed.searchParams.get('q')?.trim());
      } catch {
        return false;
      }
    };

    if (mapUrl && isMapsUrl(mapUrl)) {
      mapLink.href = mapUrl;
      mapLink.target = '_blank';
      mapLink.rel = 'noopener';
      mapLink.removeAttribute('aria-disabled');
      mapLink.removeAttribute('tabindex');
      mapLink.classList.remove('button--disabled');
      mapLink.title = 'Abrir a localização no Google Maps em uma nova aba';
    }

    if (embedUrl && isConfiguredMapsEmbedUrl(embedUrl)) {
      const frame = document.createElement('iframe');
      frame.title = 'Mapa de localização da Igreja Evangélica Pentecostal – Deus é a Glória';
      frame.src = embedUrl;
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.setAttribute('allowfullscreen', '');
      mapContainer.replaceChildren(frame);
    }
  }
})();
