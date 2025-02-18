document.addEventListener('DOMContentLoaded', function() {
  // Determine locale from URL. Adjust this logic as needed.
  const pathSegments = window.location.pathname.split('/');
  let localeCode = 'en-US'; // default

  if (pathSegments.includes('ru')) {
    localeCode = 'ru-RU';
  } else if (pathSegments.includes('ua')) {
    localeCode = 'uk-UA';
  }

  // Options for day, month (long), year formatting.
  const options = { day: 'numeric', month: 'long', year: 'numeric' };

  document.querySelectorAll('.metadata-updated-date').forEach(function(el) {
    // Use inner text as the date source.
    let isoDate = el.textContent.trim();
    // Append time to ensure proper parsing in all browsers.
    isoDate += 'T00:00:00';
    const dateObj = new Date(isoDate);
    if (!isNaN(dateObj)) {
      // Format the date using the locale.
      el.textContent = dateObj.toLocaleDateString(localeCode, options);
    } else {
      console.error('Invalid date format:', isoDate);
    }
  });
});
