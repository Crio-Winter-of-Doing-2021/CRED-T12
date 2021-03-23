import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import SingleCard from './SingleCard';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import CardContext from '../../context/card/cardContext';

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
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const cardContext = useContext(CardContext);

  const { setAlert } = alertContext;
  const { isAuthenticated } = authContext;
  const { getAllCards, allCards, error, clearErrors, loading } = cardContext;

  useEffect(() => {
    getAllCards();
    // eslint-disable-next-line
  }, []);

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2}>
          {allCards && allCards.map((value) => (
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
