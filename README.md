# TablePro
This is a React component for working with data tables! It allows to search, paginate and customize the loading of dynamic data in a table. It uses Bootstrap (v4) style for good looks ;)

## Installation
`npm i react-bootstrap-table-pro --save`

## Usage

Test.js:
``` js
import React, { Component } from 'react';

import TablePro from 'react-bootstrap-table-pro';

class Test extends Component {
  constructor(props) {
    super(props);
    const data = {
      'id-1' : {
        'name' : 'Foo Bar',
        'email' : 'foo@bar.com',
        'status' : 'NEW',
        'created_at' : '2017-12-01T00:06:21.235Z',
        'updated_at' : '2017-12-01T00:06:21.236Z'
      },
      'id-2' : {
        'name' : 'Baz Bar',
        'email' : 'baz@bar.com',
        'status' : 'NEW',
        'created_at' : '2017-12-01T00:06:21.235Z',
        'updated_at' : '2017-12-01T00:06:21.236Z'
      }
    };

    this.state = {
      data,
    };
  }
  render(){
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='table-responsive'>
            <h2>New clients</h2>
            <TablePro
              pageSize={10}
              keys={
                {
                  name: {
                    label: 'Name',
                    searchAs:(k,a)=>{
                      return a;
                    },
                    renderAs:(k,a)=>{
                      return(
                        <a href={`/clients/${k}`}>{a}</a>
                      );
                    }
                  },
                  email: {
                    label: 'Email',
                  },
                  created_at: {
                    label: 'Created',
                    renderAs:(k,a)=>(new Date(a)).toDateString(),
                    searchAs:(k,a)=>{
                      return a;
                    },
                  },
                  status: {
                    label: 'Status',
                    renderAs:(k,a)=>{
                      return(
                        <div className="float-right">
                          <strong>{a}</strong>
                        </div>
                      );
                    }
                  },
                }
              }
              data={this.state.data}/>
          </div>
        </div>
      </div>
    );
  }
}
```