import * as React from 'react';
import PropTypes from 'prop-types';
import './Pagination.css';

const propTypes = {
  className: PropTypes.string,
  totalPage: PropTypes.number,
  currentPage: PropTypes.number,
  rowPerPage: PropTypes.number,
  totalRecord: PropTypes.number,
  besideRangeDisplayed: PropTypes.number,
  onClickPageNumber: PropTypes.func.isRequired,
  onClickRowPerPage: PropTypes.func.isRequired
};

const defaultProps = {
  className: "",
  totalPage: 0,
  currentPage: 1,
  rowPerPage: 10,
  totalRecord: 0,
  besideRangeDisplayed: 5,
};

export const Pagination = (props) => {
  const { className, totalPage, currentPage, rowPerPage, totalRecord, onClickPageNumber, onClickRowPerPage, besideRangeDisplayed } = props;
  return(
    <div className={`${className} row_`}>
      <div className="col_xl-5 col_md-10">
        <strong>Total Record: {totalRecord}</strong>
      </div>
      <div className="col_xl-5 col_md-6" >
        <div className="pag">
          <button href="#" disabled={currentPage <= 1} onClick={e => onClickPageNumber(e, 1)} >First</button>
          <button href="#" disabled={currentPage <= 1} onClick={e => onClickPageNumber(e, currentPage <= 1 ? currentPage : currentPage-1)} >&laquo;</button>
          {[...Array(totalPage)].map((page, i) => {
            if(i+1 >= currentPage - besideRangeDisplayed && i+1 <= currentPage + besideRangeDisplayed )
            return(
              <button href="#" className={i+1 === currentPage ? "active":""} key={i+1} 
              onClick={e => onClickPageNumber(e, i+1)}>{i+1}</button>
            );
          })}
          <button href="#" disabled={currentPage >= totalPage} onClick={e => onClickPageNumber(e, currentPage >= totalPage ? currentPage : currentPage+1)} >&raquo;</button>
          <button href="#" disabled={currentPage >= totalPage} onClick={e => onClickPageNumber(e, totalPage)} >Last</button>
        </div>
      </div>
      <div >
        <select className="form_control" type="select" name="rowPerPage" id="rowPerPage" value={rowPerPage} onChange={(e)=>onClickRowPerPage(e)} >
          <option value="5">5 rows</option>
          <option value="10">10 rows</option>
          <option value="20">20 rows</option>
          <option value="25">25 rows</option>
          <option value="50">50 rows</option>
          <option value="100">100 rows</option>
        </select>
      </div>
    </div>
  );
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;