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

type EcommerceType = {
  order_id: number | string
  currency: string
  revenue: number | string
  total: number | string
  value: number | string
  quantity: number | string
  products: Product[] | null
  checkout_id: number | string
  affiliation: string
  shipping: number | string
  tax: number | string
  discount: number | string
  coupon: string
  creative: string
  query: string
  step: number | string
  payment_type: string
}

export type Product = {
  product_id: number | string
  sku: number | string
  name: string
  category: string
  brand: string
  price: number | string
  quantity: number
  variant: string
  currency: string
  value: number | string
  position: number | string
  coupon: number | string
}
const eventMappings: { [key: string]: string } = {
  'Product Added': 'addtocart',
  'Order Completed': 'checkout',
  'Products Searched': 'search',
}
function mapEcommerceEvent(eventName: string): string | undefined {
  return eventMappings[eventName] || undefined
}
function mapEcommerceData(
  ecommerce: EcommerceType
): Record<string, string | number> | null {
  const transformedProductData: Record<string, string | number> = {}
  if (!ecommerce || !ecommerce.products) {
    return null
  } else {
    ecommerce.products.forEach((product, index) =>
      [
        'product_id',
        'sku',
        'category',
        'name',
        'brand',
        'variant',
        'price',
      ].forEach(prop => {
        const key = `product_${prop}[${index}]`
        transformedProductData[key] =
          product[prop as keyof Product] || product.sku
      })
    )
  }

  const ecommerceData = {
    order_id: ecommerce.order_id,
    currency: ecommerce.currency,
    value: ecommerce.revenue || ecommerce.total || ecommerce.value,
    order_quantity: ecommerce.quantity,
    ...transformedProductData,
  }
  return ecommerceData
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

  const { pdem, tid, ecommerce, ...cleanPayload } = payload

  // pd - partner data
  if (pdem) {
    requestBody['pd[em]'] = pdem
  }

  requestBody['pd[tm]'] = payload.tm || 'pinterest-mc'

  // match  event types to Pinterest's default

  const ecommerceData = mapEcommerceData(ecommerce)
  for (const key in ecommerceData) {
    cleanPayload[key] = ecommerceData[key]
  }

  if (Object.keys(cleanPayload).length) {
    // event data is created, note that it also holds the ecommerce parameters
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
  event: MCEvent,
  settings: ComponentSettings,
  ev: string,
  customSendRequest = sendRequest
) => {
  const eventType = event.payload.ude || ev // ude is the "user defined event" field in case of eventType ='user-defined-event'
  const requestBody = getRequestBody(eventType, event, settings)
  const requestUrl = getRequestUrl(requestBody)
  customSendRequest(requestUrl, event)
}

export default async function (manager: Manager, settings: ComponentSettings) {
  const events = [
    'pageview',
    'lead',
    'signup',
    'watchvideo',
    'viewcategory',
    'custom',
    'addtocart',
    'checkout',
    'search',
    'user-defined-event',
  ]
  events.forEach(ev => {
    manager.addEventListener(ev, event => {
      handler(event, settings, ev)
    })
  })

  manager.addEventListener('ecommerce', event => {
    if (typeof event.name === 'string') {
      const ev = mapEcommerceEvent(event.name)
      if (ev) {
        handler(event, settings, ev)
      }
    }
  })
}
