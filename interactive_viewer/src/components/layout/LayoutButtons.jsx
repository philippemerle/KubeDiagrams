import React from 'react';

import Layout from './Layout';

export default class LayoutButtons extends React.Component {



  render() {
    return (
        <div id='layoutButtons'>
            {this.props.layoutList.map(layout => {
               return <Layout key={layout.id} name={layout.name} layout={layout} switch_layout={this.props.switch_layout}/>
            })}
        </div>
    );
  }

}