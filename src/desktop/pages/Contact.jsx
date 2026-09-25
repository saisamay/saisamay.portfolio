import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formMessage, setFormMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Dummy submit logic, as EmailJS requires real keys and setup
    setTimeout(() => {
      setFormMessage({ type: 'success', text: 'Message sent successfully!' });
      setIsSubmitting(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  return (
    <>
      <header className="page-header container">
        <h1>Let's Connect!</h1>
      </header>

      <main className="container">
        {formMessage && (
          <div id="form-messages" className={`form-messages ${formMessage.type}`} role="alert" aria-live="polite" aria-atomic="true">
            {formMessage.text}
          </div>
        )}

        <form id="contact-form" noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Full Name <span className="required" aria-label="required">*</span>
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              aria-describedby="name-hint name-error" 
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
            />
            <div id="name-hint" className="field-hint">Enter your first and last name</div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="required" aria-label="required">*</span>
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              aria-describedby="email-hint email-error" 
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <div id="email-hint" className="field-hint">I'll use this to respond to your message</div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone Number <span className="optional">(optional)</span>
            </label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              pattern="\(\d{3}\) \d{3}-\d{4}" 
              aria-describedby="phone-hint phone-error" 
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
            />
            <div id="phone-hint" className="field-hint">Format: (123) 456-7890</div>
          </div>

          <div className="form-group message-group">
            <label htmlFor="message">
              Message <span className="required" aria-label="required">*</span>
            </label>
            <textarea 
              id="message" 
              name="message" 
              required 
              aria-describedby="message-hint message-error message-counter" 
              placeholder="Give me your best project ideas!"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <div className="message-footer">
              <div id="message-hint" className="field-hint">Drop your message here</div>
              <div id="message-counter" className="character-counter" aria-live="polite">
                {formData.message.length}/50
              </div>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            <span className="button-text">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
            {isSubmitting && <span className="button-spinner" aria-hidden="true"></span>}
          </button>
        </form>
      </main>
    </>
  );
};

export default Contact;
