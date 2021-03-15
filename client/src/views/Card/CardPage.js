import React from "react";
import { Route, Switch } from 'react-router-dom';

import AddCard from "./AddCard.js";
import AllCards from "./AllCards.js";

export default function CardPage() {
  return (
    <>
        <Route exact path="/admin/card" component={AllCards} />
        <Switch>
        <Route exact path="/admin/card/add" component={AddCard} />
        {/* <Route exact path="/feeds" component={Feeds} /> */}
        {/* <Route exact path="/feed/:feedId" component={Feed} /> */}
        </Switch>
    </>
  );
}
