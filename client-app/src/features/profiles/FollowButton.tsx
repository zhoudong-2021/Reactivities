import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent } from 'react';
import { Button, Reveal } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {
    const { profileStore, userStore } = useStore();
    const { updateFollowing, loading } = profileStore;

    const handleUpdateFollowing = (e: SyntheticEvent, username: string) => {
        e.preventDefault();
        profile.isFollowing ? updateFollowing(username, false) : updateFollowing(username, true);
    }

    if (userStore.user?.username === profile.username) return null;

    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button
                    fluid
                    color='teal'
                    content={profile.isFollowing ? 'Follow' : 'Unfollow'}/>
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button
                    fluid
                    basic
                    color={profile.isFollowing ? 'red' : 'green'}
                    content={profile.isFollowing ? 'Unfollow' : 'Follow'}
                    loading={loading}
                    onClick={e => handleUpdateFollowing(e, profile.username)}
                />
            </Reveal.Content>
        </Reveal>
    )
})