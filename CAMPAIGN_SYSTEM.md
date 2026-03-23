# Campaign Creation System Documentation

## Overview

The Campaign Creation System is a comprehensive multi-step form for creating email and SMS marketing campaigns. It guides users through 5 steps to build, customize, target, schedule, and pay for their campaigns.

## Features

- **5-Step Workflow**: Campaign → Customise → Recipients → Delivery → Payment
- **Email & SMS Support**: Create single or dual-channel campaigns
- **CSV Upload**: Bulk import recipients from CSV files with example template download
- **Manual Recipient Entry**: Add individual recipients one at a time
- **Scheduled Delivery**: Set specific send times or send immediately
- **Multiple Payment Methods**: Credit card, PayPal, or bank transfer
- **Real-time Validation**: Next button only enabled when step is complete
- **Cost Calculation**: Automatic pricing based on recipients and campaign type

## File Structure

```
/app
  /campaigns
    /create
      /page.tsx          # Main campaign creation page
    /page.tsx            # Campaigns list/dashboard

/components/campaigns
  /steps
    /CampaignStep.tsx    # Step 1: Campaign details
    /CustomiseStep.tsx   # Step 2: Message customization
    /RecipientsStep.tsx  # Step 3: Recipient management
    /DeliveryStep.tsx    # Step 4: Schedule delivery
    /PaymentStep.tsx     # Step 5: Payment & review
  /StepIndicator.tsx     # Visual step progress indicator

/lib
  /campaign-types.ts     # TypeScript interfaces and types
  /csv-utils.ts          # CSV parsing and download utilities
```

## How It Works

### Step 1: Campaign Details
Collects basic campaign information:
- Campaign name
- Campaign type (Email, SMS, or Both)
- Description of campaign goals
- Budget allocation

### Step 2: Customise Message
Customizes the campaign content:
- Sender name (required)
- For Email: sender email, subject line, preview text
- For SMS: sender phone number
- Message content (with character counter for SMS)

### Step 3: Recipients
Manages campaign recipients with two methods:

**CSV Upload**:
- Drag-and-drop CSV file
- Supports: name, email, phone columns
- Download example CSV template
- Bulk import multiple recipients

**Manual Entry**:
- Add recipients one at a time
- View all added recipients with remove option
- Shows total recipient count

### Step 4: Delivery
Configures campaign delivery:
- Send immediately or schedule for later
- Timezone selection (10+ options)
- Repeat frequency (once, daily, weekly, monthly)
- Date/time picker for scheduled sends

### Step 5: Payment
Review and payment:
- Campaign summary with cost breakdown
- Billing email address
- Payment method selection:
  - Credit Card (Visa, Mastercard, Amex)
  - PayPal
  - Bank Transfer
- Terms agreement checkbox
- Cost calculation: $0.01 per email, $0.05 per SMS

## Type Definitions

```typescript
interface CampaignData {
  // Step 1
  campaignName: string;
  campaignType: 'email' | 'sms' | 'both';
  description: string;
  budget: number;

  // Step 2
  subject?: string;
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  messageContent: string;
  previewText?: string;

  // Step 3
  recipients: Recipient[];

  // Step 4
  scheduleType: 'immediate' | 'scheduled';
  sendDateTime?: string;
  timezone: string;
  repeatFrequency: 'once' | 'daily' | 'weekly' | 'monthly';

  // Step 5
  paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer';
  billingEmail: string;
  agreeToTerms: boolean;
}

interface Recipient {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
}
```

## CSV Format

Example CSV structure:
```csv
"name","email","phone"
"John Smith","john@example.com","+1-555-0101"
"Sarah Johnson","sarah@example.com","+1-555-0102"
```

The system automatically:
- Removes quotes
- Handles various column orders
- Skips empty rows
- Generates unique IDs for each recipient

## Validation Rules

Each step requires:

| Step | Validation |
|------|-----------|
| 1 | Campaign name, type, description, and budget > 0 |
| 2 | Sender name, message content, and channel-specific fields |
| 3 | At least one recipient |
| 4 | Schedule type with date/time if scheduled |
| 5 | Billing email and terms agreement |

## Cost Calculation

```
Email Campaign: $0.01 per recipient
SMS Campaign: $0.05 per recipient
Both: $0.06 per recipient ($0.01 + $0.05)
```

Example: 1,000 recipients via email = $10.00

## Key Components

### StepIndicator
Shows progress through the 5 steps with:
- Active step highlighted in purple
- Completed steps with checkmark styling
- Step titles and icons
- Visual progress bar

### Form Steps
Each step is a self-contained component that:
- Displays relevant form fields
- Validates input
- Updates global campaign data
- Shows contextual help text

### CSV Utilities
Functions for:
- `parseCSV()`: Parse CSV content into Recipient objects
- `downloadExampleCSV()`: Generate and download template
- `recipientsToCSV()`: Export recipients as CSV

## Integration

The campaigns system is integrated into the main app:
- Home page has "Campaigns" link in navigation
- Route structure: `/campaigns` (list) and `/campaigns/create` (form)
- Uses existing UI components from shadcn/ui
- Responsive design (mobile-friendly)

## Future Enhancements

- Database integration for persistence
- Real payment processing (Stripe)
- Campaign analytics and reporting
- Email template builder
- A/B testing functionality
- Recipient segmentation
- Automation and workflows
- Integration with email/SMS providers

## Styling

- Purple theme (#9333ea) for primary actions
- Clean, professional design with proper spacing
- Gradient backgrounds (gray-50 to gray-100)
- Responsive grid layouts
- Consistent button and form styling using shadcn/ui
