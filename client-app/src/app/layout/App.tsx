import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/Home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() {
  const location = useLocation();

  return (
    <>
      <Route path='/' exact component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Route path='/activities' exact component={ActivityDashboard} />
              <Route path='/activities/:id' component={ActivityDetails} />
              <Route path='/createActivity' component={ActivityForm} />
              <Route key={location.key} path={['/edit/:id', '/create']} component={ActivityForm} />
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
