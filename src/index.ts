import { ComponentSettings, Manager, MCEvent } from '@managed-components/types'

export type AutomaticDataType = {
  loc: string
  ref: string
  if: boolean
  noscript?: number
  sh?: string
  sw?: string
  mh?: string
}

export type RequestBodyType = {
  ad: string
  cb: string
  tid: string
  event: string
  'pd[em]'?: string
  'pd[tm]'?: string
  ed?: string
}

export const getRequestBody = (
  eventType: string,
  event: MCEvent,
  settings: ComponentSettings
) => {
  const { client, payload } = event

  const automaticData: AutomaticDataType = {
    loc: client.url.href,
    ref: client.referer,
    if: false, // TODO: add an iframe check?
    // noscript=1 // not sure if we should announce this?
    sh: client.screenHeight?.toString(),
    sw: client.screenWidth?.toString(),
    mh: '2424edb5', // this seems to be a hardocded Pinterest version, perhaps a git commit?
  }

  const requestBody: RequestBodyType = {
    ad: JSON.stringify(automaticData),
    cb: new Date().valueOf().toString(),
    tid: payload.tid || settings.tid,
    event: eventType,
  }

  const { 'pd[em]': pdem, tid, ...cleanPayload } = payload

  // pd - partner data
  if (pdem) {
    requestBody['pd[em]'] = pdem
  }

  requestBody['pd[tm]'] = payload.tm || 'pinterest-mc'

  if (Object.keys(cleanPayload).length) {
    // event data
    requestBody['ed'] = JSON.stringify(cleanPayload)
  }

  return requestBody
}

export const getRequestUrl = (requestBody: RequestBodyType): string => {
  const queryParams = new URLSearchParams(requestBody).toString()
  return `https://ct.pinterest.com/v3/?${queryParams}`
}

export const sendRequest = (url: string, event: MCEvent) => {
  event.client.fetch(url, {
    mode: 'no-cors',
    keepalive: true,
    credentials: 'include',
  })
}

export const handler = (
  eventType: string,
  event: MCEvent,
  settings: ComponentSettings,
  customSendRequest = sendRequest
) => {
  const requestBody = getRequestBody(eventType, event, settings)
  const requestUrl = getRequestUrl(requestBody)
  customSendRequest(requestUrl, event)
}

export default async function (manager: Manager, settings: ComponentSettings) {
  manager.addEventListener('pageview', event => {
    handler('pagevisit', event, settings)
  })

  manager.addEventListener('addtocart', event => {
    handler('addtocart', event, settings)
  })

  manager.addEventListener('checkout', event => {
    handler('checkout', event, settings)
  })

  manager.addEventListener('lead', event => {
    handler('lead', event, settings)
  })

  manager.addEventListener('signup', event => {
    handler('signup', event, settings)
  })

  manager.addEventListener('viewcategory', event => {
    handler('viewcategory', event, settings)
  })
  manager.addEventListener('watchvideo', event => {
    handler('watchVideo', event, settings)
  })

  manager.addEventListener('custom', event => {
    handler('custom', event, settings)
  })

  manager.addEventListener('search', event => {
    handler('search', event, settings)
  })

  manager.addEventListener('userdefinedevent', event => {
    const userDefinedEvent: string = event.payload.userDefinedEvent
    handler(userDefinedEvent, event, settings)
  })
}
