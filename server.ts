import { renderOutlierforgeSvg } from './src/outlierforge/util/outlierforge-art'
import {
  defaultOutlierforgeSelection,
  type OutlierforgeSelection,
  outlierforgeTraits,
} from './src/outlierforge/util/outlierforge-catalog'
import {
  createOutlierforgeMetadata,
  parseOutlierforgeSelectionSlug,
} from './src/outlierforge/util/outlierforge-metadata'

const port = Number(process.env.PORT ?? 3000)
const distRoot = new URL('./dist/', import.meta.url)

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, {
    headers: { 'cache-control': 'no-store', ...init?.headers },
    status: init?.status,
  })
}

function publicOrigin(request: Request) {
  const url = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost ?? request.headers.get('host') ?? url.host
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const protocol = forwardedProto === 'http' ? 'http' : 'https'

  return `${protocol}://${host}`
}

function safeSelection(slug: string): OutlierforgeSelection {
  const parsed = parseOutlierforgeSelectionSlug(slug)

  return {
    armor: outlierforgeTraits.armor.some((trait) => trait.id === parsed.armor)
      ? parsed.armor
      : defaultOutlierforgeSelection.armor,
    body: outlierforgeTraits.body.some((trait) => trait.id === parsed.body)
      ? parsed.body
      : defaultOutlierforgeSelection.body,
    companion: outlierforgeTraits.companion.some((trait) => trait.id === parsed.companion)
      ? parsed.companion
      : defaultOutlierforgeSelection.companion,
    headgear: outlierforgeTraits.headgear.some((trait) => trait.id === parsed.headgear)
      ? parsed.headgear
      : defaultOutlierforgeSelection.headgear,
    weapon: outlierforgeTraits.weapon.some((trait) => trait.id === parsed.weapon)
      ? parsed.weapon
      : defaultOutlierforgeSelection.weapon,
  }
}

async function serveStatic(pathname: string) {
  const filePath = pathname === '/' ? 'index.html' : pathname.slice(1)
  const file = Bun.file(new URL(filePath, distRoot))

  if (await file.exists()) {
    return new Response(file)
  }

  return new Response(Bun.file(new URL('index.html', distRoot)))
}

Bun.serve({
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return json({ ok: true, project: 'OutlierForge 090' })
    }

    if (url.pathname === '/api/bootstrap') {
      return json({ defaultSelection: defaultOutlierforgeSelection, traits: outlierforgeTraits })
    }

    const metadataMatch = url.pathname.match(/^\/metadata\/(.+)\.json$/)
    if (metadataMatch?.[1]) {
      const selection = safeSelection(metadataMatch[1])
      return json(createOutlierforgeMetadata({ domain: publicOrigin(request), selection }))
    }

    const imageMatch = url.pathname.match(/^\/metadata\/(.+)\.svg$/)
    if (imageMatch?.[1]) {
      return new Response(renderOutlierforgeSvg(safeSelection(imageMatch[1])), {
        headers: { 'cache-control': 'public, max-age=300', 'content-type': 'image/svg+xml; charset=utf-8' },
      })
    }

    return serveStatic(url.pathname)
  },
  port,
})

console.log(`OutlierForge 090 server listening on ${port}`)
