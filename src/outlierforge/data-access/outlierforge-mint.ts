import type { Address, TransactionSigner } from '@solana/kit'

import { getCreateV1Instruction } from '@obrera/mpl-core-kit-lib/generated'

import type { OutlierforgeMetadata } from '../util/outlierforge-metadata'

export function getOutlierforgeCreateInstruction({
  asset,
  metadata,
  owner,
  payer,
}: {
  asset: TransactionSigner
  metadata: OutlierforgeMetadata
  owner?: Address
  payer: TransactionSigner
}) {
  return getCreateV1Instruction({
    asset,
    authority: payer,
    name: metadata.name,
    owner: owner ?? payer.address,
    payer,
    updateAuthority: payer.address,
    uri: metadata.uri,
  })
}
