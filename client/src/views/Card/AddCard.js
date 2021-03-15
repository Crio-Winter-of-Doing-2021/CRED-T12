import React, { useState, useContext, useEffect } from 'react';
import Cards from 'react-credit-cards';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import 'react-credit-cards/es/styles-compiled.css';

import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const AddCard = props => {
  const classes = useStyles();
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { setAlert } = alertContext;
  const { register, error, clearErrors, isAuthenticated, loading } = authContext;

  const [cardDetails, setCardDetails] = useState({
    cvc: '',
    expiry: '',
    name: '',
    number: '',
    focus: '',
  });

  const { cvc, expiry, name, number, focus } = cardDetails;

  const onChange = e => setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  const handleInputFocus = (e) => setCardDetails({ ...cardDetails, focus: e.target.name });

  const onSubmit = e => {
    e.preventDefault();
    if (cvc.trim() === '' || expiry.trim() === '' || name.trim() === '' || number.trim() === '') {
      setAlert('Please enter all fields', 'error');
    } else {
      console.log(cvc.trim(), expiry.trim(), name.trim(), number.trim());
      // register({
      //   username,
      //   email,
      //   password
      // });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div id="PaymentForm" className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Add Card
        </Typography>
        <Cards
          cvc={cvc}
          expiry={expiry}
          focused={focus}
          name={name}
          number={number}
        />
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="tel"
                name="number"
                placeholder="Card Number"
                variant="outlined"
                required
                fullWidth
                id="number"
                label="Card Number"
                autoFocus
                value={number}
                onChange={onChange}
                onFocus={handleInputFocus}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                name="name"
                placeholder="Name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                value={name}
                onChange={onChange}
                onFocus={handleInputFocus}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                name="expiry"
                placeholder="MM/YY Expiry"
                variant="outlined"
                required
                fullWidth
                id="expiry"
                label="Expiry"
                value={expiry}
                onChange={onChange}
                onFocus={handleInputFocus}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="tel"
                name="cvc"
                placeholder="CVC"
                variant="outlined"
                required
                fullWidth
                id="cvc"
                label="CVC"
                value={cvc}
                onChange={onChange}
                onFocus={handleInputFocus}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default AddCard;
