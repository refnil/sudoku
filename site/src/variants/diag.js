import { makeSimpleVariant } from './simple.js'

const rule = 'Number on a shown diagonal cannot be repeated on that diagonal.'

export const DiagPos = makeSimpleVariant('diag_pos', 'Diagonal +', rule, () => <line x1="0" y1="900" x2="900" y2="0" stroke="gray" stroke-width="6" />)
export const DiagNeg = makeSimpleVariant('diag_neg', 'Diagonal -', rule, () => <line x1="0" y1="0" x2="900" y2="900" stroke="gray" stroke-width="6" />)
