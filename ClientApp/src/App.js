import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import FeatureList from './views/Feature/FeatureList';
import NewFeature from './views/Feature/NewFeature';
import PageFeatureList from './views/PageFeature/PageFeatureList';
import DetailPage from './views/Route/DetailPage';

import './custom.css'
import RoleList from './views/Role/RoleList';
import NewRole from './views/Role/NewRole';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
        <Route path='/role' component={RoleList} />
        <Route path='/newrole' component={NewRole} />
        <Route path='/editrole/:id' component={NewRole} />

        <Route path='/feature' component={FeatureList} />
        <Route path='/newfeature' component={NewFeature} />
        <Route path='/editfeature/:id' component={NewFeature} />

        <Route path= '/:MainRoute/:SubRoute' component={DetailPage}/>

        <Route path='/pagefeature/:id' component={PageFeatureList} />

      </Layout>
    );
  }
}
