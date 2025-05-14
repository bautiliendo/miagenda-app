export const dayPickerStyles = `
    .rdp {
      --rdp-cell-size: 42px;
      --rdp-accent-color: rgb(37 99 235); /* blue-600 */
      --rdp-background-color: rgb(239 246 255); /* blue-50 */
      margin: 0;
      border-radius: 0.75rem;
      border: 1px solid rgb(229 231 235); /* gray-200 */
      padding: 1rem;
      background-color: white;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }

    .rdp-months {
      justify-content: center;
    }

    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
      background-color: rgb(239 246 255) !important; /* blue-50 */
      color: rgb(37 99 235); /* blue-600 */
    }

    .rdp-day_selected, 
    .rdp-day_selected:focus-visible, 
    .rdp-day_selected:hover {
      background-color: rgb(37 99 235) !important; /* blue-600 */
      color: white !important;
      font-weight: 600;
    }

    .rdp-button {
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
      width: var(--rdp-cell-size);
      height: var(--rdp-cell-size);
    }

    .rdp-button[disabled] {
      opacity: 0.25;
    }

    .rdp-caption_label {
      font-weight: 600;
      font-size: 0.95rem;
      color: rgb(17 24 39); /* gray-900 */
      text-transform: capitalize;
      margin: 0 1rem;
    }

    .rdp-nav {
      gap: 0.5rem;
    }

    .rdp-nav_button {
      border: 1px solid rgb(229 231 235); /* gray-200 */
      border-radius: 0.5rem;
      padding: 0.4rem;
      color: rgb(75 85 99); /* gray-600 */
      background-color: white;
      transition: all 0.2s;
    }

    .rdp-nav_button:hover {
      background-color: rgb(239 246 255); /* blue-50 */
      color: rgb(37 99 235); /* blue-600 */
      border-color: rgb(191 219 254); /* blue-200 */
    }

    .rdp-table {
      margin: 0.75rem 0 0.25rem;
    }

    .rdp-head_cell {
      font-size: 0.75rem;
      font-weight: 500;
      color: rgb(107 114 128); /* gray-500 */
      text-transform: uppercase;
      padding-bottom: 0.75rem;
    }

    .rdp-day {
      border-radius: 0.5rem;
    }

    .rdp-day_today:not(.rdp-day_selected) {
      color: rgb(37 99 235); /* blue-600 */
      font-weight: 600;
      background-color: rgb(239 246 255); /* blue-50 */
    }

    .rdp-day_outside {
      opacity: 0.3;
    }
  `;