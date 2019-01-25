import React from 'react';
import { List } from 'semantic-ui-react';

const CustomList = ({items}) => {
  const createListItem = (item) => {
    return (
      <List.Item>
        <List.Content>
          <List.Description>
            { item }
          </List.Description>
        </List.Content>
      </List.Item>
    );
  };
  return (
    <List>
      {items.map(item => createListItem(item))}
    </List>
  )
};

export default CustomList;