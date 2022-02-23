import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Card, Grid, Header, Tab, Image, Loader } from 'semantic-ui-react';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { useStore } from '../../app/stores/store';

export default observer(function ProfileActivities() {
    const { profileStore: {
        loadingActivities, userActivities, loadUserActivities, profile
    } } = useStore();

    const [loading, setLoading] = useState(false);
    const [activeState, setActiveState] = useState('future');

    useEffect(() => {
        setLoading(true);
        loadUserActivities(profile!.username, 'future').then(() => setLoading(false));
    }, [loadUserActivities])

    const handleSelect = (value: string) => {
        setActiveState(value);
        loadUserActivities(profile!.username, value);
        
    }

    if(loading) return <LoadingComponent inverted={true} content={'Loading...'} />

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='calendar' content='Activity' />
                    <div className="ui three item menu">
                        <a className={activeState === 'future' ? 'item active' : 'item'} 
                            onClick={() => handleSelect('future')}
                        >Future Events</a>
                        <a className={activeState === 'past' ? 'item active' : 'item'} 
                            onClick={() => handleSelect('past')}
                        >Past Events</a>
                        <a className={activeState === 'hosting' ? 'item active' : 'item'} 
                            onClick={() => handleSelect('hosting')}
                        >Hosting</a>
                    </div>
                </Grid.Column>
                <Grid.Column width={16}>
                    {loadingActivities ? <LoadingComponent inverted={true} content={'Loading...'} />
                        : <Card.Group itemsPerRow={4}>
                            {userActivities.map(activity => (
                                <Card key={activity.id}>
                                    <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
                                    <Header as='h4' content={activity.title} style={{ textAlign: 'center' }} />
                                    <div style={{ textAlign: 'center' }}>
                                        <p>{format(activity.date, 'dd MMM')}</p>
                                        <p>{format(activity.date, 'h:mm aa')}</p>
                                    </div>
                                </Card>
                            ))}
                        </Card.Group>}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})