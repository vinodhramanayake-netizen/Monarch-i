import { useEffect, useState, type FormEvent } from 'react';
import { X, Check, ArrowUpRight } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_PHONE, type EnquiryCategory } from '../data/monarchData';

interface EnquiryModalProps {
  isOpen: boolean;
  initialCategory: EnquiryCategory;
  onClose: () => void;
}

const CATEGORIES: EnquiryCategory[] = [
  'General Enquiry',
  'Table Reservation',
  'Wedding Lookbook',
  'Meetings & Events',
  'Room Availability',
];

export function EnquiryModal({
  isOpen,
  initialCategory,
  onClose,
}: EnquiryModalProps) {
  const [category, setCategory] = useState<EnquiryCategory>(initialCategory);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [guests, setGuests] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setCategory(initialCategory);
    setSubmitted(false);
    setError('');
  }, [initialCategory, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    if (phone.trim() && !/^[+\d\s()-]{7,20}$/.test(phone.trim())) {
      setError('Please provide a valid telephone number.');
      return;
    }

    setSubmitted(true);
  };

  const mailtoSubject = encodeURIComponent(`${category} — Monarch Imperial`);
  const mailtoBody = encodeURIComponent(
    `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nPreferred Date: ${preferredDate}\nEstimated Guests: ${guests}\nNotes: ${notes}`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#f8f7f2] text-[#252923] border border-[#b5985a]/30 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-7 pb-5 border-b border-[#252923]/10">
          <div>
            <p className="text-[11px] font-semibold tracking-[1.5px] text-[#725b38] uppercase">
              Monarch Imperial Concierge
            </p>
            <h2
              id="enquiry-modal-title"
              className="font-display text-2xl sm:text-3xl text-[#252923] mt-1"
            >
              {submitted ? 'Enquiry Received' : category}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close enquiry dialog"
            className="p-2 text-[#626559] hover:text-[#252923] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4 p-5 bg-[#e4cea0]/35 border border-[#b5985a]/40">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center bg-gold-gradient text-[#f3f0e8]">
                <Check className="w-4 h-4" />
              </span>
              <div className="space-y-1.5">
                <p className="font-medium text-sm text-[#252923]">
                  Thank you, {fullName}. Your {category.toLowerCase()} request has been noted.
                </p>
                <p className="text-xs leading-relaxed text-[#626559]">
                  Our hospitality desk in Sri Jayawardenepura Kotte responds to all enquiries within 24 hours. For immediate assistance, reach us at{' '}
                  <a
                    href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}
                    className="underline text-[#725b38]"
                  >
                    {CONTACT_PHONE}
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#725b38] hover:text-[#252923] underline underline-offset-4"
              >
                Send a copy via email client
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="bg-gold-gradient text-[#f3f0e8] px-6 py-2.5 text-xs font-medium tracking-wide whitespace-nowrap"
              >
                Return to Monarch Imperial
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5" noValidate>
            <div>
              <label
                htmlFor="enquiry-category"
                className="block text-[11px] font-medium tracking-[1.2px] text-[#725b38] uppercase mb-2"
              >
                Enquiry Type
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap ${
                      category === item
                        ? 'bg-[#252923] text-[#f3f0e8] border-[#252923]'
                        : 'bg-transparent text-[#626559] border-[#252923]/20 hover:border-[#725b38] hover:text-[#252923]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="enquiry-name"
                  className="block text-xs font-medium text-[#252923] mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="enquiry-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Amaya Perera"
                  className="w-full bg-white border border-[#252923]/20 px-3.5 py-2.5 text-sm text-[#252923] placeholder:text-[#626559]/60 focus:border-[#b5985a] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="enquiry-email"
                  className="block text-xs font-medium text-[#252923] mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="enquiry-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amaya@example.com"
                  className="w-full bg-white border border-[#252923]/20 px-3.5 py-2.5 text-sm text-[#252923] placeholder:text-[#626559]/60 focus:border-[#b5985a] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="enquiry-phone"
                  className="block text-xs font-medium text-[#252923] mb-1.5"
                >
                  Telephone
                </label>
                <input
                  id="enquiry-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full bg-white border border-[#252923]/20 px-3.5 py-2.5 text-sm text-[#252923] placeholder:text-[#626559]/60 focus:border-[#b5985a] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="enquiry-date"
                  className="block text-xs font-medium text-[#252923] mb-1.5"
                >
                  Preferred Date
                </label>
                <input
                  id="enquiry-date"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-white border border-[#252923]/20 px-3.5 py-2.5 text-sm text-[#252923] focus:border-[#b5985a] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="enquiry-guests"
                  className="block text-xs font-medium text-[#252923] mb-1.5"
                >
                  Guests
                </label>
                <input
                  id="enquiry-guests"
                  type="number"
                  min={1}
                  max={1500}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="2"
                  className="w-full bg-white border border-[#252923]/20 px-3.5 py-2.5 text-sm text-[#252923] tabular-nums placeholder:text-[#626559]/60 focus:border-[#b5985a] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="enquiry-notes"
                className="block text-xs font-medium text-[#252923] mb-1.5"
              >
                Occasion Details & Preferences
              </label>
              <textarea
                id="enquiry-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your vision, dining preferences, or event requirements."
                className="w-full bg-white border border-[#252923]/20 px-3.5 py-2.5 text-sm text-[#252923] placeholder:text-[#626559]/60 focus:border-[#b5985a] focus:outline-none resize-none"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs font-medium text-red-700">
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#252923]/10">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${mailtoSubject}`}
                className="text-xs text-[#626559] hover:text-[#252923] underline underline-offset-4"
              >
                Direct email: {CONTACT_EMAIL}
              </a>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-medium text-[#626559] hover:text-[#252923]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold-gradient text-[#f3f0e8] px-6 py-2.5 text-xs font-medium tracking-wide whitespace-nowrap transition-opacity"
                >
                  Submit Enquiry
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
