/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import {ControlElement, JsonSchema} from '@jsonforms/core'
import {withJsonFormsContext} from '@jsonforms/react'
import DeleteIcon from '@mui/icons-material/Delete'
import {
    Avatar,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText
} from '@mui/material'
import React from 'react'

import {withContextToMasterListItemProps} from './withContextToMasterListItem'

export interface OwnPropsOfMasterListItem {
    index: number;
    selected: boolean;
    path: string;
    schema: JsonSchema;
    uischema: ControlElement;
    handleSelect(index: number): () => void;
    removeItem(path: string, value: number): () => void;
}
export interface StatePropsOfMasterItem extends OwnPropsOfMasterListItem {
    childLabel: string;
}

const ListWithDetailMasterItem = ({ index, childLabel, selected, handleSelect, removeItem, path }: StatePropsOfMasterItem) => {

    return (
        <ListItem
            button
            selected={selected}
            onClick={handleSelect(index)}
        >
            <ListItemAvatar>
                <Avatar aria-label='Index'>{index + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={childLabel} style={{overflow: 'hidden', textOverflow: 'ellipsis'}} />
            <ListItemSecondaryAction>
                <IconButton aria-label='Delete' onClick={removeItem(path, index)} size='large'>
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default withJsonFormsContext(
  withContextToMasterListItemProps(ListWithDetailMasterItem))
