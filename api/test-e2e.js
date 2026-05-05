/**
 * E2E integration test — runs compiled handlers against live Upstash Redis.
 * No Functions runtime needed; uses real @azure/functions SDK objects.
 */
'use strict'

const { HttpRequest, InvocationContext } = require('@azure/functions')
const { createMessage } = require('./dist/functions/createMessage')
const { getMessage } = require('./dist/functions/getMessage')

let passed = 0
let failed = 0

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}`)
    passed++
  } else {
    console.error(`  ✗ ${label}${detail ? ': ' + detail : ''}`)
    failed++
  }
}

function makePost(body) {
  return new HttpRequest({
    method: 'POST',
    url: 'http://localhost/api/messages',
    headers: { 'content-type': 'application/json' },
    body: { string: JSON.stringify(body) },
  })
}

function makeGet(id) {
  return new HttpRequest({
    method: 'GET',
    url: `http://localhost/api/messages/${id}`,
    params: { id },
  })
}

function ctx() {
  return new InvocationContext({ functionName: 'test' })
}

async function run() {
  // ── Journey A: view-once ─────────────────────────────────────────────────
  console.log('\nJourney A — view-once message')

  const resA1 = await createMessage(makePost({ content: 'hello e2e', ttl: 'view-once' }), ctx())
  assert('POST 201', resA1.status === 201, `got ${resA1.status}`)
  const { id: idA } = resA1.jsonBody
  assert('id returned', typeof idA === 'string' && idA.length > 0)

  const resA2 = await getMessage(makeGet(idA), ctx())
  assert('GET 200', resA2.status === 200, `got ${resA2.status}`)
  assert('content matches', resA2.jsonBody.content === 'hello e2e', resA2.jsonBody.content)
  assert('burnedAt present', typeof resA2.jsonBody.burnedAt === 'string')

  const resA3 = await getMessage(makeGet(idA), ctx())
  assert('2nd GET 404 (burned)', resA3.status === 404, `got ${resA3.status}`)
  assert('code NOT_FOUND', resA3.jsonBody.code === 'NOT_FOUND', resA3.jsonBody.code)

  // ── Journey B: 1h message ────────────────────────────────────────────────
  console.log('\nJourney B — 1h message')

  const resB1 = await createMessage(makePost({ content: 'timed test', ttl: '1h' }), ctx())
  assert('POST 201', resB1.status === 201, `got ${resB1.status}`)
  const { id: idB, expiresAt } = resB1.jsonBody
  const expiresIn = new Date(expiresAt).getTime() - Date.now()
  assert('expiresAt ~1h from now', expiresIn > 3_500_000 && expiresIn < 3_700_000, `${expiresIn}ms`)

  const resB2 = await getMessage(makeGet(idB), ctx())
  assert('1st GET 200', resB2.status === 200, `got ${resB2.status}`)
  assert('content matches', resB2.jsonBody.content === 'timed test')

  const resB3 = await getMessage(makeGet(idB), ctx())
  assert('2nd GET still 200 (not burned)', resB3.status === 200, `got ${resB3.status}`)
  assert('content still present', resB3.jsonBody.content === 'timed test')

  // ── Journey C: validation ────────────────────────────────────────────────
  console.log('\nJourney C — validation')

  const resC1 = await createMessage(makePost({ content: '', ttl: 'view-once' }), ctx())
  assert('empty content → 400', resC1.status === 400, `got ${resC1.status}`)

  const resC2 = await createMessage(makePost({ content: 'hi', ttl: 'bad-ttl' }), ctx())
  assert('invalid ttl → 400', resC2.status === 400, `got ${resC2.status}`)

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log(`\n${passed + failed} assertions: ${passed} passed, ${failed} failed`)
  if (failed > 0) process.exit(1)
}

run().catch((err) => {
  console.error('\nUnhandled error:', err)
  process.exit(1)
})
