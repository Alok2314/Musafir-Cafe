import React, { useState, useEffect } from 'react';
import { submitContactForm } from '../services/cafeApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Compass,
  Car,
  Train
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const { user, profile } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Table Reservation');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (profile?.name || user.displayName) {
        setName(profile?.name || user.displayName || '');
      }
      if (user.email) {
        setEmail(user.email);
      }
      if (profile?.phone) {
        setPhone(profile.phone);
      }
    }
  }, [user, profile]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please provide your full name';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Please provide a valid email';
    if (!phone.trim() || !/^\+?[0-9]{10,12}$/.test(phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please provide a valid 10-digit phone number';
    }
    if (!message.trim() || message.trim().length < 10) {
      errs.message = 'Please write a message of at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitContactForm({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject,
        message: message.trim()
      });

      setIsSuccess(true);
      showToast('Thank you! Your message has been sent successfully.', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setErrors({});
    } catch (err: any) {
      console.error('[CONTACT CREATE] Submission error:', err);
      const errMsg = err?.message || 'Database error occurred. Please try again.';
      showToast(`Failed to send message: ${errMsg}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2B1B14] tracking-tight">
          We’d Love to Hear From You
        </h1>
        <p className="text-sm sm:text-base text-[#6B5A4D]">
          Whether you’re planning a table reservation, private book club gathering, catering event, or have a question about our coffee, reach out to us anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E7DFD5] p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-serif text-2xl font-bold text-[#2B1B14]">
              Cafe Information
            </h3>

            <div className="space-y-5 text-sm text-[#5A4B40]">
              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#C26D2B] flex items-center justify-center shrink-0 border border-[#E7DFD5]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Phone & WhatsApp
                  </h4>
                  <a href="tel:+919876543210" className="font-semibold text-base text-[#2B1B14] hover:text-[#C26D2B] block mt-0.5">
                    +91 98765 43210
                  </a>
                  <span className="text-xs text-[#8C7A6B]">Available during cafe operating hours</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#C26D2B] flex items-center justify-center shrink-0 border border-[#E7DFD5]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Email Inquiries
                  </h4>
                  <a href="mailto:hello@musafircafe.in" className="font-semibold text-base text-[#2B1B14] hover:text-[#C26D2B] block mt-0.5">
                    hello@musafircafe.in
                  </a>
                  <span className="text-xs text-[#8C7A6B]">We reply within 24 hours</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#C26D2B] flex items-center justify-center shrink-0 border border-[#E7DFD5]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Cafe Address
                  </h4>
                  <p className="font-semibold text-[#2B1B14] leading-relaxed mt-0.5">
                    14, Heritage Lane, Near Central Park & Metro Gate 2,
                    Connaught Place, New Delhi – 110001
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5 pt-2 border-t border-[#F2ECE3]">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#C26D2B] flex items-center justify-center shrink-0 border border-[#E7DFD5]">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Opening Hours
                  </h4>
                  <div className="text-xs">
                    <p className="text-[#2B1B14] font-medium">Monday – Friday: 09:00 AM – 11:00 PM</p>
                    <p className="text-[#2B1B14] font-medium">Saturday & Sunday: 08:30 AM – 11:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transport / Accessibility highlights */}
          <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#C26D2B]" />
              <span>Getting Here</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-[#6B5A4D]">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-[#3F2A1D]" />
                <span>Rajiv Chowk Metro (2 min walk)</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#3F2A1D]" />
                <span>Valet parking available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-[#E7DFD5] p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2B1B14]">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5A4D] mt-1">
                Fill out the form below and our team will get back to you promptly.
              </p>
            </div>

            {isSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Message Received!</strong>
                  Thank you for reaching out to Musafir Cafe. A team member will respond to your email or phone shortly.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Alok Sharma"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      errors.name ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g., alok@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      errors.email ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g., 9876543210"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      errors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B] bg-white"
                  >
                    <option value="Table Reservation">Table Reservation</option>
                    <option value="Catering & Events">Catering & Events</option>
                    <option value="Coffee & Menu Inquiry">Coffee & Menu Inquiry</option>
                    <option value="Careers / Join Barista Team">Careers / Join Barista Team</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us what date, time, or question you have..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.message ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4 text-[#E08A3C]" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* LOCATION & INTERACTIVE MAP PLACEHOLDER */}
      <section className="bg-white rounded-3xl border border-[#E7DFD5] overflow-hidden shadow-xs">
        <div className="p-6 sm:p-8 border-b border-[#E7DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] block mb-1">
              Visit Musafir Cafe
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#2B1B14]">
              Location & Interactive Map
            </h3>
            <p className="text-xs text-[#6B5A4D] mt-0.5">
              14, Heritage Lane, Near Central Park & Metro Gate 2, Connaught Place, New Delhi
            </p>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl border border-[#3F2A1D] text-xs font-semibold text-[#3F2A1D] hover:bg-[#3F2A1D] hover:text-white transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <MapPin className="w-4 h-4 text-[#E08A3C]" />
            <span>Open in Google Maps</span>
          </a>
        </div>

        {/* Map Visual Simulation */}
        <div className="relative h-80 sm:h-96 w-full bg-[#EFECE6] flex items-center justify-center overflow-hidden">
          {/* Stylized vector map grid background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3F2A1D_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Simulated Street Layout */}
          <div className="absolute inset-x-0 h-10 bg-[#E0D9CE] top-1/2 -translate-y-1/2 rotate-1" />
          <div className="absolute inset-y-0 w-12 bg-[#E0D9CE] left-1/3 rotate-3" />
          <div className="absolute inset-y-0 w-8 bg-[#E5DFD5] right-1/4 -rotate-2" />

          {/* Central Cafe Marker Pin */}
          <div className="relative z-10 flex flex-col items-center animate-bounce">
            <div className="px-4 py-2 rounded-2xl bg-[#3F2A1D] text-white text-xs font-semibold shadow-xl border border-[#5A3F2E] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E08A3C] animate-ping" />
              <span>Musafir Cafe (Connaught Place)</span>
            </div>
            <div className="w-6 h-6 rotate-45 bg-[#3F2A1D] -mt-3 shadow-md" />
          </div>

          {/* Info pill */}
          <div className="absolute bottom-4 left-4 z-10 p-3 rounded-xl bg-white/95 backdrop-blur border border-[#E7DFD5] text-xs text-[#5A4B40] shadow-md max-w-xs">
            <strong className="text-[#2B1B14] block">Central Landmark</strong>
            Directly opposite Central Park Gate 2. Ample outdoor sidewalk seating available.
          </div>
        </div>
      </section>

    </div>
  );
};
