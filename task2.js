// ── 5 публичных API для последовательных запросов ───────────────────────────
const APIS = [
  {
    url: 'https://api.adviceslip.com/advice',
    label: 'Совет дня (Advice Slip)',
    extract: d => d.slip.advice
  },
  {
    url: 'https://official-joke-api.appspot.com/random_joke',
    label: 'Случайная шутка (Official Joke API)',
    extract: d => `${d.setup} — ${d.punchline}`
  },
  {
    url: 'https://api.agify.io/?name=Michael',
    label: 'Предсказание возраста (Agify)',
    extract: d => `Имя "${d.name}" → вероятный возраст: ${d.age} лет`
  },
  {
    url: 'https://api.genderize.io/?name=Alex',
    label: 'Определение пола (Genderize)',
    extract: d => `Имя "${d.name}" → пол: ${d.gender} (вероятность: ${Math.round(d.probability * 100)}%)`
  },
  {
    url: 'https://api.nationalize.io/?name=James',
    label: 'Определение национальности (Nationalize)',
    extract: d => {
      const top = d.country.slice(0, 3).map(c => `${c.country_id} (${Math.round(c.probability * 100)}%)`).join(', ');
      return `Имя "${d.name}" → вероятные страны: ${top}`;
    }
  }
];

// ── Вспомогательные функции для вывода ──────────────────────────────────────
function clearLog(el) {
  el.textContent = '';
}

function appendLogEntry(el, label, text, status = 'ok') {
  const entry = document.createElement('div');
  entry.className = 'log-entry' + (status === 'error' ? ' log-error' : '');

  const strong = document.createElement('strong');
  strong.textContent = label;

  entry.appendChild(strong);
  entry.appendChild(document.createElement('br'));
  entry.appendChild(document.createTextNode(text));
  el.appendChild(entry);
}

function appendPending(el, label) {
  const entry = document.createElement('div');
  entry.className = 'log-entry log-pending';
  entry.id = 'pending-' + label.replace(/\W/g, '_');

  const strong = document.createElement('strong');
  strong.textContent = label;

  const span = document.createElement('span');
  span.appendChild(document.createTextNode(' '));
  const spinner = document.createElement('span');
  spinner.className = 'spinner';
  spinner.style.width = '12px';
  spinner.style.height = '12px';
  span.appendChild(spinner);

  entry.appendChild(strong);
  entry.appendChild(span);
  el.appendChild(entry);
  return entry;
}

function setDisabled(btn, state) {
  btn.disabled = state;
}

// ════════════════════════════════════════════════════════════════════════════
// ВЕРСИЯ 1 — Нативный XHR, последовательные вложенные onload
// ════════════════════════════════════════════════════════════════════════════
document.getElementById('run-xhr').addEventListener('click', function () {
  const log = document.getElementById('log-xhr');
  clearLog(log);
  setDisabled(this, true);
  const btn = this;

  // Каждый запрос вложен в onload предыдущего (классическая «лесенка»)
  const xhr1 = new XMLHttpRequest();
  xhr1.open('GET', APIS[0].url);
  const p1 = appendPending(log, APIS[0].label);
  xhr1.onload = function () {
    p1.remove();
    const data = JSON.parse(xhr1.responseText);
    appendLogEntry(log, APIS[0].label, APIS[0].extract(data));

    const xhr2 = new XMLHttpRequest();
    xhr2.open('GET', APIS[1].url);
    const p2 = appendPending(log, APIS[1].label);
    xhr2.onload = function () {
      p2.remove();
      const data2 = JSON.parse(xhr2.responseText);
      appendLogEntry(log, APIS[1].label, APIS[1].extract(data2));

      const xhr3 = new XMLHttpRequest();
      xhr3.open('GET', APIS[2].url);
      const p3 = appendPending(log, APIS[2].label);
      xhr3.onload = function () {
        p3.remove();
        const data3 = JSON.parse(xhr3.responseText);
        appendLogEntry(log, APIS[2].label, APIS[2].extract(data3));

        const xhr4 = new XMLHttpRequest();
        xhr4.open('GET', APIS[3].url);
        const p4 = appendPending(log, APIS[3].label);
        xhr4.onload = function () {
          p4.remove();
          const data4 = JSON.parse(xhr4.responseText);
          appendLogEntry(log, APIS[3].label, APIS[3].extract(data4));

          const xhr5 = new XMLHttpRequest();
          xhr5.open('GET', APIS[4].url);
          const p5 = appendPending(log, APIS[4].label);
          xhr5.onload = function () {
            p5.remove();
            const data5 = JSON.parse(xhr5.responseText);
            appendLogEntry(log, APIS[4].label, APIS[4].extract(data5));
            setDisabled(btn, false);
          };
          xhr5.onerror = function () {
            p5.remove();
            appendLogEntry(log, APIS[4].label, 'Ошибка запроса', 'error');
            setDisabled(btn, false);
          };
          xhr5.send();
        };
        xhr4.onerror = function () {
          p4.remove();
          appendLogEntry(log, APIS[3].label, 'Ошибка запроса', 'error');
          setDisabled(btn, false);
        };
        xhr4.send();
      };
      xhr3.onerror = function () {
        p3.remove();
        appendLogEntry(log, APIS[2].label, 'Ошибка запроса', 'error');
        setDisabled(btn, false);
      };
      xhr3.send();
    };
    xhr2.onerror = function () {
      p2.remove();
      appendLogEntry(log, APIS[1].label, 'Ошибка запроса', 'error');
      setDisabled(btn, false);
    };
    xhr2.send();
  };
  xhr1.onerror = function () {
    p1.remove();
    appendLogEntry(log, APIS[0].label, 'Ошибка запроса', 'error');
    setDisabled(btn, false);
  };
  xhr1.send();
});

// ════════════════════════════════════════════════════════════════════════════
// ВЕРСИЯ 2 — Функция request() с параметром callback
// ════════════════════════════════════════════════════════════════════════════

/**
 * Отправляет GET-запрос через XHR и вызывает callback(data, error) по завершении.
 * @param {string}   url
 * @param {function} callback - fn(parsedData, errorMessage)
 */
function request(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(JSON.parse(xhr.responseText), null);
    } else {
      callback(null, `HTTP ${xhr.status}`);
    }
  };
  xhr.onerror = function () {
    callback(null, 'Ошибка сети');
  };
  xhr.send();
}

document.getElementById('run-callback').addEventListener('click', function () {
  const log = document.getElementById('log-callback');
  clearLog(log);
  setDisabled(this, true);
  const btn = this;

  const p1 = appendPending(log, APIS[0].label);
  request(APIS[0].url, (d1, e1) => {
    p1.remove();
    if (e1) { appendLogEntry(log, APIS[0].label, e1, 'error'); setDisabled(btn, false); return; }
    appendLogEntry(log, APIS[0].label, APIS[0].extract(d1));

    const p2 = appendPending(log, APIS[1].label);
    request(APIS[1].url, (d2, e2) => {
      p2.remove();
      if (e2) { appendLogEntry(log, APIS[1].label, e2, 'error'); setDisabled(btn, false); return; }
      appendLogEntry(log, APIS[1].label, APIS[1].extract(d2));

      const p3 = appendPending(log, APIS[2].label);
      request(APIS[2].url, (d3, e3) => {
        p3.remove();
        if (e3) { appendLogEntry(log, APIS[2].label, e3, 'error'); setDisabled(btn, false); return; }
        appendLogEntry(log, APIS[2].label, APIS[2].extract(d3));

        const p4 = appendPending(log, APIS[3].label);
        request(APIS[3].url, (d4, e4) => {
          p4.remove();
          if (e4) { appendLogEntry(log, APIS[3].label, e4, 'error'); setDisabled(btn, false); return; }
          appendLogEntry(log, APIS[3].label, APIS[3].extract(d4));

          const p5 = appendPending(log, APIS[4].label);
          request(APIS[4].url, (d5, e5) => {
            p5.remove();
            if (e5) { appendLogEntry(log, APIS[4].label, e5, 'error'); setDisabled(btn, false); return; }
            appendLogEntry(log, APIS[4].label, APIS[4].extract(d5));
            setDisabled(btn, false);
          });
        });
      });
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════
// ВЕРСИЯ 3 — requestPromise() обёртка над request(), цепочка .then()
// ════════════════════════════════════════════════════════════════════════════

/**
 * Оборачивает request() в Promise.
 * Аналог упрощённого fetch — отправляет XHR и возвращает Promise<parsedData>.
 * @param {string} url
 * @returns {Promise<any>}
 */
function requestPromise(url) {
  return new Promise((resolve, reject) => {
    request(url, (data, err) => {
      if (err) reject(new Error(err));
      else resolve(data);
    });
  });
}

document.getElementById('run-promise').addEventListener('click', function () {
  const log = document.getElementById('log-promise');
  clearLog(log);
  setDisabled(this, true);
  const btn = this;

  const p1 = appendPending(log, APIS[0].label);
  requestPromise(APIS[0].url)
    .then(d1 => {
      p1.remove();
      appendLogEntry(log, APIS[0].label, APIS[0].extract(d1));
      appendPending(log, APIS[1].label);
      return requestPromise(APIS[1].url);
    })
    .then(d2 => {
      log.querySelector('.log-pending').remove();
      appendLogEntry(log, APIS[1].label, APIS[1].extract(d2));
      appendPending(log, APIS[2].label);
      return requestPromise(APIS[2].url);
    })
    .then(d3 => {
      log.querySelector('.log-pending').remove();
      appendLogEntry(log, APIS[2].label, APIS[2].extract(d3));
      appendPending(log, APIS[3].label);
      return requestPromise(APIS[3].url);
    })
    .then(d4 => {
      log.querySelector('.log-pending').remove();
      appendLogEntry(log, APIS[3].label, APIS[3].extract(d4));
      appendPending(log, APIS[4].label);
      return requestPromise(APIS[4].url);
    })
    .then(d5 => {
      log.querySelector('.log-pending').remove();
      appendLogEntry(log, APIS[4].label, APIS[4].extract(d5));
      setDisabled(btn, false);
    })
    .catch(err => {
      const pending = log.querySelector('.log-pending');
      if (pending) pending.remove();
      appendLogEntry(log, 'Ошибка', err.message, 'error');
      setDisabled(btn, false);
    });
});

// ════════════════════════════════════════════════════════════════════════════
// ВЕРСИЯ 4 — async / await
// ════════════════════════════════════════════════════════════════════════════
document.getElementById('run-async').addEventListener('click', async function () {
  const log = document.getElementById('log-async');
  clearLog(log);
  setDisabled(this, true);

  try {
    for (const api of APIS) {
      const pending = appendPending(log, api.label);
      const data = await requestPromise(api.url);
      pending.remove();
      appendLogEntry(log, api.label, api.extract(data));
    }
  } catch (err) {
    const pending = log.querySelector('.log-pending');
    if (pending) pending.remove();
    appendLogEntry(log, 'Ошибка', err.message, 'error');
  }

  setDisabled(this, false);
});
