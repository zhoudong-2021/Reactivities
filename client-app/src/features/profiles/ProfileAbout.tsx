import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import ProfileEditForm from './ProfileEditForm';

interface Props{
    profile:Profile;
}

export default observer ( function ProfileAbout({profile}:Props) {
    const { profileStore: { isCurrentUser } } = useStore();
    const [editMode, setEditMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='user' content='User Bio'/>
                    {isCurrentUser &&
                        <Button
                            basic
                            floated='right'
                            content={editMode ? 'Cancel' : 'Change Bio'}
                            onClick={() => setEditMode(!editMode)}
                        />}
                </Grid.Column>
                <Grid.Column width={16}>
                    {editMode 
                        ? <ProfileEditForm profile={profile} setEditMode={setEditMode}/>
                        : (
                            <div>
                                <Header as='h4' content={profile.displayName}/>
                                <span style={{whiteSpace:'pre-wrap'}}>{profile.bio}</span>
                            </div>
                        )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})