import {
  ArrayLayoutProps,
  composeWithUi,
  getData,
  getTranslator,
  OwnPropsOfControl,
  Resolve,
  Translator
} from '@jsonforms/core'
import {
  ctxDispatchToArrayControlProps,
  ctxToArrayLayoutProps,
  JsonFormsStateContext,
  withJsonFormsContext
} from '@jsonforms/react'
import React, {ComponentType} from 'react'

type ArrayDataProp = {
  translator?: Translator,
  arrayData: any[]
}
export type CustomArrayLayoutProps = ArrayLayoutProps & ArrayDataProp

const withContextToArrayLayoutProps =
  (Component: ComponentType<CustomArrayLayoutProps>): ComponentType<CustomArrayLayoutProps> =>
    ({ctx, props}: JsonFormsStateContext & ArrayLayoutProps) => {
      const arrayLayoutProps = ctxToArrayLayoutProps(ctx, props)
      const rootData = getData({jsonforms: ctx})
      const translator = getTranslator()(ctx)
      const path = composeWithUi(props.uischema, props.path)
      const data = Resolve.data(rootData, path)
      const dispatchProps = ctxDispatchToArrayControlProps(ctx.dispatch)
      return (<Component {...arrayLayoutProps} {...dispatchProps} arrayData={data} translator={translator}/>)
    }

export const withJsonFormsArrayLayoutProps =
  (Component: ComponentType<CustomArrayLayoutProps>, memoize = true): ComponentType<OwnPropsOfControl> =>
    withJsonFormsContext(
      withContextToArrayLayoutProps(memoize ? React.memo(Component) : Component))
