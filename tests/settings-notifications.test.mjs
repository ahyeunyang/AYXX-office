import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { EventEmitter } from 'node:events'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { buildNotification, registerNotifications } from '../electron/notifications.js'

const source = ts.transpileModule(readFileSync(new URL('../src/data/settings.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
const sandbox = { exports: {}, localStorage: { getItem: () => { throw Error('Storage unavailable') } } }
vm.runInNewContext(source, sandbox)
const { parseSettings, loadSettings, makeNotification } = sandbox.exports
const message = { category: 'notices', id: 'notice-1', title: 'New notice', body: 'Private contents\nwith details' }

test('settings recover independently from corrupt, missing, and unavailable storage', () => {
  for (const raw of [null, 'invalid', 'null', '[]', '{"theme":"unknown"}']) assert.equal(parseSettings(raw).theme, 'light')
  assert.equal(parseSettings('{"theme":"dark"}').theme, 'dark')
  const settings = parseSettings(JSON.stringify({ theme: 'light', notifications: { calendar: 'off', notices: 'simple', messenger: 'invalid' } }))
  assert.equal(settings.theme, 'light')
  assert.equal(settings.notifications.calendar, 'off')
  assert.equal(settings.notifications.notices, 'simple')
  assert.equal(settings.notifications.messenger, 'detail')
  assert.equal(loadSettings().theme, 'light')
  settings.notifications.calendar = 'detail'
  assert.equal(parseSettings(null).notifications.calendar, 'detail')
})

test('each category independently supports off, title only, and bounded detail', () => {
  for (const category of ['calendar', 'notices', 'messenger']) {
    const settings = parseSettings(null)
    settings.notifications[category] = 'off'
    assert.equal(makeNotification({ ...message, category }, settings), null)
    settings.notifications[category] = 'simple'
    assert.equal(makeNotification({ ...message, category }, settings).body, '')
    settings.notifications[category] = 'detail'
    assert.equal(makeNotification({ ...message, category, body: ' A\n B ' }, settings).body, 'A B')
    assert.equal(makeNotification({ ...message, category, body: 'X'.repeat(500) }, settings).body.length, 121)
  }
})

test('main process independently removes body in title-only mode and rejects invalid payloads', () => {
  assert.equal(buildNotification({ ...message, mode: 'simple' }).body, '')
  assert.equal(buildNotification({ ...message, mode: 'off' }), null)
  for (const payload of [null, {}, { ...message, mode: 'invalid' }, { ...message, mode: 'detail', category: 'unknown' }, { ...message, mode: 'detail', title: ' ' }]) assert.equal(buildNotification(payload), null)
})

function fixture({ supported = true, failed = false } = {}) {
  let handler, last, restored = false, focused = false, target
  const frame = {}
  const win = { webContents: { mainFrame: frame, send: (_name, data) => { target = data } }, isDestroyed: () => false, isMinimized: () => true, restore: () => { restored = true }, show: () => {}, focus: () => { focused = true } }
  class FakeNotification extends EventEmitter {
    static isSupported() { return supported }
    constructor(options) { super(); this.options = options; last = this }
    show() { this.emit(failed ? 'failed' : 'show') }
    close() { this.emit('close') }
  }
  registerNotifications({ ipcMain: { handle: (_name, callback) => { handler = callback } }, BrowserWindow: { fromWebContents: () => win }, Notification: FakeNotification })
  return { send: (payload, trusted = true) => handler({ sender: {}, senderFrame: trusted ? frame : {} }, payload), get notification() { return last }, get restored() { return restored }, get focused() { return focused }, get target() { return target } }
}

test('native notification click restores the window and opens the matching notice', async () => {
  const native = fixture()
  assert.equal((await native.send({ ...message, mode: 'simple' })).status, 'shown')
  assert.equal(native.notification.options.body, '')
  native.notification.emit('click')
  assert.equal(native.restored, true)
  assert.equal(native.focused, true)
  assert.deepEqual(native.target, { category: 'notices', id: 'notice-1' })
})

test('disabled and untrusted calls do not create notifications; unsupported and failed delivery are reported', async () => {
  const native = fixture()
  assert.equal((await native.send({ ...message, mode: 'off' })).status, 'disabled')
  assert.equal((await native.send({ ...message, mode: 'detail' }, false)).status, 'failed')
  assert.equal(native.notification, undefined)
  assert.equal((await fixture({ supported: false }).send({ ...message, mode: 'detail' })).status, 'unsupported')
  assert.equal((await fixture({ failed: true }).send({ ...message, mode: 'detail' })).status, 'failed')
})
