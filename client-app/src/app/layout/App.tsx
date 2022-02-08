import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/Home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import LoginForm from '../../features/users/LoginForm';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';

function App() {
  const location = useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(() => {
    if(commonStore.token)
      userStore.getUser().finally(()=> commonStore.setAppLoaded(true));
    else
      commonStore.setAppLoaded(true);
  }, [userStore, commonStore])

  if(!commonStore.appLoaded) return(<LoadingComponent content='Loading app...' inverted={false} />)

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route path='/' exact component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route path='/activities' exact component={ActivityDashboard} />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route path='/createActivity' component={ActivityForm} />
                <Route key={location.key} path={['/edit/:id', '/create']} component={ActivityForm} />
                <Route path='/errors' component={TestErrors} />
                <Route path='/serverError' component={ServerError}/>
                <Route path='/login' component={LoginForm}/>
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
