import AddIcon from '@mui/icons-material/Add'
import {
  Grid,
  Hidden,
  IconButton,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import * as React from 'react'

import ValidationIcon from './ValidationIcon'

export interface ArrayLayoutToolbarProps {
  label: string;
  errors: string;
  path: string;
  addItem(path: string, data: any): () => void;
  createDefault(): any;
}
export const ArrayLayoutToolbar = React.memo(
  ({
    label,
    errors,
    addItem,
    path,
    createDefault
  }: ArrayLayoutToolbarProps) => {
    return (
      <Toolbar disableGutters={true}>
        <Grid container alignItems='center' justifyContent='space-between'>
          <Grid item>
            <Typography variant={'h6'}>{label}</Typography>
          </Grid>
          <Hidden xsUp={errors.length === 0}>
            <Grid item>
              <ValidationIcon id='tooltip-validation' errorMessages={errors} />
            </Grid>
          </Hidden>
          <Grid item>
            <Grid container>
              <Grid item>
                <Tooltip
                  id='tooltip-add'
                  title={`Add to ${label}`}
                  placement='bottom'
                >
                  <IconButton
                    aria-label={`Add to ${label}`}
                    onClick={addItem(path, createDefault())}
                    size='large'>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    )
  }
)

