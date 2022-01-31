import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

interface Props{
    onOpenForm:() => void;
}

export default function NavBar(){

    const {} = useStore();

    return(
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} exact to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight:10}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} exact to='/activities' name='Activities' />
                <Menu.Item>
                    <Button 
                    as={NavLink}
                    to='/create'
                    positive 
                    content='Create Activity'
                    />
                </Menu.Item>
            </Container>
        </Menu>
    )
}