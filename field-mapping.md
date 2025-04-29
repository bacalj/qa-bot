# ACCESS Support Ticket Field Mapping

This document tracks the mapping between human-readable field names and the actual field IDs used in the Jira Service Desk forms.

Some fields are named in a sensible way, others like "customfield_10108" are not so obvious.

## Form-Specific Field Collections

### Access Login Form
```json
{
  "accessLoginFields": [
    {
      "name": "email",
      "question_text": "What is your email?"
    },
    {
      "name": "customfield_10108",
      "question_text": "What is your name?"
    },
    {
      "name": "customfield_10103",
      "question_text": "What is your ACCESS ID?"
    },
    {
      "name": "description",
      "question_text": "Please describe the issue you're having logging in."
    },
    {
      "name": "attachment",
      "question_text": "Would you like to attach a screenshot?"
    },
    {
      "name": "identity_provider",
      "question_text": "Which identity provider were you using?",
      "proforma_field": true
    },
    {
      "name": "browser",
      "question_text": "Which browser were you using?",
      "proforma_field": true
    }
  ]
}
```

### Resource Provider Login Form
```json
{
  "resourceLoginFields": [
    {
      "name": "email",
      "question_text": "What is your email?"
    },
    {
      "name": "customfield_10108",
      "question_text": "What is your name?"
    },
    {
      "name": "customfield_10103",
      "question_text": "What is your ACCESS ID?"
    },
    {
      "name": "customfield_10110",
      "question_text": "Which ACCESS resource are you trying to access?"
    },
    {
      "name": "description",
      "question_text": "Please describe the issue you're having logging in."
    },
    {
      "name": "attachment",
      "question_text": "Would you like to attach a screenshot?"
    },
    {
      "name": "user_id_resource",
      "question_text": "What is your user ID at the resource?",
      "proforma_field": true
    }
  ],
}
```

### Standard Support Ticket Form
```json
{
  "supportTicketFields": [
    {
      "name": "email",
      "question_text": "What is your email address?"
    },
    {
      "name": "customfield_10103",
      "question_text": "What is your ACCESS ID?"
    },
    {
      "name": "customfield_10108",
      "question_text": "What is your name?"
    },
    {
      "name": "summary",
      "question_text": "Please summarize your issue."
    },
    {
      "name": "customfield_10111",
      "question_text": "ACCESS User Support Issue",
      "options": [
        "User Account Question",
        "Allocation Question",
        "User Support Question",
        "CSSN/CCEP Question",
        "Training Question",
        "Metrics Question",
        "OnDemand Question",
        "Pegasus Question",
        "XDMOD Question"
      ]
    },
    {
      "name": "description",
      "question_text": "Please write significant details about your issue"
    },
    {
      "name": "priority",
      "question_text": "Priority",
      "options": [
        "lowest",
        "low",
        "medium",
        "high",
        "highest"
      ]
    },
    {
      "name": "attachment",
      "question_text": "Please attach a file..."
    },
    {
      "name": "access_resource",
      "question_text": "Does your problem involve an ACCESS Resource?",
      "options": [
        "yes",
        "no"
      ]
    },
    {
      "name": "direct_ticket",
      "question_text": "Help us direct your ticket by providing some keywords (type or select multiple)",
      "options": [
        "C, C++",
        "Abaqus",
        "Algorithms",
        "API",
        "Bash",
        "CloudLab",
        "Docker",
        "Hadoop",
        "Jupyter",
        "MatLab",
        "VPN"
        "XML"
      ]
    },
    {
      "name": "no_keyword",
      "question_text": "I do not see a relevant keyword"
    }
  ]
}
```

## URL Segments for Forms

| Form Type | URL Segment |
|-----------|-------------|
| General Support | `/2/group/3/create/17` |
| ACCESS Login | `/2/create/30` |
| Resource Provider Login | `/2/create/31` |
