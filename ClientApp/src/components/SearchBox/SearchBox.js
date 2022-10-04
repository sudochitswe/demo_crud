import * as React from 'react';
import PropTypes from 'prop-types';
import './SearchBox.css';

const propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onSearchKeywordChange: PropTypes.func.isRequired
};

const defaultProps = {
  className: "",
  value: "",
};

export const SearchBox = (props) => {
  const { value } = props;
  return(
    <div>
      <div className="input_group">
        <input 
          id="search" name="search" type="text"
          placeholder="Type to search..."
          value={value} 
          className="form_control"
          onChange={(e)=> props.onSearchKeywordChange(e.target.value, true)}
        />
        <div className="input_group-append">
          <button className="btn_ btn_bg btn_tcolor" onClick={()=> props.onSearchKeywordChange("", false)}>
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

SearchBox.propTypes = propTypes;
SearchBox.defaultProps = defaultProps;