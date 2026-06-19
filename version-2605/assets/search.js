(function () {
  var input = document.querySelector('[data-search-page-input]');
  var results = document.querySelector('[data-search-results]');
  var title = document.querySelector('[data-search-title]');
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  var movies = window.MOVIE_SEARCH_INDEX || [];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function card(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a class="movie-thumb" href="' + escapeHtml(movie.url) + '">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" data-fallback-image />',
      '    <span class="thumb-gradient"></span>',
      '    <span class="play-badge">▶</span>',
      '    <span class="quality-badge">高清</span>',
      '  </a>',
      '  <div class="movie-info">',
      '    <a class="movie-title" href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function render(query) {
    var q = query.trim().toLowerCase();
    var list = movies.filter(function (movie) {
      if (!q) {
        return true;
      }
      return movie.searchText.indexOf(q) !== -1;
    }).slice(0, 240);

    if (title) {
      title.textContent = q ? '“' + query.trim() + '”的搜索结果（' + list.length + '）' : '全部影片检索';
    }

    if (!results) {
      return;
    }

    if (!list.length) {
      results.innerHTML = '<div class="search-empty">没有找到匹配影片，请尝试更换关键词。</div>';
      return;
    }

    results.innerHTML = list.map(card).join('');
    results.querySelectorAll('[data-fallback-image]').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('image-missing');
      }, { once: true });
    });
  }

  if (input) {
    input.value = initialQuery;
    input.addEventListener('input', function () {
      render(input.value);
    });
  }

  render(initialQuery);
}());
