import { Show } from 'solid-js'
import { usePuzzle } from '../providers/puzzle.js'

export function SimpleVariantButton (props) {
  const { getRule, setRule } = usePuzzle()
  return (
        <button
           classList={{ 'toggle-on': getRule(props.rule), 'toggle-off': !getRule(props.rule) }}
           onClick={() => setRule(props.rule, r => !r || undefined)}
        >{props.children}</button>
  )
}

export function makeSimpleVariant (key, settingLabel, RenderComponent) {
  return {
    key,
    load (ruleString) {
      return true
    },
    extract (rule) {
      return key
    },
    Render (props) {
      const { isRule, getRule } = usePuzzle()
      return (
          <Show when={RenderComponent && isRule(key)}>
            <RenderComponent rule={getRule(key)}/>
          </Show>
      )
    },
    Settings (props) {
      return <SimpleVariantButton rule={key}>{settingLabel}</SimpleVariantButton>
    }
  }
}
