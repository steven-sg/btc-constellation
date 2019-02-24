import React from 'react'

export function GenericLog ({log, showResult}) {
  const renderResult = () => {
    return (
      <div style={{marginTop: '0.5rem', opacity:'0.6'}}>
        <div style={{fontWeight:'bold'}}>
          Result
        </div>
        {log.result.map((singleLog => {
          return (
            <div style={{marginTop: '0.5rem'}}>
              {singleLog}
            </div>
          );
        }))}
      </div>
    );
  }
  const renderSubaction = () => {
    return (
      <div style={{marginTop: '0.5rem', opacity:'0.6'}}>
        <div style={{fontWeight:'bold'}}>
          Sub-Action
        </div>
        {log.subaction.map((subaction => {
          return (
            <div style={{marginTop: '0.5rem'}}>
              {subaction.log}
            </div>
          );
        }))}
      </div>
    );
  }
  return (
    <div>
      <div>
        <span style={{color: 'red', fontWeight:'bold'}}>
          {`${log.action} `}
        </span>
        {log.object}
      </div>
      { log.hasSubaction() && renderSubaction() }
      { showResult && log.hasResult() && renderResult() }
    </div>
  );
}