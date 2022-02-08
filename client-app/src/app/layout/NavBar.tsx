import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Menu, Image, DropdownMenu} from 'semantic-ui-react';
import { useStore } from '../stores/store';

export default function NavBar() {
    const { userStore: { user, logout } } = useStore();
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} exact to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }} />
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} exact to='/activities' name='Activities' />
                <Menu.Item as={NavLink} exact to='/errors' name='Errors' />
                <Menu.Item>
                    <Button
                        as={NavLink}
                        to='/create'
                        positive
                        content='Create Activity'
                    />
                </Menu.Item>
                <Menu.Item position='right'>
                    <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <DropdownMenu>
                            <Dropdown.Item as={Link} to={`/profile/${user?.username}`}
                            text='My Profile' icon='user'/>
                            <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
                        </DropdownMenu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    )
}