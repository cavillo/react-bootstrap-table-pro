import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

class TablePro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page:0,
      searchText:'',
    };
  }
  componentDidMount(){
  }
  renderHeader(){
    let items = Object.keys(this.props.keys);
    items = items.map(
      (key)=>{
        return (
          <th key={`tablepro-header-key${key}`}>
            {this.props.keys[key].label?this.props.keys[key].label:key.toUpperCase()}
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
    let content = items.map(
      (a)=>{
        return (
          this.props.keys[a].searchAs?this.props.keys[a].searchAs(row,this.props.data[row][a]):this.props.data[row][a]
        );
      }
    ).reduce((a,b)=>{
      return `${a} ${b}`;
    },'');
    if (this.state.searchText === '' || content.toLowerCase().search(this.state.searchText.toLowerCase()) >= 0) {
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
    }else{
      return null;
    }
  }
  renderBody(){
    let items = Object.keys(this.props.data).reverse().slice(this.state.page*this.props.pageSize,(this.state.page*this.props.pageSize)+this.props.pageSize);

    items = items.map(this.renderRow.bind(this));
    return items;
  }
  renderPaginator(){
    let pages = [];
    const items = Object.keys(this.props.data).reverse();
    const totalPages = items.length<=this.props.pageSize?1:parseInt(Math.round(items.length/this.props.pageSize), 10);
    for (var i = 0; i < totalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${this.state.page===i?'active':''}`}>
          <button onClick={this.goToPage.bind(this,i)} className='page-link' >{i+1}</button>
        </li>
      );
    }

    return (
      <div>
        <ul className='pagination pagination-sm'>
          <li className={`page-item ${this.state.page===0?'disabled':''}`}>
            <button onClick={this.goToPage.bind(this,this.state.page-1)} className='page-link' >&laquo;</button>
          </li>
          {pages}
          <li className={`page-item ${this.state.page===(totalPages-1)?'disabled':''}`}>
            <button onClick={this.goToPage.bind(this,this.state.page+1)} className='page-link' >&raquo;</button>
          </li>
        </ul>
      </div>
    );
  }
  goToPage(page){
    const items = Object.keys(this.props.data).reverse();
    const totalPages = items.length<=this.props.pageSize?1:parseInt(Math.round(items.length/this.props.pageSize), 10);
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
    return (
      <div className="table-pro">
        {this.renderSearchBar()}
        <div className='table-responsive'>
          <table className='table table-hover table-bordered'>
            <thead className='thead-dark'>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
          {this.renderPaginator()}
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
};
TablePro.propTypes = {
  keys: PropTypes.object,
  data: PropTypes.object,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
};
export default TablePro;
