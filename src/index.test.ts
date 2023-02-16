import { ComponentSettings, MCEvent } from '@managed-components/types'
import pinterest, {
  AutomaticDataType,
  getRequestBody,
  getRequestUrl,
  handler,
  RequestBodyType,
} from '.'

type MockMCEventType = {}

describe('Pinterest MC sends correct request', () => {
  const baseHostname = '127.0.0.1'
  const port = '1337'
  const baseHost = `${baseHostname}:${port}`
  const baseOrigin = `https://${baseHost}`
  const baseHref = `${baseOrigin}/`
  const searchParams = new URLSearchParams()

  const mockEvent = new Event('pagevisit', {}) as MCEvent
  mockEvent.name = 'Pinterest Test'
  mockEvent.payload = { timestamp: 1670409810, event: 'pagevisit', tid: 'xyz' }
  mockEvent.client = {
    url: {
      href: baseHref,
      origin: baseOrigin,
      protocol: 'http:',
      username: '',
      password: '',
      host: baseHost,
      hostname: baseHostname,
      port: port,
      pathname: '/',
      search: '',
      searchParams: searchParams,
      hash: '',
    },
    title: 'Zaraz "Test" /t Page',
    timestamp: 1670409810,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
    language: 'en-GB',
    referer: `${baseOrigin}/somewhere-else.html`,
    ip: baseHostname,
    emitter: 'browser',
  }

  const settings: ComponentSettings = {}

  const time = new Date().valueOf().toString()
  const ad: AutomaticDataType = {
    loc: baseHref,
    ref: `${baseOrigin}/somewhere-else.html`,
    if: false,
    mh: '2424edb5',
  }

  it('returns correctly constructed requestBodyObject', () => {
    const expectedRequestBody: RequestBodyType = {
      ad: JSON.stringify(ad),
      cb: time,
      tid: 'xyz',
      event: 'pagevisit',
      'pd[tm]': 'pinterest-mc',
      ed: JSON.stringify({
        timestamp: 1670409810,
        event: 'pagevisit',
      }),
    }

    const requestBody = getRequestBody('pagevisit', mockEvent, settings)

    expect(requestBody.ad).toEqual(expectedRequestBody.ad)
    expect(requestBody.event).toEqual(expectedRequestBody.event)
    expect(requestBody.tid).toEqual(expectedRequestBody.tid)
    expect(requestBody['pd[tm]']).toEqual('pinterest-mc')
  })

  it('returns correct url to send to', () => {
    const rawRequestBody = {
      ad: '{"loc":"https://127.0.0.1:1337/","ref":"https://127.0.0.1:1337/somewhere-else.html","if":false,"mh":"2424edb5"}',
      cb: '1671006315874',
      tid: 'xyz',
      event: 'pagevisit',
      'pd[tm]': 'pinterest-mc',
      ed: '{"timestamp":1670409810,"event":"pagevisit"}',
    }
    const requestUrl = getRequestUrl(rawRequestBody, mockEvent, settings)
    const requestUrlDecoded = decodeURI(requestUrl)

    const expectedUrl = `https://ct.pinterest.com/v3/?ad={"loc"%3A"https%3A%2F%2F127.0.0.1%3A1337%2F"%2C"ref"%3A"https%3A%2F%2F127.0.0.1%3A1337%2Fsomewhere-else.html"%2C"if"%3Afalse%2C"mh"%3A"2424edb5"}&cb=1671006315874&tid=xyz&event=pagevisit&pd[tm]=pinterest-mc&ed={"timestamp"%3A1670409810%2C"event"%3A"pagevisit"}`

    expect(requestUrlDecoded).toEqual(expectedUrl)
  })

  it('Handler invokes fetch correctly', () => {
    const arr = []
    handler('pageview', mockEvent, settings, (...args) => {
      arr.push(args)
    })
    expect(arr.length).toBe(1)
  })
})
