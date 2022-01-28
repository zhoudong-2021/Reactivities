import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {activityStore} = useStore();
  const {loadingInitial, loadActivities} = activityStore;


  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if(loadingInitial) return <LoadingComponent inverted={true} content={'Loading activities...'} />

  return (
    <>
      <NavBar  />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard/>

      </Container>
    </>
  );
}

export default observer(App);
