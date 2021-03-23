import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Cards from 'react-credit-cards';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

const SingleCard = (props) => {
  const classes = useStyles();

  const { name, number, cvc, expiaryDate : { month, year } } = props.data;

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Cards
            cvc={cvc}
            expiry={`${ month }/${ year }`}
            focused={"name"}
            name={name}
            number={number}
          />
          <br/>
          <Cards
            cvc={cvc}
            expiry={`${ month }/${ year }`}
            focused={"cvc"}
            name={name}
            number={number}
          />
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Edit
        </Button>
        <Button size="small" color="primary">
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default SingleCard;