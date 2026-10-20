import { Phone, Mail, MapPin, FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Order } from '../../types/index.js';
import { Button } from '../ui/Button.js';

export interface CustomerCardProps {
  order: Order;
}

export function CustomerCard({ order }: CustomerCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    const formattedAddress = [
      order.customer_name,
      `Phone: ${order.phone}`,
      order.address,
      `${order.city}, ${order.state} ${order.pincode}`,
    ].join('\n');

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(formattedAddress);
      } else {
        // Fallback for non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = formattedAddress;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy address to clipboard');
    }
  };

  return (
    <div className="rounded-xl border border-sand/60 bg-cream-surface overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-sand/60 flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg sm:text-xl font-semibold text-espresso">
          Customer & Delivery
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopyAddress}
          className="text-xs h-8 px-2.5 gap-1.5 text-espresso/70 hover:text-espresso"
          title="Copy customer delivery address"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-success" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copied ? 'Copied' : 'Copy address'}</span>
        </Button>
      </div>

      <div className="p-4 sm:p-5 space-y-5 text-sm">
        {/* Customer Contact */}
        <div>
          <div className="font-medium text-espresso text-base mb-1">
            {order.customer_name}
          </div>
          <div className="space-y-1 text-espresso/80">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-camel shrink-0" />
              <a
                href={`tel:${order.phone}`}
                className="hover:text-camel hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded"
              >
                {order.phone}
              </a>
            </div>

            {order.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-camel shrink-0" />
                <a
                  href={`mailto:${order.email}`}
                  className="hover:text-camel hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded break-all"
                >
                  {order.email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="border-t border-sand/40 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-espresso/60 mb-2">
            <MapPin className="w-3.5 h-3.5 text-camel" />
            <span>Shipping Address</span>
          </div>
          <p className="whitespace-pre-line text-espresso/85 leading-relaxed bg-cream/50 p-3 rounded-lg border border-sand/40 font-mono text-xs sm:text-[13px]">
            {order.address}
            {'\n'}
            {order.city}, {order.state} - {order.pincode}
          </p>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="border-t border-sand/40 pt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-espresso/60 mb-2">
              <FileText className="w-3.5 h-3.5 text-camel" />
              <span>Customer Notes</span>
            </div>
            <p className="whitespace-pre-line text-espresso/80 leading-relaxed bg-cream/40 p-3 rounded-lg border border-sand/40 text-xs italic">
              {order.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
