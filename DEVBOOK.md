# 🧠 DEVBOOK — Living Developer Knowledge Base

> **Purpose**: This is a living, evolving document. It captures every hard-won lesson, pattern, and rule across all projects. When dropped into any IDE with an AI assistant, it gives the AI full context to build correctly the **first time** — no guesswork, no repeated mistakes.

> **Last Updated**: 2026-02-25 | **Active Project**: CloudKitchen

---

## 📋 Table of Contents

- [AI Operating Instructions](#-ai-operating-instructions)
- [Global Rules (All Projects)](#-global-rules-all-projects)
  - [Database & Backend (Supabase)](#1-database--backend-supabase)
  - [Storage & File Uploads](#2-storage--file-uploads)
  - [Frontend Architecture](#3-frontend-architecture)
  - [Form & Input Handling](#4-form--input-handling)
  - [CRUD Operations](#5-crud-operations)
  - [UI/UX Standards](#6-uiux-standards)
  - [Error Handling](#7-error-handling)
- [App-Specific: Food Delivery / Cloud Kitchen](#-app-specific-food-delivery--cloud-kitchen)
  - [Core Features Checklist](#core-features-checklist)
  - [Database Schema Patterns](#database-schema-patterns)
  - [Admin Portal Rules](#admin-portal-rules)
  - [Customer-Facing Rules](#customer-facing-rules)
  - [Image Management Rules](#image-management-rules)
  - [Order Flow](#order-flow)
- [App-Specific: Task Manager](#-app-specific-task-manager-template)
- [Project Log: CloudKitchen](#-project-log-cloudkitchen)
  - [Tech Stack](#tech-stack)
  - [Key Decisions](#key-decisions)
  - [Bugs Caught & Fixed](#bugs-caught--fixed)
  - [Rules Born From This Project](#rules-born-from-this-project)
- [Changelog](#-changelog)

---

## 🤖 AI Operating Instructions

> **READ THIS FIRST.** This section defines how any AI assistant should behave when using this document.

### Identity & Behavior

- You are a **senior full-stack developer** working on this project. Treat this document as your team's engineering handbook.
- **DO NOT** argue with or override rules in this document. They exist because a human made a deliberate decision.
- **DO NOT** introduce new libraries, frameworks, or architectural patterns without explicit user approval.
- **DO NOT** silently change design patterns (e.g., switching from client-side fetching to server components) unless asked.

### Conflict Resolution Protocol

When two AI sessions disagree, or when you think a rule here is wrong:

1. **NEVER silently override.** The document wins until the human says otherwise.
2. **ASK the user**: _"DEVBOOK rule X says [thing]. I think [alternative] might be better because [reason]. Should I update the rule, or follow it as-is?"_
3. **If the user says update it**, update the rule in this document AND log the change in [Changelog](#-changelog).
4. **If the user says keep it**, follow it without further argument.

### Priority Order

```
1. User's direct instruction in the current conversation  (HIGHEST)
2. App-Specific rules in this document
3. Global rules in this document
4. AI's own best practices                                (LOWEST)
```

> **Global rules are defaults.** App-Specific sections can override them. If an App-Specific rule contradicts a Global rule, the **App-Specific rule wins** for that app type.

### How To Use This Document

- **Starting a new project?** → Read [Global Rules](#-global-rules-all-projects) + the matching App-Specific section.
- **Resuming an existing project?** → Read the relevant [Project Log](#-project-log-cloudkitchen) to understand current state.
- **Found a new pattern/bug?** → Add it to the relevant section AND log it in [Changelog](#-changelog).
- **Building a new app type?** → Create a new `App-Specific` section using the template structure.

### What NOT To Do

| ❌ Don't                                            | ✅ Do Instead                                                 |
| -------------------------------------------------- | ------------------------------------------------------------ |
| Auto-install packages not in `package.json`        | Ask user before adding dependencies                          |
| Change database schema without updating this doc   | Update both schema AND this doc                              |
| Use placeholder images from random URLs            | Use the project's own image pipeline                         |
| Default numeric inputs to `0`                      | Use empty string `""` with placeholder text                  |
| Upload files to storage immediately on selection   | Queue locally, upload only on explicit "Save"                |
| Leave orphan files in storage after delete/replace | Always clean up old files from storage buckets               |
| Create storage buckets from code                   | Document bucket setup + have user create manually or via SQL |
| Skip RLS policies for any CRUD operation           | Every table operation needs a matching RLS policy            |

---

## 🌐 Global Rules (All Projects)

> These apply to **every** project unless overridden by an App-Specific section.

### 1. Database & Backend (Supabase)

#### Schema Design
- **Primary Keys**: Always `UUID` via `gen_random_uuid()`. Never use auto-incrementing integers.
- **Timestamps**: Every table gets `created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL`.
- **Soft Deletes**: For user-facing data, prefer a `deleted_at` column over hard deletes. Admin tables can use hard deletes.
- **Price Storage**: Store prices as **integers** (paise/cents), not floats. Display conversion happens in the frontend. e.g., `₹249` is stored as `249`.
- **Arrays**: Use `TEXT[]` for simple tag/category lists. Use a junction table if relationships are complex.
- **Naming**: Tables are `snake_case` plural (`menu_items`, `order_items`). Columns are `snake_case` singular (`customer_name`, `total_amount`).

#### Row Level Security (RLS)
- **ALWAYS enable RLS** on every table: `ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;`
- **Every CRUD operation needs its own policy.** If the app can SELECT, INSERT, UPDATE, and DELETE on a table, that table needs **four** separate policies.
- **Common mistake**: Forgetting the INSERT policy. If you can read and update but not insert, new items will fail with `"violates row-level security policy"`.
- **Demo/Dev mode**: Use `USING (true)` / `WITH CHECK (true)` for open access. Tighten before production.

```sql
-- TEMPLATE: Full CRUD policies for a table
CREATE POLICY "select_tablename" ON tablename FOR SELECT USING (true);
CREATE POLICY "insert_tablename" ON tablename FOR INSERT WITH CHECK (true);
CREATE POLICY "update_tablename" ON tablename FOR UPDATE USING (true);
CREATE POLICY "delete_tablename" ON tablename FOR DELETE USING (true);
```

#### Supabase Client
- Single shared client instance in `src/utils/supabase/client.js`.
- **Never** create multiple Supabase client instances across files.
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

### 2. Storage & File Uploads

#### Bucket Setup
- **Never create buckets from application code.** Create them manually via Supabase Dashboard or via SQL migration.
- Bucket config when creating via Dashboard UI:
  - ✅ **Public bucket**: ON (for user-facing assets like product images)
  - ✅ **Restrict file size**: ON → `5MB` max
  - ✅ **Restrict MIME types**: ON → `image/jpeg`, `image/png`, `image/webp`
- Bucket needs **four** RLS policies on `storage.objects`: SELECT, INSERT, UPDATE, DELETE.

```sql
-- TEMPLATE: Storage bucket policies
CREATE POLICY "read"   ON storage.objects FOR SELECT USING (bucket_id = 'BUCKET_NAME');
CREATE POLICY "upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'BUCKET_NAME');
CREATE POLICY "update" ON storage.objects FOR UPDATE USING (bucket_id = 'BUCKET_NAME');
CREATE POLICY "delete" ON storage.objects FOR DELETE USING (bucket_id = 'BUCKET_NAME');
```

#### Upload Flow (Critical Pattern)
```
User drops/pastes/selects file
         ↓
Validate (type + size) client-side
         ↓
Create local blob URL → URL.createObjectURL(file)
         ↓
Show instant preview in UI (NO network call yet)
         ↓
Store raw File object in state (e.g., `imageFile`)
         ↓
User clicks "Save"
         ↓
Upload File to Supabase Storage → get public URL
         ↓
Save public URL to database row
         ↓
If EDITING: delete old file from storage bucket
```

> **WHY**: Uploading immediately on drop/paste creates orphan files if the user cancels. Always queue the file and upload only on explicit save.

#### File Naming
- Generate unique names: `` `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${ext}` ``
- Organize in subdirectories: `items/`, `avatars/`, `banners/`

#### Cleanup Rules
- **On image replace (edit)**: Delete the old image from storage before or after uploading the new one.
- **On item delete**: Delete the associated image from storage.
- **Detection**: Check if the URL contains `/storage/v1/object/public/BUCKET_NAME/` before attempting deletion. External URLs (Unsplash, etc.) should be ignored.

```javascript
// Extract storage path from public URL
const oldPath = oldUrl.split('/public/BUCKET_NAME/')[1];
if (oldPath) {
    await supabase.storage.from('BUCKET_NAME').remove([oldPath]);
}
```

### 3. Frontend Architecture

#### Tech Stack Defaults
- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS or Tailwind (confirm with user)
- **State**: React `useState` + `useContext` for simple apps. No Redux unless explicitly needed.
- **Data Fetching**: Client-side `useEffect` with Supabase JS client for admin pages. Server components for public pages where possible.
- **Icons**: Google Material Symbols Outlined (via CDN link in layout)

#### File Structure
```
src/
├── app/
│   ├── (main)/          # Customer-facing routes (with shared layout)
│   │   ├── layout.js
│   │   ├── page.js      # Home/Menu
│   │   ├── cart/
│   │   └── profile/
│   ├── admin/           # Admin portal (separate layout, protected)
│   │   ├── layout.js
│   │   ├── page.js      # Dashboard
│   │   ├── menu/
│   │   └── orders/
│   ├── layout.js        # Root layout
│   └── globals.css
├── components/          # Reusable UI components
├── context/            # React Context providers
├── data/               # Static data, constants, category lists
└── utils/
    └── supabase/
        └── client.js   # Single Supabase client instance
```

### 4. Form & Input Handling

#### Numeric Fields
- **NEVER** default numeric inputs to `0`. Use empty string `""` as initial state.
- Use `placeholder="Price"` to show hint text when empty.
- Handle the `onChange` carefully to allow clearing:
```javascript
onChange={(e) => setForm({ ...form, price: e.target.value === '' ? '' : Number(e.target.value) })}
```

#### Validation Before Save
Always validate before making any API call:
```javascript
if (!form.name.trim()) { alert("Name is required."); return; }
if (!form.price || Number(form.price) <= 0) { alert("Price must be > 0."); return; }
```

#### Save Button States
- Disable the save button while saving: `disabled={isSaving}`
- Show a loading spinner inside the button during save.
- Use `isSaving` state to prevent double-submits.

### 5. CRUD Operations

#### Optimistic UI Updates
- Update local state **immediately** before the API call for a snappy feel.
- If the API call fails, show an error alert. Optionally revert the optimistic change.

```javascript
// Optimistic toggle
setItems(items.map(i => i.id === id ? { ...i, in_stock: !i.in_stock } : i));
await supabase.from('table').update({ in_stock: !item.in_stock }).eq('id', id);
```

#### Delete Flow
1. Show `window.confirm()` before destructive actions.
2. Optimistically remove from local state.
3. Delete from database.
4. Clean up associated storage files (images, attachments).

#### Add New Item Flow
1. Open modal/form with **empty** fields (no `0` defaults for numbers).
2. User fills in data + optionally queues an image.
3. On "Save": validate → upload queued image → insert row → update local state.
4. On "Cancel": discard everything, no orphan uploads.

### 6. UI/UX Standards

#### Design Philosophy
- Reject generic Bootstrap/SaaS patterns. Every component must feel **bespoke and premium**.
- Use architectural layouts, intentional whitespace, and typography as structure.
- Micro-animations on hover, entry, and state changes.
- Dark overlays on image hover for action affordance (e.g., "Change Image" overlay).

#### Modal Design Pattern
- **Vertical layout**: Image/media on top → form fields below.
- Image area: Large dropzone when empty, full preview when populated.
- Sticky header (title + close button) and sticky footer (cancel + save buttons).
- Backdrop: `bg-black/50 backdrop-blur-sm`.

#### Table Design
- Sticky header with uppercase column labels.
- Row hover effects.
- Actions column on the far right with icon buttons (Edit, Delete).
- Stock status as toggle switches, not dropdowns.

### 7. Error Handling

- Always `console.error` the full error object for debugging.
- Show user-facing `alert()` with the error message for now. Replace with toast notifications in production.
- Never let a failed API call crash the UI silently.

---

## 🍕 App-Specific: Food Delivery / Cloud Kitchen

> These rules apply specifically to food delivery, restaurant, or cloud kitchen apps. They **override** Global Rules where noted.

### Core Features Checklist

#### Customer-Facing (Priority Order)
- [ ] **Menu Display** — Grid of food cards with image, name, price, rating, veg/non-veg indicator
- [ ] **Category Filtering** — Horizontal scrollable category chips
- [ ] **Search** — Real-time search across item name and categories
- [ ] **Cart** — Add/remove items, quantity controls, running total
- [ ] **Order Placement** — Customer name + items → create order
- [ ] **Order Tracking** — Show order status (New → Cooking → Ready → Delivered)
- [ ] **Profile** — Basic customer info and order history
- [ ] **Ratings & Reviews** — Post-delivery feedback (future)
- [ ] **Delivery Address** — Address picker with map integration (future)
- [ ] **Payment Gateway** — Razorpay/Stripe integration (future)
- [ ] **Push Notifications** — Order status updates (future)

#### Admin Portal (Priority Order)
- [x] **Dashboard** — Overview stats (total orders, revenue, popular items)
- [x] **Menu Manager** — Full CRUD for menu items with image upload
- [x] **Order Manager** — View all orders, update status pipeline
- [ ] **Analytics** — Sales trends, peak hours, top items (future)
- [ ] **Coupon Management** — Create/manage discount codes (future)
- [ ] **Delivery Partner View** — Assign and track delivery (future)

### Database Schema Patterns

#### `menu_items` Table
| Column           | Type             | Notes                                     |
| ---------------- | ---------------- | ----------------------------------------- |
| `id`             | UUID (PK)        | Auto-generated                            |
| `name`           | TEXT NOT NULL    | Item display name                         |
| `description`    | TEXT             | Short description                         |
| `price`          | INTEGER NOT NULL | Current price in smallest currency unit   |
| `original_price` | INTEGER          | Strike-through price for discounts        |
| `categories`     | TEXT[]           | Array of category IDs                     |
| `image`          | TEXT             | Public URL (Supabase Storage or external) |
| `rating`         | NUMERIC(2,1)     | Default 4.0                               |
| `in_stock`       | BOOLEAN          | Default true, toggled from admin          |
| `is_popular`     | BOOLEAN          | Shown in "Popular" section                |
| `is_new`         | BOOLEAN          | Shown with "New" badge                    |
| `tags`           | TEXT[]           | Dietary tags: veg, spicy, etc.            |
| `created_at`     | TIMESTAMPTZ      | Auto-generated                            |

#### `orders` Table
| Column           | Type          | Notes                                           |
| ---------------- | ------------- | ----------------------------------------------- |
| `id`             | UUID (PK)     | Internal ID                                     |
| `display_id`     | TEXT UNIQUE   | Human-readable: `ORD-8821`                      |
| `customer_name`  | TEXT NOT NULL | —                                               |
| `customer_email` | TEXT          | Optional                                        |
| `status`         | TEXT          | Enum: `new` → `cooking` → `ready` → `delivered` |
| `total_amount`   | INTEGER       | Sum at time of order                            |
| `created_at`     | TIMESTAMPTZ   | —                                               |

#### `order_items` Junction Table
| Column          | Type                 | Notes                                                 |
| --------------- | -------------------- | ----------------------------------------------------- |
| `id`            | UUID (PK)            | —                                                     |
| `order_id`      | UUID FK → orders     | CASCADE delete                                        |
| `menu_item_id`  | UUID FK → menu_items | CASCADE delete                                        |
| `quantity`      | INTEGER              | Default 1                                             |
| `price_at_time` | INTEGER              | **Historical price** — never references current price |

> **CRITICAL**: `price_at_time` captures the price when the order was placed. Never join back to `menu_items.price` for order totals — prices change over time.

### Admin Portal Rules

#### Menu Manager Behavior
1. **Add New Item**: Opens modal with empty fields. Image area shows dropzone. No default image URL.
2. **Edit Item**: Opens modal pre-filled with existing data. Image area shows current image with "Change" overlay on hover.
3. **Image Upload**: Queued locally (blob preview) → uploaded to Supabase Storage only on "Save". Old image deleted from storage on replace.
4. **Delete Item**: Confirmation dialog → delete from DB → delete associated image from storage.
5. **Stock Toggle**: Inline toggle switch. Optimistic update. Greyed-out items in customer menu.

#### Order Manager Behavior
1. **Status Pipeline**: `new` → `cooking` → `ready` → `delivered`. One-way forward flow.
2. **Color Coding**: New=Blue, Cooking=Orange, Ready=Green, Delivered=Gray.
3. **Real-time**: Consider Supabase Realtime subscriptions for live order updates.

### Customer-Facing Rules

#### Food Card Component
- **Veg/Non-veg indicator**: Green dot = veg, Red dot = non-veg (follow Indian food label standards).
- **Out of stock**: Greyscale filter on image, strikethrough on name, disable "Add" button.
- **Popular badge**: Small saffron/gold tag on popular items.
- **Price display**: `₹249` format. Show original price with strikethrough if discounted.

#### Cart
- Persist cart in React Context (or localStorage for persistence across sessions).
- Show item count badge on cart icon.
- Allow quantity adjustment (min 1, or remove to delete).

### Image Management Rules

> Overrides nothing in Global — these are food-delivery-specific additions.

- **Aspect Ratio**: Food images should be displayed as squares or 4:3 in cards, 16:9 in modals/detail views.
- **Fallback**: If no image, show a food-themed placeholder icon (`restaurant` material icon), not a broken image tag.
- **Bucket Name**: `menu-images` with subfolder `items/` for menu item photos.
- **Accepted formats**: JPEG, PNG, WebP. Max 5MB.

### Order Flow

```
Customer browses menu
        ↓
Adds items to cart (Context state)
        ↓
Views cart → adjusts quantities
        ↓
Clicks "Place Order" → enters name
        ↓
Frontend creates `orders` row + `order_items` rows
        ↓
Admin sees new order in Order Manager
        ↓
Admin updates status: new → cooking → ready → delivered
        ↓
Customer sees status update (polling or realtime)
```

---

## 📋 App-Specific: Task Manager (Template)

> Placeholder for future task manager apps. Copy this structure and fill in when building one.

### Core Features Checklist
- [ ] Task CRUD with title, description, due date, priority
- [ ] Drag-and-drop Kanban board
- [ ] Labels/Tags
- [ ] Assignee management
- [ ] Due date reminders
- [ ] File attachments

### Database Schema Patterns
_To be filled from first task manager project._

### UI Rules
_To be filled from first task manager project._

---

## 📦 Project Log: CloudKitchen

> **Repo**: `/media/unaced/Main/cloudkitchen`  
> **Status**: Active Development  
> **Started**: 2026-02  

### Tech Stack
| Layer     | Choice                               |
| --------- | ------------------------------------ |
| Framework | Next.js 15 (App Router)              |
| Styling   | Vanilla CSS (`globals.css`)          |
| Backend   | Supabase (Postgres + Storage + Auth) |
| Icons     | Material Symbols Outlined            |
| Hosting   | Local dev (`npm run dev`)            |

### Key Decisions

| Decision                       | Rationale                                                             |
| ------------------------------ | --------------------------------------------------------------------- |
| Client-side fetching for admin | Admin pages are behind auth, no SEO needed. Simpler state management. |
| `TEXT[]` for categories        | Simple enough for small product catalogs. Junction table overkill.    |
| `INTEGER` for prices           | Avoids floating point issues. All prices in whole rupees.             |
| `display_id` on orders         | Users see `ORD-8821`, not UUIDs. Better for phone/chat support.       |
| Single Supabase client         | Avoids connection pool issues and ensures consistent auth state.      |
| Blob preview before upload     | Prevents orphan files in storage. Upload only on confirmed save.      |

### Bugs Caught & Fixed

| Bug                             | Root Cause                                                        | Fix                                                                  | Rule Created                                       |
| ------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------- |
| "Violates RLS policy" on insert | Missing INSERT policy on `menu_items`                             | Added `CREATE POLICY` for INSERT                                     | Every table needs policies for ALL operations used |
| Price field stuck at `0`        | `useState` initialized with `0`, input type=number won't clear it | Initialize numeric fields with `""`, handle empty string in onChange | Never default numeric inputs to `0`                |
| Duplicate images in storage     | Image uploaded immediately on drop, then again if user re-drops   | Queue file locally, upload only on "Save"                            | Never upload before explicit save                  |
| Orphan images after edit        | Old image not deleted when new image uploaded for existing item   | Extract old storage path and call `.remove()`                        | Always clean up replaced files                     |
| Orphan images after delete      | Item deleted but its image stayed in storage                      | Added storage cleanup in delete handler                              | Always clean up on item deletion                   |
| Table actions not working       | "Actions" column had a non-functional `more_vert` icon            | Replaced with real Edit + Delete icon buttons                        | Every action column must have working handlers     |

### Rules Born From This Project

These rules were discovered during CloudKitchen development and have been promoted to the Global or App-Specific sections above:

1. **Deferred Upload Pattern** — Queue files locally, upload only on save. _(→ Global > Storage)_
2. **Storage Cleanup on Edit/Delete** — Always remove old files when replacing or deleting items. _(→ Global > Storage)_
3. **Full RLS Policy Set** — Every CRUD operation needs its own RLS policy per table. _(→ Global > Database)_
4. **No Zero Defaults on Numeric Inputs** — Use `""` with placeholder text. _(→ Global > Form Handling)_
5. **Storage Bucket Needs 4 Policies** — SELECT + INSERT + UPDATE + DELETE on `storage.objects`. _(→ Global > Storage)_
6. **Confirmation Before Destructive Actions** — Always `window.confirm()` before deletes. _(→ Global > CRUD)_
7. **Save Button Loading State** — Disable + show spinner to prevent double-submits. _(→ Global > Form Handling)_
8. **Vertical Modal Layout** — Image on top, form fields below, sticky header/footer. _(→ App-Specific > Admin)_

---

## 📝 Changelog

> Every time a rule is added, changed, or removed — log it here. This is the audit trail.

| Date       | Section           | Change                                  | Reason                                                              | Project Source |
| ---------- | ----------------- | --------------------------------------- | ------------------------------------------------------------------- | -------------- |
| 2026-02-25 | Global > Storage  | Added "Deferred Upload Pattern"         | Images were uploading on drop, creating orphans on cancel           | CloudKitchen   |
| 2026-02-25 | Global > Storage  | Added "4 policies per bucket" rule      | Uploads failed silently without INSERT policy on `storage.objects`  | CloudKitchen   |
| 2026-02-25 | Global > Storage  | Added "Cleanup on edit/delete" rule     | Old images accumulated in bucket, wasting storage                   | CloudKitchen   |
| 2026-02-25 | Global > Database | Added "Full RLS policy set" rule        | INSERT operation failed with `violates row-level security`          | CloudKitchen   |
| 2026-02-25 | Global > Forms    | Added "No zero defaults" rule           | `0` locked in number input, couldn't clear it                       | CloudKitchen   |
| 2026-02-25 | Global > CRUD     | Added "Confirmation before delete" rule | Items were deleted on single click, too easy to accidentally delete | CloudKitchen   |
| 2026-02-25 | Food Delivery     | Created full App-Specific section       | Initial documentation from CloudKitchen project                     | CloudKitchen   |
| 2026-02-25 | AI Instructions   | Created conflict resolution protocol    | Document will be used across multiple AI sessions                   | CloudKitchen   |

---

> _"The best documentation is born from pain. Every rule here is a bug we fixed or a mistake we refuse to repeat."_
