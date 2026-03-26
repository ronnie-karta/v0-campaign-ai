'use client';

import { CampaignData } from '@/lib/campaign-types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DeliveryStepProps {
  data: CampaignData;
  onChange: (data: Partial<CampaignData>) => void;
}

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
];

export const DeliveryStep = ({ data, onChange }: DeliveryStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold block mb-2">When to Send</Label>
        <p className="text-sm text-gray-600 mb-3">Choose how and when your campaign will be delivered</p>

        <div className="space-y-3">
          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50" style={{borderColor: data.scheduleType === 'immediate' ? '#9333ea' : '#e5e7eb'}}>
            <input
              type="radio"
              name="scheduleType"
              value="immediate"
              checked={data.scheduleType === 'immediate'}
              onChange={(e) => onChange({ scheduleType: e.target.value as 'immediate' | 'scheduled' })}
              className="w-4 h-4"
            />
            <div className="ml-3">
              <p className="font-semibold text-gray-900">Send Immediately</p>
              <p className="text-sm text-gray-600">Campaign will start as soon as approved</p>
            </div>
          </label>

          <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50" style={{borderColor: data.scheduleType === 'scheduled' ? '#9333ea' : '#e5e7eb'}}>
            <input
              type="radio"
              name="scheduleType"
              value="scheduled"
              checked={data.scheduleType === 'scheduled'}
              onChange={(e) => onChange({ scheduleType: e.target.value as 'immediate' | 'scheduled' })}
              className="w-4 h-4"
            />
            <div className="ml-3">
              <p className="font-semibold text-gray-900">Schedule for Later</p>
              <p className="text-sm text-gray-600">Choose a specific date and time</p>
            </div>
          </label>
        </div>
      </div>

      {data.scheduleType === 'scheduled' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sendDate" className="text-base font-semibold">
              Send Date
            </Label>
            <Input
              id="sendDate"
              type="date"
              value={data.sendDateTime?.split('T')[0] || ''}
              onChange={(e) => {
                const time = data.sendDateTime?.split('T')[1] || '09:00';
                onChange({ sendDateTime: `${e.target.value}T${time}` });
              }}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="sendTime" className="text-base font-semibold">
              Send Time
            </Label>
            <Input
              id="sendTime"
              type="time"
              value={data.sendDateTime?.split('T')[1] || '09:00'}
              onChange={(e) => {
                const date = data.sendDateTime?.split('T')[0] || new Date().toISOString().split('T')[0];
                onChange({ sendDateTime: `${date}T${e.target.value}` });
              }}
              className="mt-2"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="timezone" className="text-base font-semibold">
            Timezone
          </Label>
          <p className="text-sm text-gray-600 mb-2">Your recipients' timezone for send time</p>
          <Select value={data.timezone} onValueChange={(value) => onChange({ timezone: value })}>
            <SelectTrigger id="timezone" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map(tz => (
                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="frequency" className="text-base font-semibold">
            Repeat Frequency
          </Label>
          <p className="text-sm text-gray-600 mb-2">How often should this campaign be sent</p>
          <Select value={data.repeatFrequency} onValueChange={(value: any) => onChange({ repeatFrequency: value })}>
            <SelectTrigger id="frequency" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once">Send Once</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
