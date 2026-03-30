'use client';

import { useState } from 'react';
import { CampaignData } from '@/lib/campaign-types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';

interface PaymentStepProps {
  data: CampaignData;
  onChange: (data: Partial<CampaignData>) => void;
}

const ITEMS_PER_PAGE = 10;

export const PaymentStep = ({ data, onChange }: PaymentStepProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const perRecipientRate = data.campaignType === 'email' ? 0.01 : 0.05;
  const serviceFee = Math.round(data.recipients.length * perRecipientRate * 100) / 100;
  const total = (data.budget || 0) + serviceFee;

  const totalPages = Math.ceil(data.recipients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecipients = data.recipients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Column: Preview */}
      <div className="space-y-10">
        <div>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">1</span>
            Campaign Preview
          </h3>

          <div className="space-y-12">
            {/* Identity */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Identity & Goals</h4>
              <div className="grid grid-cols-2 gap-y-6 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Name</p>
                  <p className="font-semibold">{data.campaignName}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Type</p>
                  <Badge variant="secondary" className="capitalize">{data.campaignType}</Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700 leading-relaxed">{data.description}</p>
                </div>
              </div>
            </div>

            {/* Creative */}
            <div className="space-y-4 border-t border-gray-100 pt-8">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Creative Content</h4>
              <div className="space-y-6 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 mb-1">Sender</p>
                    <p className="font-semibold">{data.senderName}</p>
                  </div>
                  {data.campaignType === 'email' && (
                    <div>
                      <p className="text-gray-500 mb-1">Subject</p>
                      <p className="font-semibold">{data.subject}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Message Preview</p>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg text-gray-600 italic">
                    "{data.messageContent}"
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics */}
            <div className="space-y-4 border-t border-gray-100 pt-8">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Logistics</h4>
              <div className="grid grid-cols-2 gap-y-6 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Schedule</p>
                  <p className="font-semibold capitalize">{data.scheduleType}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Frequency</p>
                  <p className="font-semibold capitalize">{data.repeatFrequency}</p>
                </div>
                {data.scheduleType === 'scheduled' && (
                  <div className="col-span-2">
                    <p className="text-gray-500 mb-1">Send Date & Time</p>
                    <p className="font-semibold">{data.sendDateTime} ({data.timezone})</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recipients Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Target Audience</h4>
                <Badge variant="outline">{data.recipients.length} Recipients</Badge>
              </div>

              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-bold text-[10px] uppercase tracking-wider">Name</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-wider">Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRecipients.map((recipient) => (
                      <TableRow key={recipient.id}>
                        <TableCell className="font-medium">{recipient.name || '—'}</TableCell>
                        <TableCell className="text-gray-500">
                          {recipient.email || recipient.phone}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(p => Math.max(1, p - 1));
                          }}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>

                      {totalPages <= 7 ? (
                        [...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i} className="hidden sm:inline-block">
                            <PaginationLink
                              href="#"
                              isActive={currentPage === i + 1}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(i + 1);
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))
                      ) : (
                        <>
                          <PaginationItem className="hidden sm:inline-block">
                            <PaginationLink
                              href="#"
                              isActive={currentPage === 1}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(1);
                              }}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>

                          {currentPage > 3 && (
                            <PaginationItem className="hidden sm:inline-block">
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}

                          {Array.from({ length: 3 }, (_, i) => {
                            let page;
                            if (currentPage <= 3) page = i + 2;
                            else if (currentPage >= totalPages - 2) page = totalPages - 3 + i;
                            else page = currentPage - 1 + i;

                            if (page <= 1 || page >= totalPages) return null;

                            return (
                              <PaginationItem key={page} className="hidden sm:inline-block">
                                <PaginationLink
                                  href="#"
                                  isActive={currentPage === page}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                  }}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}

                          {currentPage < totalPages - 2 && (
                            <PaginationItem className="hidden sm:inline-block">
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}

                          <PaginationItem className="hidden sm:inline-block">
                            <PaginationLink
                              href="#"
                              isActive={currentPage === totalPages}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(totalPages);
                              }}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(p => Math.min(totalPages, p + 1));
                          }}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Payment */}
      <div className="space-y-10">
        <div>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">2</span>
            Payment Details
          </h3>

          <div className="space-y-8">
            {/* Cost Summary */}
            <div className="bg-purple-900 text-white rounded-2xl p-8 shadow-xl shadow-purple-100">
              <p className="text-purple-300 text-[10px] font-bold tracking-widest uppercase mb-2">Total Amount Due</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">${total.toFixed(2)}</span>
                <span className="text-purple-300 text-sm">USD</span>
              </div>
              <div className="mt-6 pt-6 border-t border-purple-800 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Campaign Budget</span>
                  <span className="font-mono">${(data.budget || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200">Service Fee ({data.recipients.length} × ${perRecipientRate.toFixed(2)})</span>
                  <span className="font-mono">${serviceFee.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Billing Email */}
            <div className="space-y-4">
              <Label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Billing Email</Label>
              <Input
                type="email"
                placeholder="billing@example.com"
                value={data.billingEmail}
                onChange={(e) => onChange({ billingEmail: e.target.value })}
                className="h-12 bg-gray-50 border-gray-100 focus:bg-white transition-all"
              />
              <p className="text-[10px] text-gray-400 italic">Receipts will be dispatched to this address immediately after transaction.</p>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <Label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Select Method</Label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'credit-card', label: 'Credit Card', icon: '💳', desc: 'Visa, MC, Amex' },
                  { id: 'paypal', label: 'PayPal', icon: '🅿️', desc: 'Instant & Secure' },
                  { id: 'bank-transfer', label: 'Bank Transfer', icon: '🏦', desc: '2-3 Business Days' }
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all hover:border-purple-200 ${
                      data.paymentMethod === method.id
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-100'
                        : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={data.paymentMethod === method.id}
                        onChange={(e) => onChange({ paymentMethod: e.target.value as any })}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{method.icon} {method.label}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-tight">{method.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="pt-6 border-t border-gray-50">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                <Checkbox
                  id="agreeTerms"
                  checked={data.agreeToTerms}
                  onCheckedChange={(checked) => onChange({ agreeToTerms: checked as boolean })}
                  className="mt-1"
                />
                <div className="grid gap-1.5">
                  <label
                    htmlFor="agreeTerms"
                    className="text-xs text-gray-600 leading-relaxed cursor-pointer font-normal"
                  >
                    I acknowledge and agree to Campaign AI's <span className="text-purple-600 font-bold underline">Terms of Service</span> and <span className="text-purple-600 font-bold underline">Privacy Policy</span>. I authorize a one-time charge of <span className="font-bold text-gray-900">${total.toFixed(2)}</span>.
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex gap-3">
                <span className="text-blue-500 text-lg">🛡️</span>
                <p className="text-[10px] text-blue-800 leading-normal">
                  Your security is our priority. All transactions are encrypted and processed through PCI-compliant gateways. Your campaign will undergo a brief review before deployment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
