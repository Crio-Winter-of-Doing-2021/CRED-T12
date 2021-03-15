import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import SingleCard from './SingleCard';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

const AllCards = props => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((value) => (
            <Grid key={value} item>
              <SingleCard />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AllCards;
