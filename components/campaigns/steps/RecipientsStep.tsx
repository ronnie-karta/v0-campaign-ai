'use client';

import { useState } from 'react';
import { CampaignData, Recipient } from '@/lib/campaign-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { downloadExampleCSV, parseCSV } from '@/lib/csv-utils';

interface RecipientsStepProps {
  data: CampaignData;
  onChange: (data: Partial<CampaignData>) => void;
}

export const RecipientsStep = ({ data, onChange }: RecipientsStepProps) => {
  const [newRecipient, setNewRecipient] = useState<Recipient>({ id: '', name: '', email: '', phone: '' });
  const [dragActive, setDragActive] = useState(false);

  const isEmailCampaign = data.campaignType === 'email' || data.campaignType === 'both';
  const isSmsCampaign = data.campaignType === 'sms' || data.campaignType === 'both';

  const addRecipient = () => {
    if ((isEmailCampaign && !newRecipient.email) || (isSmsCampaign && !newRecipient.phone)) {
      alert('Please fill in required fields');
      return;
    }

    const recipient: Recipient = {
      id: `recipient-${Date.now()}`,
      name: newRecipient.name || undefined,
      email: isEmailCampaign ? newRecipient.email : undefined,
      phone: isSmsCampaign ? newRecipient.phone : undefined,
    };

    onChange({ recipients: [...data.recipients, recipient] });
    setNewRecipient({ id: '', name: '', email: '', phone: '' });
  };

  const removeRecipient = (id: string) => {
    onChange({ recipients: data.recipients.filter(r => r.id !== id) });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsedRecipients = parseCSV(content);
      onChange({ recipients: [...data.recipients, ...parsedRecipients] });
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold block mb-2">Upload Recipients (CSV)</Label>
        <p className="text-sm text-gray-600 mb-4">Import multiple recipients at once from a CSV file</p>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mb-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csvInput"
            />
            <label htmlFor="csvInput" className="cursor-pointer">
              <div className="text-3xl mb-2">📁</div>
              <p className="font-semibold text-gray-900">Drag and drop your CSV file</p>
              <p className="text-sm text-gray-600">or click to select</p>
            </label>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('csvInput')?.click()}
            className="mt-4"
          >
            Choose File
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={downloadExampleCSV}
          className="mt-4 text-purple-600"
        >
          Download Example CSV
        </Button>
      </div>

      <div className="border-t pt-6">
        <Label className="text-base font-semibold block mb-4">Add Recipients Manually</Label>

        <div className="grid grid-cols-1 gap-3 mb-4">
          <Input
            placeholder="Name (optional)"
            value={newRecipient.name || ''}
            onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
          />

          {isEmailCampaign && (
            <Input
              type="email"
              placeholder="Email address"
              value={newRecipient.email || ''}
              onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
            />
          )}

          {isSmsCampaign && (
            <Input
              placeholder="Phone number (+1-555-0000)"
              value={newRecipient.phone || ''}
              onChange={(e) => setNewRecipient({ ...newRecipient, phone: e.target.value })}
            />
          )}
        </div>

        <Button
          onClick={addRecipient}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Add Recipient
        </Button>
      </div>

      {data.recipients.length > 0 && (
        <div className="border-t pt-6">
          <Label className="text-base font-semibold block mb-4">
            Recipients ({data.recipients.length})
          </Label>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.recipients.map((recipient) => (
              <div key={recipient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{recipient.name || 'Unnamed'}</p>
                  {recipient.email && <p className="text-sm text-gray-600">{recipient.email}</p>}
                  {recipient.phone && <p className="text-sm text-gray-600">{recipient.phone}</p>}
                </div>
                <button
                  onClick={() => removeRecipient(recipient.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
