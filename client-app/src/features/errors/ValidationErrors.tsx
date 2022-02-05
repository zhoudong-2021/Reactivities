import React from 'react';
import { Message, MessageItem, MessageList } from 'semantic-ui-react';

interface Props{
    errors: string[] | undefined;
}

export default function ValidationErrors({errors}:Props){
    return(
        <Message error>
            {errors && 
                <MessageList>
                    {errors.map((error, i) => (
                        <MessageItem key={i}>
                            {error}
                        </MessageItem>
                    ))}
                </MessageList>
            }
        </Message>
    )
}