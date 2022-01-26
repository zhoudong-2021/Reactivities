import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';


function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/activities").then(
      res => setActivities(res.data)
    );
  },[]);

  return (
    <div className="App">
      <Header as='h2' icon='users' content='Reactivities'/>
        <List>
          {activities.map((item : any) => (
            <List.Item key={item.id}>{item.title}</List.Item>
          ))}
        </List>
    </div>
  );
}

export default App;
