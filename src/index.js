import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

class TablePro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      searchText: '',
      sortType: props.defSortType,
      sortBy: props.defSortBy?props.defSortBy:this.props.keys?Object.keys(this.props.keys)[0]:undefined,
    };
  }
  componentDidMount(){
  }
  renderHeader(){
    let items = Object.keys(this.props.keys);
    items = items.map(
      (key)=>{
        return (
          <th
            onClick={
              ()=>{
                this.setState(
                  {
                    sortBy:key,
                    sortType:(this.state.sortBy===key?(this.state.sortType==='ASC'?'DESC':'ASC'):'ASC'),
                  }
                );
              }
            } key={`tablepro-header-key${key}`}>
            {this.props.keys[key].label?this.props.keys[key].label:key.toUpperCase()}
            {this.state.sortBy===key?(this.state.sortType===('ASC')?'↓':'↑'):''}
          </th>
        );
      }
    );
    return (
      <tr>
        {items}
      </tr>
    );
  }
  renderRow(row){
    let items = Object.keys(this.props.keys);
    items = items.map(
      (a)=>{
        return (
          <td key={`tablepro-row-key${row}-${a}`}>
            {this.props.keys[a].renderAs?this.props.keys[a].renderAs(row,this.props.data[row][a]):this.props.data[row][a]}
          </td>
        );
      }
    );
    return (
      <tr key={row}>
        {items}
      </tr>
    );
  }
  renderBody(){
    let data = this.props.data;

    // Filter data by search
    data = Object.keys(data).filter((row)=>{
      const items = Object.keys(this.props.keys);
      const content = items.map(
        (key)=>{
          return (
            this.props.keys[key].sortAs ?
              this.props.keys[key].sortAs(row,data[row][key]) :
              this.props.keys[key].searchAs ?
                this.props.keys[key].searchAs(row,data[row][key]) :
                data[row][key]
          );
        }
      ).reduce((a,b)=>{
        return `${a} ${b}`;
      },'');
      return (this.state.searchText === '' || content.toLowerCase().search(this.state.searchText.toLowerCase()) >= 0);
    }).reduce((a,b)=>{a[b]=data[b];return a;},{});

    // Sort the data
    const sortBy = this.state.sortBy?this.state.sortBy:Object.keys(this.props.keys)[0];
    if (this.props.keys[sortBy]) {
      data = Object.keys(data).sort((a,b)=>{
        let elem1 = '';
        if(data[a][sortBy] !== undefined){
          elem1 = this.props.keys[sortBy].searchAs ?
            this.props.keys[sortBy].searchAs(a,data[a][sortBy]).toLowerCase() :
            data[a][sortBy].toLowerCase();
        }
        let elem2 = '';
        if(data[b][sortBy] !== undefined){
          elem2 = this.props.keys[sortBy].searchAs ?
            this.props.keys[sortBy].searchAs(b,data[b][sortBy]).toLowerCase() :
            data[b][sortBy].toLowerCase();
        }
        const dif = ((elem1 === elem2) ? 0 : (elem1 > elem2) ? -1 : 1);

        if (this.state.sortType === 'DESC') {
          return -dif;
        }else{
          return dif;
        }
      }).reduce((a,b)=>{a[b]=data[b];return a;},{});
    }

    // Get # of pages for the rendering data
    const totalPages = Object.keys(data).length<=this.props.pageSize?1:parseInt(Math.round(Object.keys(data).length/this.props.pageSize), 10);

    // Get the render elements
    let body = Object.keys(data).reverse().slice(this.state.page*this.props.pageSize,(this.state.page*this.props.pageSize)+this.props.pageSize);
    body = body.map(this.renderRow.bind(this));

    return {
      body,
      totalPages
    };
  }
  renderPaginator(totalPages){
    let pages = [];
    for (var i = 0; i < totalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${this.state.page===i?'active':''}`}>
          <button onClick={this.goToPage.bind(this,i,totalPages)} className='page-link' >{i+1}</button>
        </li>
      );
    }

    return (
      <div>
        <ul className='pagination pagination-sm'>
          <li className={`page-item ${this.state.page===0?'disabled':''}`}>
            <button onClick={this.goToPage.bind(this,this.state.page-1,totalPages)} className='page-link' >&laquo;</button>
          </li>
          {pages}
          <li className={`page-item ${this.state.page===(totalPages-1)?'disabled':''}`}>
            <button onClick={this.goToPage.bind(this,this.state.page+1,totalPages)} className='page-link' >&raquo;</button>
          </li>
        </ul>
      </div>
    );
  }
  goToPage(page, totalPages){
    let newPage = parseInt(page, 10);
    if (newPage >= 0 && newPage < totalPages) {
      this.setState({page:newPage});
    }
  }
  renderSearchBar(){
    return (
      <div className='row' style={{marginBottom:10,}}>
        <div className='col-md-4 offset-md-8'>
          <input className='form-control mr-sm-2' type='text' placeholder='Search' value={this.state.searchText} onChange={this.handleChangeSearchBar.bind(this)}/>
        </div>
      </div>
    );
  }
  handleChangeSearchBar(event) {
    this.setState({searchText: event.target.value});
  }
  render() {
    const {
      body,
      totalPages
    } = this.renderBody();
    return (
      <div className="table-pro">
        {this.renderSearchBar()}
        <div className='table-responsive'>
          <table className='table table-hover table-bordered'>
            <thead className='thead-dark'>
              {this.renderHeader()}
            </thead>
            <tbody>
              {body}
            </tbody>
          </table>
          {this.renderPaginator(totalPages)}
        </div>
      </div>
    );
  }
}
TablePro.defaultProps = {
  keys: {},
  data: {},
  pagination: true,
  pageSize: 10,
  defSortType: 'ASC',
};
TablePro.propTypes = {
  keys: PropTypes.object,
  data: PropTypes.object,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  defSortType: PropTypes.string,
  defSortBy: PropTypes.string,
};
export default TablePro;
