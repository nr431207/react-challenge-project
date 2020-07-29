import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Main, Login, OrderForm, ViewOrders } from '../components';
import PrivateRouter from './privateRouter';

const AppRouter = ({ token }) => {
  return (
    <Router>
      <Route path="/" exact component={Main} />
      <Route path="/login" exact component={Login} />
      <PrivateRouter token={token} path="/order" exact component={OrderForm} />
      <PrivateRouter token={token} path="/view-orders" exact component={ViewOrders} />
    </Router>
  );
}

const mapStateToProps = ({ auth }) => ({
  token: auth.token
})

export default connect(mapStateToProps, null)(AppRouter);
