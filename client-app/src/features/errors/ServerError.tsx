import { observer } from 'mobx-react-lite';
import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

export default observer(function ServerError() {
    const { commonStore: { serverError } } = useStore();

    return (
        <Container>
            <Header as='h1' content='Server Error' />
            <Header as='h5' sub color='red' content={serverError?.message} />
            {serverError?.error &&
                <Segment>
                    <Header as='h4' content='Stack trace' color='teal' />
                    <code style={{ marginTop: 10 }}>{serverError.error}</code>
                </Segment>
            }
        </Container>
    )
})