import React, { Component }from 'react';
import { Segment, Header } from 'semantic-ui-react'

class TranactionSnapshot extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleHover = (e) => {
    e.stopPropagation();
  }

  handleClick = (e) => {
    e.stopPropagation();
  }

  renderGroup(element, index=0) {
    let value = <div>EMPTY</div>;
    if (!element.value) {
      value = <div>Undefined</div>;
    } else if (typeof element.value[0] === 'string') {
      value = <div>{element.value[0]}</div>;
    } else if (Array.isArray(element.value[0])) {
      value = element.value.map((array ,index) => {
        return (
          <div style={{marginTop: '1rem'}}>
            <b>{`${element.key}:${index}`}</b>
            {this.renderSubGroup(array)}
          </div>
        );
      });
    }
    return this.renderSegment(element.key, value);
  }

  renderSubGroup(element, index=0) {
    return (
      <div style={{marginLeft: '1rem'}}>
        {
          element.map(el => {
            const value = typeof el.value[0] === 'string' ? el.value : this.renderSubGroup(el.value);
            return (
            <div style={{wordBreak: 'break-word'}}>
              <b>{el.key}:</b> {value}
            </div>);
          })
        }
      </div>
    );
  }

  renderSegment(header, value) {
    return (
    <Segment>
      <Header sub style={{marginBottom: '0.5rem'}}>{header}</Header>
      <div>{value}</div>
    </Segment>
    );
  }

  render() {
    return (
      <Segment.Group onClick={this.handleClick} onMouseOver={this.handleHover} onMouseLeave={this.handleHover}>
        { this.props.snapshot.map(element => this.renderGroup(element)) }
      </Segment.Group>
    )
  }
};

export default TranactionSnapshot;
