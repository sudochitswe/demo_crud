/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { Alert,Button,Card, CardBody,CardFooter, Col, Row, FormInput , Container, timeoutsShape } from 'reactstrap';
import Select from 'react-select';
//import { Redirect } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';
// FeatureTable
import { fetchFeature } from '../../api/feature';
// roleTable
import { fetchRole } from '../../api/Role';
// Save for rolefeature
import { saveRoleFeature,fetchRoleFeature } from '../../api/RoleFeature';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../store/Auth';
import { connect } from 'react-redux';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { fetchCurrentUser } from '../../api';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

class RoleFeature extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      gotolist : false,
      roleKey: "",
      roleName: "",
      formState:"new",
      roleFeatures: [],
      olddata: [],
      fullData: [],
      dropdownData: [],
      feature: {label: "All",values: 0},
      deleteModal: -1,
      selectModal: undefined,
      featureName: "",
      menuType: "",
      // for new table
      pageSizeOptions: [5, 10, 15, 20, 25, 30],
      pageSize: 10,
      tableData: [],
      sortBy: "lastSavedDate",
      isAsc: false,
      isLoading: false,
      allCheck: false,
      viewPerm: false,
      alladdPerm: false,
      alleditPerm: false,
      alldeletePerm: false,
      allRow: [],
    }
  }
  
  componentDidMount() {
    //let tableData = getTransactionHistoryData();
    
    let roleKey = null;
    if ( this.props.match.params.id ) 
        roleKey = this.props.match.params.id;

    if(roleKey){
      this.setState({
        roleKey,
        
      },()=>{this.loadData(this.state.roleKey)})
    }
    
    // this.setState({
    //   ...this.state,
    //   tableData
    // });
    // else{
    //   this.props.history.push({pathname: `/RoleFeature` });
    // }
  }

  updateState(prop, item) {
    let data  = this.state.data;
    let olddata  = this.state.olddata;
    let fullData  = this.state.fullData;
    if(prop === "feature"){
      if(item.value === "All"){
        this.setState({ roleFeatures: fullData });
      }else{
        let selectedItem = fullData.filter((itm)=>{ if(itm.MenuGroupCode === item.value){ return itm;}});
        this.setState({ 
          roleFeatures: selectedItem 
        });
      }
    }
    this.setState({ [prop]: item });
  }

  async loadData(roleKey)
  {
    //role data call
    this.setState({ isLoading: true });
    let roleData = await fetchRole(roleKey);
    //let roleName;
    if(roleData){
      this.setState({
        roleName :  roleData.roleName,
        //formState: "edit",
        isLoading: false
      })
    }
    //role data call
    // dropdown bind
    let allFeatures =  await fetchFeature();
    let dropdownData = [{label: "All",value: "All"}]; // add dropdown options
    //dropdownbind
    allFeatures.forEach((obj) => {
        if(obj.menuType === "MG") {
          dropdownData.push({label: obj.menuName, value: obj.menuGroupCode});
      }
    });
    //For Checkbox
    let data = [];

    let formState = "";
    let chkData = await fetchRoleFeature(roleKey);
    
    if(chkData.length > 0){
      formState = "edit";
      allFeatures.forEach(itm => {
        if(itm.menuType === "ME"){
          data.push({
            //roleFeatureID: itm.roleFeatureID,
            featureID: itm.featureID, 
            featureName: itm.menuName,
            MenuGroupCode: itm.menuGroupCode,
            viewPerm: 1,
            addPerm: 0,
            editPerm: 0,
            deletePerm: 0,         
          })      
        }
      });
      data.forEach(itm =>{
        chkData.forEach(i=>{
          if(itm.featureID === i.featureID){
            itm.roleFeatureID = i.roleFeatureID;
            itm.viewPerm = i.viewPerm;
            itm.addPerm = i.addPerm;
            itm.editPerm = i.editPerm;
            itm.deletePerm = i.deletePerm;
          }
        })
      })
     
    }// For Checkbox
    else{
      // Feature Table databind
      formState = "new";
      allFeatures.forEach(itm => {
      if(itm.menuType === "ME")
        data.push({
          featureID: itm.featureID, 
          featureName: itm.menuName,
          MenuGroupCode: itm.menuGroupCode,
          viewPerm: 1,
          addPerm: 0,
          editPerm: 0,
          deletePerm: 0,
        })
      });
    // Feature Table databind
    }
    this.setState({
      formState,
      olddata : data,
      roleFeatures: data,
      fullData: data,
      dropdownData,
      isLoading: false
    })

  }

  async submitHandle(){
    this.setState({ isLoading: true });
    let res = await saveRoleFeature(this.state);
    if(res.status){
      const res = await fetchCurrentUser();
      if(res){
        this.props.authenticate(res.data);
        this.setState({
          isLoading: false,
        });
        //this.updateSwitchOfTable('roleFeatures', undefined, undefined, 0);
        ToastsStore.success("Saving Successful!", 5000);
      }
    }else{
      this.setState({ 
        isLoading: false,
      });
      ToastsStore.error(res.message, 5000);
    }
  }

  cancelHandle(){
      this.props.history.push({pathname: "/Role/RoleList"});
  }

  getStatusClass(status) {
    switch(status){
      case "Cancelled":
        return "danger"
      case "Complete": 
        return "success";
      case "Pending": 
        return "warning";
      default:
        return ""
    }
  }

  updateSwitchOfTable = (prop, subProp, index, allValue) => {
    let value = 1;
    if (allValue !== undefined) {
      value = allValue;
    } else if (subProp === undefined && index === undefined) // select all 
    {
      value = this.state[prop].filter( obj => (obj.viewPerm || obj.addPerm || obj.editPerm || obj.deletePerm || obj.otherPerm ) )[0] ? 0 : 1;
      let allCheck = value === 0 ? false : true;
      this.setState({ allCheck }); 
    } else if (subProp !== undefined && index === undefined) // select coloumn
    {
      value = this.state[prop].filter( obj => obj[subProp] )[0] ? 0 : 1;
      let check = value === 0 ? false : true;
      this.setState({ subProp: check }); 
    } else if (subProp === undefined && index !== undefined) // select row
    {
      ['viewPerm', 'addPerm', 'editPerm', 'deletePerm', 'otherPerm'].map( perm => {
        if (this.state[prop][index][perm] === 1) {
          value = 0;
          let allRow = false; 
          this.setState({ allRow });
        }else {
          let allRow = true; 
          this.setState({ allRow });
        }
      });
    }
    this.setState(prevState => ({ [prop]: 
      prevState[prop].map( (obj, idx) => {
        //if(this.state.featureGroups.filter( item => item.value === obj.featureGroupKey)[0]) {
          if ( index === undefined || index === idx ) {
            for (var objProp in obj) {
              if (subProp === undefined) {
                switch(objProp) {
                  case 'viewPerm': case 'addPerm': case 'editPerm': case 'deletePerm': case 'otherPerm': 
                  obj[objProp] = value;
                }
              } else if (subProp === objProp && index === undefined) {
                obj[objProp] = value;
              } else if (subProp === objProp) {
                obj[objProp] = obj[objProp] ? 0 : 1;
              } else {
                obj[objProp] = obj[objProp]
              }
            }
            return obj;
          } else {
            return obj;
          }
      })
    }));
  }

  renderTable = (roleFeatures) => {
    let { allCheck,viewPerm,alladdPerm,alleditPerm,alldeletePerm,allRow } = this.state;
    if (roleFeatures.length <= 0) return <b>No Data To Show</b>;
    return (
      <div className="table-responsive">
        <table className="table table-bordered  table-striped table-hover">
          <thead>
            <tr>
              <th style={{cursor: 'pointer'}} onClick={()=>this.updateSwitchOfTable('roleFeatures')}><span className="btn-link">All</span></th>
              <th>Feature</th>
              <th style={{cursor: 'pointer'}} onClick={()=>this.updateSwitchOfTable('roleFeatures', 'viewPerm')}><span className="btn-link alert-link">View</span></th>
              <th style={{cursor: 'pointer'}} onClick={()=>this.updateSwitchOfTable('roleFeatures', 'addPerm')}><span className="btn-link alert-link">Add</span></th>
              <th style={{cursor: 'pointer'}} onClick={()=>this.updateSwitchOfTable('roleFeatures', 'editPerm')}><span className="btn-link alert-link">Edit</span></th>
              <th style={{cursor: 'pointer'}} onClick={()=>this.updateSwitchOfTable('roleFeatures', 'deletePerm')}><span className="btn-link alert-link">Delete</span></th>
            </tr>
            {/* <tr>
              <th>
                <input type="checkbox" className="switch-input" checked={allCheck} onChange={() => this.updateSwitchOfTable('roleFeatures')} />
              </th>
              <th>Feature</th>
              <th>
                View
                <input type="checkbox" className="switch-input" checked={viewPerm} onChange={() => this.updateSwitchOfTable('roleFeatures','viewPerm')} />
              </th>
              <th style={{cursor: 'pointer'}} onClick={()=>this.updateSwitchOfTable('roleFeatures', 'addPerm')}><span className="btn-link alert-link">Add</span></th>
              <th style={{cursor: 'pointer'}} onClick={()=>this.updateSwitchOfTable('roleFeatures', 'editPerm')}><span className="btn-link alert-link">Edit</span></th>
              <th style={{cursor: 'pointer'}} onClick={()=>this.updateSwitchOfTable('roleFeatures', 'deletePerm')}><span className="btn-link alert-link">Delete</span></th>
            </tr> */}
          </thead>
          <tbody>
            {roleFeatures.map( (item, idx) =>
              <tr key={idx}>
                <td style={{cursor: 'pointer'}} onClick={()=>this.updateSwitchOfTable('roleFeatures', undefined, idx)} ><span className="btn-link alert-link">{idx+1}</span></td>
                {/* <td><input id={idx} type="checkbox" className="switch-input" checked={allRow.length > 0 ? true: false} onChange={() => this.updateSwitchOfTable('roleFeatures',undefined,idx)}/></td> */}
                <td>{item.featureName}</td>
                <td>
                  <input type="checkbox" className="switch-input" checked={item.viewPerm === 1 ? true : false} onChange={() => this.updateSwitchOfTable('roleFeatures', 'viewPerm', idx)} />
                </td>
                <td>
                  <input type="checkbox" className="switch-input" checked={item.addPerm === 1 ? true : false} onChange={() => this.updateSwitchOfTable('roleFeatures', 'addPerm', idx)} />
                </td>
                <td>
                  <input type="checkbox" className="switch-input" checked={item.editPerm === 1 ? true : false} onChange={() => this.updateSwitchOfTable('roleFeatures', 'editPerm', idx)} />
                </td>
                <td>
                  <input type="checkbox" className="switch-input" checked={item.deletePerm === 1 ? true : false} onChange={() => this.updateSwitchOfTable('roleFeatures', 'deletePerm', idx)} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const { isLoading } = this.state;
    return (
      <>
      {isLoading && <LoadingSpinner />}
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.BOTTOM_RIGHT} />
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Role Feature" subtitle="CBM MIS" className="text-sm-left" />
        </Row>
        <Row >
          <Col xs="12" lg="12">
              <Card>
                <CardBody>
                  <Row>
                    <Col lg="2">
                    <label htmlFor="featureName" required>Role Name:</label>
                    </Col>
                    <Col lg="3">
                      <FormInput value={this.state.roleName} disabled={true} type="text" id="featureName"/>
                    </Col>
                    <Col lg="4"></Col>
                    <Col lg="3">
                      <Select
                        options={this.state.dropdownData}
                        value={this.state.feature}
                        onChange={(value)=>this.updateState("feature",value)} />
                    </Col>
                  </Row>
                  <br />
                  <div>{this.renderTable(this.state.roleFeatures)}</div>
              </CardBody>
                <CardFooter>  
                <Row>
                    <Col xs="8" lg="8"></Col>
                    <Col xs="4" lg="4" style={{textAlign:"right"}}>
                        <Button type="submit" size="sm" theme="primary" onClick={()=>this.submitHandle()} ><i className="fa fa-save"></i> Save</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="reset" size="sm" theme="danger" onClick={()=>this.cancelHandle()} ><i className="fa fa-ban"></i> Cancel</Button>
                    </Col>
                </Row>
                </CardFooter>
              </Card>
          </Col>
        </Row>
      </Container>
      </>
    );
  }
 }

 export default connect(
  state => state.auth,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(RoleFeature);