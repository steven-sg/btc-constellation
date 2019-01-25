import React, { Component } from 'react';
import { List } from 'semantic-ui-react'
import { Segment, Button } from 'semantic-ui-react'

class CustomList extends Component {
  constructor(props) {
    super(props);
    this.state = {transaction: null}
  }

  render() {
    return (
        <List style={{ flexBasis: 1, flexShrink: 1, flexGrow: 1, overflowY:'scroll'}}>
          <Segment.Group>
            {<Segment style={{display: 'flex', alignItems: 'center'}}>
              <Button style={{boxShadow: 'noneƒ'}} basic transparent size='small' icon='times' />
              <p style={{display: 'inline', flexGrow: 1, marginBottom: '0'}}>Pellentesque habitant morbi </p>
              <p style={{display: 'inline'}}>Pellentesque habitant morbi </p>
            </Segment>}
          </Segment.Group>
        </List>
    );
  }
}

export default CustomList;
