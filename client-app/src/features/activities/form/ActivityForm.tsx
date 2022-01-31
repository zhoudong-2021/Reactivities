import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';


export default observer(function ActivityForm() {
    const {id} = useParams<{id:string}>();
    const history = useHistory();
    const { activityStore } = useStore();
    const { loadActivity, loading, loadingInitial, createOrEditActivity, selectedActivity } = activityStore;

    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: '',
    });

    useEffect(() => {
        if(id) loadActivity(id).then(activity => setActivity(activity));
    },[loadActivity, id]);

    const handleSubmit = () => {
        createOrEditActivity(activity);
        history.push(`/activities/${selectedActivity!.id}`);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }
       
    if (loadingInitial) return <LoadingComponent inverted={true} content={''}/>;

    return (
        <Segment clearing>
            <Form
                onSubmit={()=>handleSubmit()}
                autoComplete='off'
            >
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />
                <Button
                    floated='right'
                    positive
                    type='submit'
                    content='submit'
                    loading={loading}
                />
                <Button
                    as={NavLink}
                    to={`/activities`}
                    floated='right'
                    type='button'
                    content='cancel'
                />
            </Form>
        </Segment>
    )
})