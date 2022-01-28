import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';


export default observer(function ActivityList() {

    const { activityStore } = useStore();
    const { activitiesOrderByDate: activities, loading, deleteActivity, selectActivity } = activityStore;
    const [selectedButton, setSelectedButton] = useState('');

    const handleActivityDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, activity: Activity) => {
        setSelectedButton(e.currentTarget.name);
        deleteActivity(activity.id);
    }
    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.date}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button
                                    name={activity.id}
                                    floated='right'
                                    content='Delete'
                                    color='red'
                                    loading={loading && selectedButton === activity.id}
                                    onClick={(e) => {
                                        handleActivityDelete(e, activity)
                                    }}
                                />
                                <Button
                                    floated='right'
                                    content='View'
                                    color='blue'
                                    onClick={() => selectActivity(activity.id)}
                                />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})