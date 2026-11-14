/* House of Vic Amore — site behaviour
   Progressive enhancement only: the form works with JavaScript disabled. */
(function () {
  'use strict';

  var ENDPOINT = 'https://vision.leadrai.com/api/forms/17d92a8bbcef468e47c6a4e0875ffeb5';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---------- Hidden _page field (so visitors return to this page) ---------- */
  var pageField = document.getElementById('_page');
  if (pageField) { pageField.value = window.location.href; }

  var form = document.getElementById('appointment-form');
  var status = document.getElementById('form-status');
  var submitBtn = document.getElementById('form-submit');

  function showConfirmation() {
    if (!status) { return; }
    status.hidden = false;
  }

  /* ---------- Plain HTML submission returns with ?submitted=1 ---------- */
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('submitted') === '1') {
      showConfirmation();
      if (form) { form.reset(); }
      if (pageField) { pageField.value = window.location.href; }
      window.setTimeout(function () {
        if (status) {
          status.scrollIntoView({ block: 'center', behavior: 'auto' });
          status.setAttribute('tabindex', '-1');
          status.focus({ preventScroll: true });
        }
      }, 120);
    }
  } catch (e) { /* URLSearchParams unavailable — plain form flow still fine */ }

  /* ---------- Inline validation helpers ---------- */
  function clearError(field) {
    if (!field) { return; }
    field.classList.remove('has-error');
    var msg = field.querySelector('.error-msg');
    if (msg) { msg.remove(); }
  }

  function setError(input, text) {
    var field = input.closest('.field');
    if (!field) { return; }
    clearError(field);
    field.classList.add('has-error');
    var msg = document.createElement('span');
    msg.className = 'error-msg';
    msg.textContent = text;
    field.appendChild(msg);
    input.setAttribute('aria-invalid', 'true');
  }

  function validate() {
    if (!form) { return true; }
    var ok = true;
    var firstBad = null;
    var required = form.querySelectorAll('[required]');

    Array.prototype.forEach.call(required, function (input) {
      var field = input.closest('.field');
      clearError(field);
      input.removeAttribute('aria-invalid');

      var value = (input.value || '').trim();
      var bad = false;
      var text = 'Please fill this in.';

      if (!value) {
        bad = true;
        text = input.tagName === 'SELECT' ? 'Please choose a service.' : 'Please fill this in.';
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        bad = true;
        text = 'Please enter a valid email address.';
      } else if (input.type === 'tel' && value.replace(/[^0-9]/g, '').length < 10) {
        bad = true;
        text = 'Please enter a 10-digit phone number.';
      }

      if (bad) {
        ok = false;
        setError(input, text);
        if (!firstBad) { firstBad = input; }
      }
    });

    if (firstBad) { firstBad.focus(); }
    return ok;
  }

  if (!form) { return; }

  form.addEventListener('input', function (ev) {
    var field = ev.target.closest ? ev.target.closest('.field') : null;
    if (field && field.classList.contains('has-error')) {
      clearError(field);
      ev.target.removeAttribute('aria-invalid');
    }
  });

  /* ---------- Enhanced submit: fetch() to the same endpoint ---------- */
  form.addEventListener('submit', function (ev) {
    if (!validate()) {
      ev.preventDefault();
      return;
    }

    if (typeof window.fetch !== 'function' || typeof FormData !== 'function') {
      return; // let the browser do a normal POST
    }

    ev.preventDefault();

    if (pageField) { pageField.value = window.location.href; }

    var payload = {};
    new FormData(form).forEach(function (value, key) {
      payload[key] = typeof value === 'string' ? value : String(value);
    });
    payload._page = window.location.href;

    var originalLabel = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) { throw new Error('Request failed: ' + res.status); }
        return res.json().catch(function () { return { ok: true }; });
      })
      .then(function () {
        form.reset();
        if (pageField) { pageField.value = window.location.href; }
        showConfirmation();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
        if (status) {
          status.setAttribute('tabindex', '-1');
          status.focus({ preventScroll: true });
          status.scrollIntoView({ block: 'center', behavior: 'auto' });
        }
      })
      .catch(function () {
        // Fall back to a standard browser POST so the lead is never lost.
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
        form.submit();
      });
  });
})();
