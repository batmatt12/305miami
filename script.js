const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.site-nav a');
const form = document.querySelector('#estimate-form');
const formMessage = document.querySelector('.form-message');
const submitBtn = form?.querySelector('button[type="submit"]');

const config = window.SITE_CONFIG || {};
const formspreeEndpoint = (config.formspreeEndpoint || '').trim();
const smsWebhookUrl = (config.smsWebhookUrl || '').trim();

if (menuToggle && header) {
  menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const isPlaceholder = (value) =>
  !value || value.includes('YOUR_FORM_ID') || value.includes('YOUR_ZAPIER_WEBHOOK_URL');

const trackMetaLead = () => {
  if (typeof window.fbq !== 'function') {
    return;
  }

  window.fbq('track', 'Lead', {
    content_name: 'Free Estimate Request',
    status: 'submitted',
  });
};

const postToFormspree = async (payload) => {
  const response = await fetch(formspreeEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errors = Array.isArray(result.errors) ? result.errors.map((item) => item.message).join(', ') : '';
    throw new Error(errors || 'Could not send your request right now.');
  }
};

const postToSmsWebhook = async (payload) => {
  if (isPlaceholder(smsWebhookUrl)) {
    return { configured: false, sent: false };
  }

  const response = await fetch(smsWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      source: '305miamifencecompany.com',
      recipients: ['+13053218540', '+17865608256'],
    }),
  });

  if (!response.ok) {
    throw new Error('SMS webhook failed');
  }

  return { configured: true, sent: true };
};

if (form && formMessage) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      formMessage.textContent = 'Please fill in all required fields before submitting.';
      formMessage.style.color = '#ff9696';
      form.reportValidity();
      return;
    }

    if (isPlaceholder(formspreeEndpoint)) {
      formMessage.textContent = 'Form is not configured yet. Add your Formspree endpoint in form-config.js.';
      formMessage.style.color = '#ff9696';
      return;
    }

    const data = new FormData(form);
    const payload = {
      name: data.get('name')?.toString().trim() || '',
      phone: data.get('phone')?.toString().trim() || '',
      email: data.get('email')?.toString().trim() || '',
      zip: data.get('zip')?.toString().trim() || '',
      details: data.get('details')?.toString().trim() || '',
      consent: data.get('consent') ? 'yes' : 'no',
    };

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      await postToFormspree(payload);

      let smsStatus = { configured: false, sent: false };
      try {
        smsStatus = await postToSmsWebhook(payload);
      } catch (smsError) {
        smsStatus = { configured: true, sent: false };
      }

      if (smsStatus.configured && smsStatus.sent) {
        formMessage.textContent = `Thanks, ${payload.name || 'there'}. We got your request and SMS alerts were sent to (305) 321-8540 and (786) 560-8256.`;
      } else if (smsStatus.configured && !smsStatus.sent) {
        formMessage.textContent = `Thanks, ${payload.name || 'there'}. Your request was received by email, but SMS alert needs attention.`;
      } else {
        formMessage.textContent = `Thanks, ${payload.name || 'there'}. Your request was received by email.`;
      }

      trackMetaLead();
      formMessage.style.color = '#6bcde4';
      form.reset();
    } catch (error) {
      formMessage.textContent = `${error.message} If this keeps happening, call (305) 321-8540.`;
      formMessage.style.color = '#ff9696';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send My Request';
      }
    }
  });
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
