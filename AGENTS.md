## Required Shared Components

The project already contains reusable application-level components.

Before creating any form field, table, dialog, button, or UI primitive:

1. Inspect the existing shared component.
2. Search the project for existing usages.
3. Reuse its current API and patterns.
4. Extend the shared component only when the new functionality is reusable.
5. Create a separate implementation only when the shared component genuinely cannot support the requirement.

Do not bypass shared components simply because writing custom JSX is easier.

---

## Form Fields

For application forms, ALWAYS prefer:

`src/components/common/FormField.tsx`

Do not create custom form inputs when `FormField` already supports the requirement.

### Supported FormField Types

`FormField` currently supports:

- `text`
- `email`
- `tel`
- `number`
- `date`
- `time`
- `url`
- `password`
- `textarea`
- `select`
- `searchSelect`
- `radio`
- `file`
- `contentFile`
- `checkbox`
- `color`
- `otp`
- `toggle`
- `buttonText`

Before building a custom field, verify that one of these existing types can satisfy the requirement.

### Existing FormField Capabilities

Reuse existing FormField props and behavior, including where applicable:

- `label`
- `name`
- `value`
- `onChange`
- `onBlur`
- `onKeyDown`
- `placeholder`
- `required`
- `disabled`
- `readOnly`
- `error`
- `hint`
- `options`
- `rows`
- `maxLength`
- `minLength`
- `pattern`
- `step`
- `min`
- `max`
- `accept`
- `previewUrl`
- `className`
- `colSpan`
- toggle labels
- search-select callbacks
- loading state
- no-options messages
- button variants
- button disabled state

Do not recreate functionality already provided by these props.

### Searchable Select

For searchable dropdown/select requirements, use:

`type="searchSelect"`

Do not build a separate custom searchable dropdown unless the existing implementation cannot satisfy the requirement.

The existing FormField already handles:

- option filtering
- keyboard navigation
- highlighted options
- loading state
- empty state
- clear behavior
- dropdown positioning
- portal rendering

Reuse this behavior.

### Date Fields

For date inputs, use:

`type="date"`

Reuse the existing date parsing, formatting, and date-picker behavior.

Do not create another date picker unless explicitly requested.

### OTP

For OTP inputs, use:

`type="otp"`

Do not create a separate OTP component unless explicitly required.

### Toggle

For boolean toggle fields, use:

`type="toggle"`

Use:

- `onToggleChange`
- `toggleActiveLabel`
- `toggleInactiveLabel`

where appropriate.

### Checkbox

For checkbox fields use:

`type="checkbox"`

and the existing:

`onCheckboxChange`

callback.

### File Inputs

Use the existing:

- `file`
- `contentFile`

types before creating another upload field.

Reuse existing:

- `accept`
- `previewUrl`
- `onFileChange`
- `onImageClick`

behavior.

### Low-Level UI Inputs

`FormField.tsx` already uses the project's UI primitives such as:

- `src/components/ui/input.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/button.tsx`

For normal application forms, use `FormField` rather than using these primitives directly.

Use the low-level UI primitives directly only when implementing UI that does not fit the FormField abstraction.

---

## Tables

For ALL application data tables, use:

`src/components/common/TanStackTable.tsx`

Do not create another table implementation or raw `<table>` markup unless explicitly requested or the shared table genuinely cannot satisfy the requirement.

Before implementing a table:

1. Inspect `TanStackTable.tsx`.
2. Search the repository for existing usages.
3. Reuse its current props.
4. Reuse existing column-definition patterns.
5. Enable existing functionality through props instead of rebuilding it.

### Existing TanStackTable Capabilities

The shared table already supports:

- Client-side data
- Server-side data
- Global search
- Sorting
- Column visibility
- Column reordering
- Pagination
- Server-side pagination
- Row selection
- Custom filters
- Download/export
- Custom page sizes
- Row click handling
- Empty-state messages
- Custom header classes
- Custom body classes
- Custom row IDs
- Top toolbar actions
- Expanded rows
- Custom export data
- Scrollable table bodies
- Configurable scroll height

Use these existing capabilities before modifying the table.

### Search

Use:

`enableSearch`

and:

`searchPlaceholder`

Do not create a separate search field outside the table unless the screen design specifically requires it.

For external search handling, use:

`onSearchChange`

when appropriate.

### Sorting

Use:

`enableSorting`

Do not implement custom sorting logic when the shared table sorting is sufficient.

### Pagination

For normal client-side pagination use:

`enablePagination`

with:

- `pageSize`
- `initialPageIndex`
- `pageSizeOptions`

For API-driven pagination use:

`enableServerSidePagination`

and:

`onDataFetch`

with the existing server-side table contract.

Do not create a second pagination implementation.

### Server-Side Table Data

When server-side pagination is required, follow the existing:

`DataFetchFunction<TData>`

and:

`ServerSideDataResponse<TData>`

patterns.

Do not invent a different table-fetching interface unless necessary.

### Column Visibility

Use:

`enableColumnVisibility`

Do not build another column visibility menu.

### Column Reordering

Use:

`enableColumnReordering`

Do not implement another drag/reordering mechanism.

### Row Selection

Use:

`enableRowSelection`

and:

`onSelectionChange`

for selectable tables.

Do not create separate row-selection state unless required by feature-specific business logic.

### Custom Filters

Use:

`customFilters`

for feature-specific filters that should appear in the table toolbar.

Do not modify the shared table for every screen-specific filter.

### Top Actions

Use:

`topActionButton`

for actions such as:

- Add
- Create
- Import
- Bulk action
- Other table-level actions

when the action belongs in the table toolbar.

### Expanded Rows

Use:

- `renderExpandedRow`
- `isRowExpanded`

when expandable table rows are required.

Do not create a separate nested-table implementation when expanded rows are sufficient.

### Downloads / Export

Use:

`showDownload`

and:

`exportDataOverride`

where required.

Reuse the existing export system instead of building a new export implementation.

### Scrollable Tables

Use:

`scrollable`

and:

`scrollableHeight`

for tables that require a bounded vertical scrolling area.

---

## Dialogs / Modals

For dialogs, modals, confirmation prompts, delete confirmations, and popup forms use:

`src/components/ui/dialog.tsx`

Before implementing a dialog:

1. Inspect `dialog.tsx`.
2. Search for existing usages.
3. Follow the same structure.

Do not create custom modal implementations.

---

### Dialog Structure

Use the existing dialog primitives:

- `Dialog`
- `DialogContent`
- `DialogHeader`
- `DialogTitle`
- `DialogDescription`
- `DialogFooter`
- `DialogClose`
- `DialogTrigger`

Use `DialogHeader` and `DialogTitle` for headings.

Use `DialogFooter` for actions.

Use the shared `Button` component for dialog actions.

Use `FormField` for form controls inside dialogs.

Do not create custom modal implementations.

---

### Buttons

For all application buttons use:

`src/components/ui/button.tsx`

The shared Button already supports:
Variants:

- `default`
- `success`
- `destructive`
- `outline`
- `secondary`
- `ghost`
- `link`

Sizes:

- `default`
- `xs`
- `sm`
- `lg`
- `icon`

It also supports:

- `isLoading`
- `disabled`
- `asChild`

Rules:

- Use existing variants before adding custom color styles.
- Use existing sizes before manually setting button dimensions.
- Use `isLoading` for button loading states.
- Use `size="icon"` for icon-only actions where appropriate.
- Icon-only buttons must have an accessible label.
- Do not create styled raw `<button>` elements when the shared Button can be used.
- Do not duplicate Button variants inside feature components.

---

## Component Reuse Priority

Before creating any new component, follow this order:

1. `src/components/common/`
2. `src/components/ui/`
3. Existing feature-specific components
4. Existing implementation elsewhere in the repository
5. Extend an existing reusable component
6. Create a new component only when no suitable implementation exists

Never duplicate existing functionality only to achieve slightly different styling.
