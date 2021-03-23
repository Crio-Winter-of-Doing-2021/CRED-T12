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

  const data = [
    {
      bank: "visa",
      cvc: "232",
      expiaryDate: {
      month: "12",
      year: "23"
      },
      name: "Ashwani Yadav",
      number: "4324324354546456"
    },
    {
      bank: "visa",
      cvc: "232",
      expiaryDate: {
      month: "12",
      year: "23"
      },
      name: "Ashwani Yadav",
      number: "5324324354546456"
    },
    {
      bank: "visa",
      cvc: "232",
      expiaryDate: {
      month: "12",
      year: "23"
      },
      name: "Ashwani Yadav",
      number: "6024324354546456"
    }
  ]

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2}>
          {data.map((value) => (
            <Grid key={value.number} item>
              <SingleCard data={value} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AllCards;
