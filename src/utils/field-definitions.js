/**
 * Centralized field definitions for ticket flows
 * Maps between flow keys, JSM keys, and UI labels
 */
export const TICKET_FIELDS = {
  // Common fields used across different ticket types
  common: {
    email: {
      flowKey: 'email',
      jsmKey: 'customfield_10124',
      label: 'Email',
      required: true
    },
    name: {
      flowKey: 'name',
      jsmKey: 'customfield_10108',
      label: 'Name',
      required: true
    },
    accessId: {
      flowKey: 'accessid',
      jsmKey: 'customfield_10091',
      label: 'ACCESS ID',
      required: true
    }
  },

  // Fields for the dev flow
  dev: {
    summary: {
      flowKey: 'summary',
      jsmKey: 'summary',
      label: 'Summary',
      required: true
    },
    description: {
      flowKey: 'description',
      jsmKey: 'description',
      label: 'Description',
      required: true
    }
  }
};