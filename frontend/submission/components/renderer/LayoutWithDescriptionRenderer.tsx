import type {JsonFormsState, UISchemaElement} from '@jsonforms/core'
import {
  composeWithUi,
  ControlElement,
  getAjv, getData,
  getI18nKey, getSchema,
getTranslator, hasShowRule, isVisible,
JsonFormsCellRendererRegistryEntry,   JsonFormsRendererRegistryEntry,
  JsonSchema,
  OwnPropsOfRenderer,Resolve} from '@jsonforms/core'
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react'
import {FormHelperText, Grid, Hidden} from '@mui/material'
import Ajv from 'ajv'
import isEmpty from 'lodash/isEmpty'
import React, { ComponentType } from 'react'

export const renderLayoutElements = (
  state: JsonFormsState,
  elements: UISchemaElement[],
  schema: JsonSchema,
  path: string,
  enabled: boolean,
  renderers?: JsonFormsRendererRegistryEntry[],
  cells?: JsonFormsCellRendererRegistryEntry[],
) => {
  const translator = getTranslator()(state)
  const rootSchema = getSchema(state)
  const rootData = getData(state)
  return elements.map((child, index) => {
    const controlElement = child as ControlElement
    const resolvedSchema = Resolve.schema(
      schema || rootSchema,
      controlElement.scope,
      rootSchema
    )
    const childPath = composeWithUi(controlElement, path)
    const description =
      resolvedSchema !== undefined ? resolvedSchema.description : ''
    const i18nKey = getI18nKey(resolvedSchema, child, childPath, 'description')
    // @ts-ignore
    const i18nDescription = translator(i18nKey, description)
    const visible: boolean = hasShowRule(child)
        ? isVisible(child, rootData, childPath, getAjv(state)) : true
    return (
      <Grid item key={`${path}-${index}`} xs>
        <Grid container direction={'column'}>
          <Hidden xsUp={!visible}>
          <Grid item xs>
            <FormHelperText>{i18nDescription}</FormHelperText>
          </Grid>
          </Hidden>
          <Grid item xs>
            <JsonFormsDispatch
              uischema={child}
              schema={schema}
              path={path}
              enabled={enabled}
              renderers={renderers}
              cells={cells}
            />
          </Grid>
        </Grid>
      </Grid>
    )
  })
}

export interface MaterialLayoutRendererProps extends OwnPropsOfRenderer {
  elements: UISchemaElement[];
  direction: 'row' | 'column';
}
const MaterialLayoutRendererComponent =
  (props: MaterialLayoutRendererProps) => {
  const {
      visible,
        elements,
        schema,
        path,
        enabled,
        direction,
        renderers,
        cells
    } = props
    const ctx = useJsonForms()
    const state = { jsonforms: ctx}
    if (isEmpty(elements)) {
      return null
    } else {
      return (
        <Hidden xsUp={!visible}>
          <Grid
            container
            direction={direction}
            spacing={direction === 'row' ? 2 : 0}
          >
            {
              renderLayoutElements(
              state,
              elements,
              //@ts-ignore
              schema,
              path,
              enabled,
              renderers,
              cells,
            )}
          </Grid>
        </Hidden>
      )
    }
  }
export const LayoutWithDescriptionRenderer = React.memo(MaterialLayoutRendererComponent)

export interface AjvProps {
  ajv: Ajv.Ajv;
}

export const withAjvProps = <P extends {}>(Component: ComponentType<AjvProps & P>) =>
  (props: P) => {
    const ctx = useJsonForms()
    const ajv = getAjv({jsonforms: {...ctx}})

    // @ts-ignore
    return (<Component {...props} ajv={ajv} />)
  }
