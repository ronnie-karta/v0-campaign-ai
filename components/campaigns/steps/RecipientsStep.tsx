'use client';

import { useState } from 'react';
import { CampaignData, Recipient } from '@/lib/campaign-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { downloadExampleCSV, parseCSV } from '@/lib/csv-utils';
import { Edit2, Trash2, Check, X, Plus } from 'lucide-react';

interface RecipientsStepProps {
  data: CampaignData;
  onChange: (data: Partial<CampaignData>) => void;
}

export const RecipientsStep = ({ data, onChange }: RecipientsStepProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Recipient>({ id: '', name: '', email: '', phone: '' });
  const [dragActive, setDragActive] = useState(false);

  const isEmailCampaign = data.campaignType === 'email' || data.campaignType === 'both';
  const isSmsCampaign = data.campaignType === 'sms' || data.campaignType === 'both';

  const startEditing = (recipient: Recipient) => {
    setEditingId(recipient.id);
    setEditValues(recipient);
  };

  const handleCancel = () => {
    if (editingId?.startsWith('new-')) {
      onChange({ recipients: data.recipients.filter((r) => r.id !== editingId) });
    }
    setEditingId(null);
  };

  const handleSave = () => {
    if ((isEmailCampaign && !editValues.email) || (isSmsCampaign && !editValues.phone)) {
      alert('Please fill in required fields (Email or Phone depending on campaign type)');
      return;
    }

    const updatedRecipients = data.recipients.map((r) =>
      r.id === editingId
        ? {
            ...editValues,
            id: editingId.startsWith('new-') ? `recipient-${Date.now()}` : editingId,
          }
        : r
    );

    onChange({ recipients: updatedRecipients });
    setEditingId(null);
  };

  const addRecipient = () => {
    if (editingId) {
      alert('Please save or cancel your current edit before adding a new recipient.');
      return;
    }
    const newId = `new-${Date.now()}`;
    const newRecipient: Recipient = {
      id: newId,
      name: '',
      email: '',
      phone: '',
    };
    onChange({ recipients: [...data.recipients, newRecipient] });
    setEditingId(newId);
    setEditValues(newRecipient);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-sm font-semibold">Upload Recipients (CSV)</Label>
            <button
              onClick={downloadExampleCSV}
              className="text-[10px] text-purple-600 hover:underline font-medium"
            >
              Example CSV
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">Import multiple at once</p>

          <div
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
              dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-gray-50/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('csvInput')?.click()}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csvInput"
            />
            <div className="pointer-events-none">
              <p className="text-sm font-medium text-gray-900">Drop CSV or click to upload</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Quickly import your audience list</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end pb-1">
          <Button
            onClick={addRecipient}
            variant="outline"
            className="w-full border-dashed border-2 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all h-24 flex-col gap-2 group"
          >
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-purple-100 transition-colors">
              <Plus className="w-5 h-5 text-gray-500 group-hover:text-purple-600" />
            </div>
            <span className="text-sm font-semibold">Add Recipient Manually</span>
          </Button>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-semibold">
            Recipients ({data.recipients.length})
          </Label>
        </div>

        <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="font-bold text-[10px] uppercase tracking-wider py-4">Name</TableHead>
                  {isEmailCampaign && (
                    <TableHead className="font-bold text-[10px] uppercase tracking-wider">Email</TableHead>
                  )}
                  {isSmsCampaign && (
                    <TableHead className="font-bold text-[10px] uppercase tracking-wider">Phone</TableHead>
                  )}
                  <TableHead className="w-[100px] text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recipients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-gray-400 italic"
                    >
                      No recipients added yet. Upload a CSV or add one manually.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.recipients.map((recipient) => (
                    <TableRow key={recipient.id} className="group transition-colors hover:bg-gray-50/50">
                      {editingId === recipient.id ? (
                        <>
                          <TableCell className="py-3">
                            <Input
                              value={editValues.name || ''}
                              onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                              placeholder="Name"
                              className="h-9 text-sm"
                              autoFocus
                            />
                          </TableCell>
                          {isEmailCampaign && (
                            <TableCell className="py-3">
                              <Input
                                type="email"
                                value={editValues.email || ''}
                                onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                                placeholder="Email"
                                className="h-9 text-sm"
                              />
                            </TableCell>
                          )}
                          {isSmsCampaign && (
                            <TableCell className="py-3">
                              <Input
                                value={editValues.phone || ''}
                                onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })}
                                placeholder="Phone"
                                className="h-9 text-sm"
                              />
                            </TableCell>
                          )}
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={handleSave}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium text-gray-900 py-4">
                            {recipient.name || <span className="text-gray-400 italic text-xs font-normal">Unnamed</span>}
                          </TableCell>
                          {isEmailCampaign && (
                            <TableCell className="text-gray-600">
                              {recipient.email || <span className="text-gray-300">—</span>}
                            </TableCell>
                          )}
                          {isSmsCampaign && (
                            <TableCell className="text-gray-600">
                              {recipient.phone || <span className="text-gray-300">—</span>}
                            </TableCell>
                          )}
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEditing(recipient)}
                                className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeRecipient(recipient.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Remove"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
