import React, { useState, useContext, useEffect, useMemo } from 'react';
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
import CardContext from '../../context/card/cardContext';

const supportedCards = {
  '506699': 'Elo',
  '6011': 'Discover',
  '37': 'american express',
  '36': 'Diners Club International',
  '55': 'mastercard',
  '60': 'Hipercard',
  '62': 'Union Pay',
  '4': 'visa',
};


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
  const cardContext = useContext(CardContext);

  const { setAlert } = alertContext;
  const { isAuthenticated } = authContext;
  const { addCard, error, clearErrors, loading } = cardContext;

	const numberRegExp = useMemo(() => /^[1-9]{1}[0-9]{15}$/, []);
  const expiryRegExp = useMemo(() => /^[0-9]{2}\/[0-9]{2}$/, []);

  const [cvc, setCvc] = useState('');
  const [expiry, setExpiry] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [focus, setFocus] = useState('');
  const [isNumberValid, validateNumber] = useState(true);
  const [isExpiryValid, validateExpiry] = useState(true);

  const isSubmitDisabled = !cvc.trim() || !expiry.trim() || !name.trim() || !number.trim() || !isNumberValid || !isExpiryValid;

  useEffect(() => {
		validateNumber(number && numberRegExp.test(number));
	}, [number, numberRegExp]);

  useEffect(() => {
		validateExpiry(expiry && expiryRegExp.test(expiry));
	}, [expiry, expiryRegExp]);

  const onSubmit = e => {
    e.preventDefault();
    if (!isNumberValid) {
      setAlert('Please enter correct card number', 'error');
			return;
		}
    if (!isExpiryValid) {
      setAlert('Please enter correct expiry format MM/YY', 'error');
			return;
		}
    if (isSubmitDisabled) {
      setAlert('Please enter all fields', 'error');
			return;
		}
    const data = {
      cvc: cvc,
      number: number,
      name: name.trim(),
      expiaryDate: {
        month : expiry.substring(0, 2),
        year: expiry.substring(3, 5)
      },
    }
    let flag = 0;
    for(let key in supportedCards){
      if(number.startsWith(key)) {
        data.bank = supportedCards[key];
        flag = 1;
        break;
      }
    }
    if(flag === 0) {
      data.bank = 'Other';
    }
    console.log(data);
    addCard(data);
  };

  const onNumberChange = e => {
    e.preventDefault();
    let value = e.target.value.trim();
    if(value.length > 16) return;
    setNumber(value);
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
                type="number"
                name="number"
                placeholder="XXXX XXXX XXXX XXXX"
                variant="outlined"
                required
                fullWidth
                id="number"
                label="Card Number"
                autoFocus
                value={number}
                onChange={onNumberChange}
                onFocus={({ currentTarget: { value } }) => setFocus('number')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                name="name"
                placeholder="Card Holder Name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                value={name}
                onChange={({ currentTarget: { value } }) => setName(value)}
                onFocus={({ currentTarget: { value } }) => setFocus('name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                onChange={({ currentTarget: { value } }) => setExpiry(value.trim())}
                onFocus={({ currentTarget: { value } }) => setFocus('expiry')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                onChange={({ currentTarget: { value } }) => setCvc(value.trim())}
                onFocus={({ currentTarget: { value } }) => setFocus('cvc')}
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
