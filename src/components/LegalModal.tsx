import { useEffect } from 'react';
import { X } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  docType: LegalDocType;
  onClose: () => void;
}

export function LegalModal({ docType, onClose }: LegalModalProps) {
  useEffect(() => {
    if (!docType) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [docType, onClose]);

  if (!docType) return null;

  const isPrivacy = docType === 'privacy';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#f8f7f2] text-[#252923] border border-[#b5985a]/30 shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#252923]/10">
          <div>
            <p className="text-[11px] font-semibold tracking-[1.5px] text-[#725b38] uppercase">
              Monarch Imperial
            </p>
            <h2
              id="legal-modal-title"
              className="font-display text-2xl text-[#252923] mt-1"
            >
              {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal notice"
            className="p-2 text-[#626559] hover:text-[#252923] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#626559]">
          {isPrivacy ? (
            <>
              <p>
                Monarch Imperial respects your privacy and handles all personal
                details submitted through reservation and event enquiries solely
                to coordinate your hospitality experience in Sri Jayawardenepura
                Kotte.
              </p>
              <p>
                Contact details, event dates, and guest preferences are never
                sold or shared with third-party marketers. For data requests,
                write to{' '}
                <a
                  href="mailto:inquiry@monarchimperial.lk"
                  className="text-[#725b38] underline"
                >
                  inquiry@monarchimperial.lk
                </a>
                .
              </p>
            </>
          ) : (
            <>
              <p>
                All dining reservations, suite availability requests, and private
                celebration bookings at Monarch Imperial are confirmed subject to
                date availability and a formal written agreement issued by our
                concierge team.
              </p>
              <p>
                Event lookbook requests and banquet specifications are tailored to
                each occasion. Direct enquiries may also be placed by telephone
                at +94 11 277 2727.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#252923]/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gold-gradient text-[#f3f0e8] px-5 py-2 text-xs font-medium tracking-wide"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
