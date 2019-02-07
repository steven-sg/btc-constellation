import React from 'react'
import { Table } from 'semantic-ui-react'

const TransactionTable = ({tx}) => (
  <Table definition>
    <Table.Body>
      {[...tx.getKeys()].map(
        key => (
          <Table.Row>
            <Table.Cell>{key}</Table.Cell>
            <Table.Cell>{tx.getValue(key) && tx.getValue(key).toString()}</Table.Cell>
          </Table.Row>
        )
      )}
      {/* <Table.Row>
        <Table.Cell>reset rating</Table.Cell>
        <Table.Cell>None</Table.Cell>
        <Table.Cell>Resets rating to default value</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>set rating</Table.Cell>
        <Table.Cell>rating (integer)</Table.Cell>
        <Table.Cell>Sets the current star rating to specified value</Table.Cell>
      </Table.Row> */}
    </Table.Body>
  </Table>
)

export default TransactionTable
