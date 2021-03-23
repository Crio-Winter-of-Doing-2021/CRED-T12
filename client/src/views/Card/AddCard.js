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

import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
import CardContext from '../../context/card/cardContext';

const supportedCards = {
  '4916114318775438': 'VISA',
  '4532717078986054': 'VISA',
  '4916960746371590778': 'VISA',
  '5464097238279412': 'MasterCard',
  '5591317939784650': 'MasterCard',
  '5586406266205970': 'MasterCard',
  '347700284258909': 'American Express (AMEX)',
  '345434824190735': 'American Express (AMEX)',
  '340386804617522': 'American Express (AMEX)',
  '6011690025167497': 'Discover',
  '6011127860248769': 'Discover',
  '6011289828225840344': 'Discover',
  '3589832437396350': 'JCB',
  '3532889637693729': 'JCB',
  '3536566605778201774': 'JCB',
  '5536210731689821': 'Diners Club - North America',
  '5592354044890618': 'Diners Club - North America',
  '5487734674333351': 'Diners Club - North America',
  '30049427459517': 'Diners Club - Carte Blanche',
  '30066449956817': 'Diners Club - Carte Blanche',
  '30454471777535': 'Diners Club - Carte Blanche',
  '36240925857971': 'Diners Club - International',
  '36106949075397': 'Diners Club - International',
  '36331228422884': 'Diners Club - International',
  '6763945122313067': 'Maestro',
  '5038462505726189': 'Maestro',
  '6762600153157963': 'Maestro',
  '4175002239567552': 'Visa Electron',
  '4917400771628803': 'Visa Electron',
  '4508584887480236': 'Visa Electron',
  '6396201755478974': 'InstaPayment',
  '6395072787053866': 'InstaPayment',
  '6380469452952454': 'InstaPayment'
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

  const expiryRegExp = useMemo(() => /^[0-9]{2}\/[0-9]{2}$/, []);

  const [cvc, setCvc] = useState('');
  const [expiry, setExpiry] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [focus, setFocus] = useState('');
  const [isExpiryValid, validateExpiry] = useState(true);

  const isSubmitDisabled = !cvc.trim() || !expiry.trim() || !name.trim() || !number.trim() || !isExpiryValid;

  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error]);

  useEffect(() => {
		validateExpiry(expiry && expiryRegExp.test(expiry));
	}, [expiry, expiryRegExp]);

  const onSubmit = async (e) => {
    e.preventDefault();
    
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
    await addCard(data);
  };

  const onNumberChange = e => {
    e.preventDefault();
    let value = e.target.value.trim();
    if(value.length > 19) return;
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
