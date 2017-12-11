# Tag.Me API

[Docs](../readme.md)

This RESTful HTTP API exposes functions from the Tag.Me task management system 
for use by approved third parties and the native Tag.Me application itself.

## API Environment Variables

### **.env**

* At the root of **api** folder, copy the **.env-sample** file as **.env** file.

### Authorization

No authorization at this time. Authorization will be included in future
releases.

### Request Headers

The following request headers are required when calling the API:

* `Content-Type` - The `Content-Type` request header should include a value of
  `application/json` and is required when providing content within the body of a
  request.

### Date Format

Date are formatted to the ISO 8601 standard.

### HTTP Verbs

TODO: update to relevant verbs for Tag.Me:
| VERB   | Description                                                                                                                                                                                      |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | Use to retrieve all resources (organizations) and resource categories via `\resources`, `\categories` and a single resource and a single category via `\resources\{id}`, and `\categories\{id}`. |
| POST   | Used to create a resource (organization) and resource category via `\resources` and `\categories`.                                                                                               |
| PUT    | Used to update a resource (organization) and resource category via `\resources\{id}` and `\categories\{id}`.                                                                         |
| DELETE | Used to delete a single resource and a single resource category via `\resources\{id}` and `\categories\{id}`.                                                                                                                                         |

### Content Types

All endpoints accept and return data formatted as JSON. See Request Headers.

### Filtering

TODO: talk about the endpoints that have a filter query string and provide a
couple of examples.

## Users

## POST /users

Adds a user to the collection of users. The fields
`orgID`, and `email` are required fields.

** Sample Request **

```
POST /users

{
"name":"Im New! 01", 
"orgID":1, 
"email":"newGuy@dm.com", 
"displayName": "New Guy!"
}
```

** Sample 201 Response **

```
{
  "ok": true,
  "id": "123456"
}
```

## GET /users/{id}

Gets a user by userID.

** Sample Request **

```
GET /user/12345
```

** Sample 200 Response **

```
 {
    "ID": 12345,
    "name": "Jim Halpert3",
    "orgID": 1,
    "email": "jh@dundermiff.com",
    "displayName": "Jim"
}
```

## PUT /users/{id}

Edits the user object. 

** Sample Request **

```
PUT /categories/benefits

{
  userID: "12345",
  name: "John Halpert"
}
```

** Sample 202 Response **

```
{
  ok: true,
  userID: "12345"
}
```

## DELETE /users/{id}

** Not currently implemented, may be available in the future **


## GET /users

Retrieves an array of users.

** Sample Request **

```
GET /users
```

** Sample 200 Response **

```
[
    {
        "ID": 2,
        "name": "Jim Halpert3",
        "orgID": 1,
        "email": "jh@dm3.com",
        "displayName": "Jim"
    },
    {
        "ID": 4,
        "name": "Pam Halpert",
        "orgID": 1,
        "email": "ph@dm.com",
        "displayName": "Pam"
    }
]
```

## Tasks

## POST /task

Adds a task. The fields
`orgID` and `title` are required fields.

** Sample Request **

```
POST /tasks

{
    "ID": 1029,
    "title": "Run Payroll",
    "goal": "Run payroll, including calculation of sales comp.",
    "due": "2017-12-19 00:00:00",
    "requestedBy": 2,
    "team": 1,
    "estimatedEffort": 6,
    "status": "NS"
}
```

** Sample 201 Response **

```
{
ok: "true",
_id: "12345"
}
```

## GET /tasks

Retrieves a list of resources.

** Sample Request **

```
GET /tasks
```

** Sample 200 Response **

```
[
  {
    _id: "resource_va",
    _rev: "1-A6157A5EA545C99B00FF904EEF094035U",
    type: "resource",
    categoryId: "category_basic-needs-assistance",
    name: "VA",
    formalName: "VA Homeless Prevention Program and Walk-In Clinic",
    shortDesc: "housing, medical",
    purpose: "The Ralph H. Johnson Veterans Affairs Medical Center offers a walk-in clinic for veterans searching for re-housing assistance and means to prevent homelessness. In addition to referral services, the walk-in clinic offers basic outpatient medical care.",
    website: "http://www.charleston.va.gov/services/homeless/index.asp",
    contacts: [
      {name: "Linda Williams", office: null, title: "", phone: "843-577-5011", email: null, isPrimary: true}
    ],
    addresses: [
      {
        isPrimary: true,
        location: "Ralph H. Johnson Veterans Affairs Medical Center",
        street:  "109 Bee Street",
        city: "Charleston",
        state: "SC",
        zip: "29401"
      }],
    rank: 10,
    faq: [
      {question: "What are you office hours?", answer: "M-F 9 a.m. to 4 p.m. except federal holidays.", sort: 10},
      {question: "What forms of payment do you accept?", answer: "cash, debit, credit", sort: 20},
    ]
  },
  {
    _id: "resource_TAP",
    _rev: "1-A6157A5EA545C99B00FF904EEF094035U",
    type: "resource",
    categoryId: "category_basic-needs-assistance",
    name: "TAP",
    formalName: "Airmen & Family Readiness Center Transition Assistance Program",
    shortDesc: "employment assistance, separation prep",
    purpose: "The Airman & Family Readiness Center assists all Reserves, Active Duty, National Guard, retired veterans and civilian employees regardless of branch. The Transition Assistance Program (TAP) assists those associated specifically with the United States Air Force and prepares separating, retiring, and demobilizing service members and their families with skills and knowledge to facilitate a successful transition from life in the military to the civilian sector. The first step in the transition process is to complete the congressionally-mandated pre-separation counseling session, which provides detailed information on the various benefits and services available to separating members. Each Family Readiness Center is staffed to provide personalized assistance for all transition-related needs ofarmed services members.",
    website: "http://www.jbcharleston.com/youth-and-family/air-base/airman-a-family-readiness",
    contacts: [
      {name: null, office: null, title: null, phone: "843-963-7231", email: null, isPrimary: true}
    ],
    addresses: [
      {
        isPrimary: true,
        location: "Airmen & Family Readiness Center Transition Assistance Program",
        street:  "104 E. Simpson St, building 500,",
        city: "Joint Base Charleston",
        state: "SC",
        zip: "29404"
      }],
    rank: 10,
    faq: []
  }, ...
]
```

## GET /resources/{id}

Retrieves a specific resources.

** Sample Request **

```
GET /resources/va
```

** Sample 200 Response **

```
  {
    _id: "resource_va",
    _rev: "1-A6157A5EA545C99B00FF904EEF094035U",
    type: "resource",
    categoryId: "category_basic-needs-assistance",
    name: "VA",
    formalName: "VA Homeless Prevention Program and Walk-In Clinic",
    shortDesc: "housing, medical",
    purpose: "The Ralph H. Johnson Veterans Affairs Medical Center offers a walk-in clinic for veterans searching for re-housing assistance and means to prevent homelessness. In addition to referral services, the walk-in clinic offers basic outpatient medical care.",
    website: "http://www.charleston.va.gov/services/homeless/index.asp",
    contacts: [
      {name: "Linda Williams", office: null, title: "", phone: "843-577-5011", email: null, isPrimary: true}
    ],
    addresses: [
      {
        isPrimary: true,
        location: "Ralph H. Johnson Veterans Affairs Medical Center",
        street:  "109 Bee Street",
        city: "Charleston",
        state: "SC",
        zip: "29401"
      }],
    rank: 10,
    faq: [
      {question: "What are you office hours?", answer: "M-F 9 a.m. to 4 p.m. except federal holidays.", sort: 10},
      {question: "What forms of payment do you accept?", answer: "cash, debit, credit", sort: 20},
    ]
  }
```

## SEARCH /resources

Returns a listing of resources by filtering on the resource `name` property.

** Sample Request **

```
GET /resources?filter=name:VA
```

** Sample 200 Response **

```
  {
    _id: "resource_va",
    _rev: "1-A6157A5EA545C99B00FF904EEF094035U",
    type: "resource",
    categoryId: "category_basic-needs-assistance",
    name: "VA",
    formalName: "VA Homeless Prevention Program and Walk-In Clinic",
    shortDesc: "housing, medical",
    purpose: "The Ralph H. Johnson Veterans Affairs Medical Center offers a walk-in clinic for veterans searching for re-housing assistance and means to prevent homelessness. In addition to referral services, the walk-in clinic offers basic outpatient medical care.",
    website: "http://www.charleston.va.gov/services/homeless/index.asp",
    contacts: [
      {name: "Linda Williams", office: null, title: "", phone: "843-577-5011", email: null, isPrimary: true}
    ],
    addresses: [
      {
        isPrimary: true,
        location: "Ralph H. Johnson Veterans Affairs Medical Center",
        street:  "109 Bee Street",
        city: "Charleston",
        state: "SC",
        zip: "29401"
      }],
    rank: 10,
    faq: [
      {question: "What are you office hours?", answer: "M-F 9 a.m. to 4 p.m. except federal holidays.", sort: 10},
      {question: "What forms of payment do you accept?", answer: "cash, debit, credit", sort: 20},
    ]
  }
```

## UPDATE /resources/{id}

Updates an existing specific resource.

** Sample Request **

```
PUT /resources/:id

{
  _id: "resource_TAP",
  _rev: "1-A6157A5EA545C99B00FF904EEF094035U",
  type: "resource",
  categoryId: "category_basic-needs-assistance",
  name: "TAP",
  formalName: "Airmen & Family Readiness Center Transition Assistance Program",
  shortDesc: "employment assistance, separation prep",
  purpose: "The Airman & Family Readiness Center assists all Reserves, Active Duty, National Guard, retired veterans and civilian employees regardless of branch. The Transition Assistance Program (TAP) assists those associated specifically with the United States Air Force and prepares separating, retiring, and demobilizing service members and their families with skills and knowledge to facilitate a successful transition from life in the military to the civilian sector. The first step in the transition process is to complete the congressionally-mandated pre-separation counseling session, which provides detailed information on the various benefits and services available to separating members. Each Family Readiness Center is staffed to provide personalized assistance for all transition-related needs ofarmed services members.",
  website: "http://www.jbcharleston.com/youth-and-family/air-base/airman-a-family-readiness",
  contacts: [
    {name: Diane Schaffer, office: Airmen & Family Readiness, title: Director, phone: "843-963-7231", email: d.schaffer@us.af.mil, isPrimary: true}
  ],
  addresses: [
    {
      isPrimary: true,
      location: "Airmen & Family Readiness Center Transition Assistance Program",
      street:  "104 E. Simpson St, building 500,",
      city: "Joint Base Charleston",
      state: "SC",
      zip: "29404"
    }],
  rank: 10,
  faq: []
}, ...
```

** Sample 200 Response **

```
{
ok: "true",
_id: "resource_TAP",
_rev: "2-A6157A5EA545C99B00FF904EEF094035U"
}
```

## DELETE /resources/{id}

Deletes the provided resource from the resource list.

** Sample Request **

```
DELETE /resources/va
```

** Sample 200 Response **

```
[
  {
    _id: "resource_va",
    _rev: "1-A6157A5EA545C99B00FF904EEF05F999",
    ok: true
  }
]
```

[Docs](../readme.md)
