# Api Design

CRUD
Read (collection with filtering)
    Read the entire collection of events, with optional filtering
    GET /api/events none none 200 json
Read (Document) GET
    read one event document
    GET /api/events/:id none none 200 json
Create (Document)
    create an event document
    POST /api/events none json 201 json
Update (repalce)
    replace a current event document with a new or updated one
    PUT /api/events/:id none json 200 json
Update (update)
    update a couple of values on an existing document
    PATCH /api/events/:id none json 200 json
Delete (document)
    delete an event from the events collection
    DELETE /api/events/:id none none 204 none

Action
post (RSVP)
    RSVP to an event and change the attendee count
    POST /api/events/:id/rsvp none none 200 json
post (UnRSVP)
    Remove the rsvp for an event and the given user
    POST /api/events/:id/unrsvp none none 200 json

The AIs original response was a little off from the in class practices and my instrcutions but the general understadnong and core ideas were spot on. The AI seemed to say {id} instead of :id but I did not give an example to guide it. The request body and response body were given as example json files instead of what I instructed as just being either json or none. This was fine it was just more detail than requested, and the http methods were spot on in addition to the status codes.

When implimenting the read endpoints, it have some results that included try excpet statemnts and it wanted to throw 500 errors if unsucessful so I changed that to remove it. With the corrected code and a bette rprompt from me, the delete fucntion was surprisingly perfect from the AI so I did not need to change anything. I told it to copy my style of coding with the context of the previous two editied functons and it did it!

