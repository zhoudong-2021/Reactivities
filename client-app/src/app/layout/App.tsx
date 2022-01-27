import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity>();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    agent.Activities.list().then(data => {
      data.map(item =>
        item.date = item.date.slice(0, 10))
      setActivities(data);
      setLoading(false);
    });
  }, []);

  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  const handleDeleteActivity = async (id: string) =>
  {
    setSubmitting(true);
    await agent.Activities.delete(id);
    setSubmitting(false);
    setActivities([...activities.filter(x => x.id !== id)]);
  }
    

  const handleCancelSelectedActivity = () => {
    setSelectedActivity(undefined);
  }

  const handleFormOpen = (id?: string) => {
    id ? handleSelectedActivity(id) : handleCancelSelectedActivity();
    setEditMode(true);
  }

  const handleFormClose = () => {
    setEditMode(false);
  }

  const handleCreateOrEditActivity = async(activity: Activity) => {
    setSubmitting(true);
    if(activity.id)
      // ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
      // : setActivities([...activities, { ...activity, id: uuid() }]);
      {
        await agent.Activities.update(activity);
        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
      }
      else {
        await agent.Activities.create({...activity, id:uuid()});
        setActivities([...activities, { ...activity, id: uuid() }]);
      };
    setEditMode(false);
    setSubmitting(false);
    setSelectedActivity(activity);
  }

  if(loading) return <LoadingComponent inverted={true} content={'Loading activities...'} />

  return (
    <>
      <NavBar onOpenForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          editMode={editMode}
          submitting={submitting}
          onSelectActivity={handleSelectedActivity}
          onDeleteActivity={handleDeleteActivity}
          onCancelActivity={handleCancelSelectedActivity}
          onFormOpen={handleFormOpen}
          onFormClose={handleFormClose}
          onCreateOrEditActivity={handleCreateOrEditActivity}
        />

      </Container>
    </>
  );
}

export default App;
