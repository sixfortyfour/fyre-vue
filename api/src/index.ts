import { app } from '@azure/functions'
import { createMessage } from './functions/createMessage'
import { getMessage } from './functions/getMessage'

app.http('createMessage', {
  methods: ['POST'],
  route: 'messages',
  authLevel: 'anonymous',
  handler: createMessage,
})

app.http('getMessage', {
  methods: ['GET'],
  route: 'messages/{id}',
  authLevel: 'anonymous',
  handler: getMessage,
})
