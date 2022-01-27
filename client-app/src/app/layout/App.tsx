import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity>();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>("http://localhost:5000/api/activities").then(
      res => {
        res.data.map(item => 
          item.date = item.date.slice(0, 10)
        )
        setActivities(res.data)
      });
  }, []);

  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  const handleDeleteActivity = (id:string) => 
    setActivities([...activities.filter(x => x.id !== id)]);

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

  const handleCreateOrEditActivity = (activity:Activity) => {
    activity.id 
      ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
      : setActivities([...activities, {...activity, id:uuid()}]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  return (
    <>
      <NavBar onOpenForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          editMode={editMode}
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
