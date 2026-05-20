import type { OutlierforgeSelection } from '../util/outlierforge-catalog'

import { renderOutlierforgeSvg } from '../util/outlierforge-art'

export function OutlierforgePreview({ selection }: { selection: OutlierforgeSelection }) {
  return (
    <div className="of-panel of-preview">
      <div className="of-art" dangerouslySetInnerHTML={{ __html: renderOutlierforgeSvg(selection) }} />
    </div>
  )
}
