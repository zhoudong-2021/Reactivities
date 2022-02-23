import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props{
    inverted:boolean;
    content:string;
}

export default function LoadingComponent(
    {inverted=true, content='Loading...'}:Props){
    return(
        <Dimmer active={true} inverted={inverted} style={{marginTop:10}}>
            <Loader content={content}/>
        </Dimmer>
    )
}