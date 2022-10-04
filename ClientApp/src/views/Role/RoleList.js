import React from 'react';
import { Row, Col, Card, CardHeader, Button, CardBody, Alert, Badge, Modal, ModalBody, ModalFooter, ModalHeader, Container } from 'reactstrap';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { dateFormatter } from '../../components/helper/func';
import { fetchRoleByFilter, deleteRole } from '../../api/Role';
import { Pagination } from '../../components/Pagination/index';
import { SearchBox } from '../../components/SearchBox/index';
import PageTitle from '../../components/common/PageTitle';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/Auth';
import { bindActionCreators } from 'redux';

class RoleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      errorMessage: "",
      successMessage: "",
      deleteModal: false,
      selectModal: undefined,
      isLoading: false,
      currentPage: 1,
      totalPage: 0,
      rowPerPage: 10,
      totalRecord: 0,
      searchKeyword: "",
      feature: {},
      Admin: false,
      Checker: false,
      Maker: false,


    }
  }

  componentDidMount() {
    this.loadData();
  }

  toggle(index) {
    const { deleteModal } = this.state;
    console.log(`${deleteModal} === ${index} ? -1 : ${index}`);
    this.setState({ deleteModal: deleteModal === index ? -1 : index });
  }

  // Start Paganation Event
  onClickPageNumber(e, index) {
    e.preventDefault();
    this.setState({ currentPage: index }, () => this.loadData());
  }

  onClickRowPerPage(e) {
    this.setState({
      currentPage: 1,
      rowPerPage: Number(e.target.value),
      totalPage: Math.ceil(this.state.data.length / Number(e.target.value)),
    }, () => this.loadData());
  }
  // End Paganation Event
  // Search  Event
  handleSearch(searchKeyword, wait) {
    console.log(`searchKeywork = ${searchKeyword} , wait = ${wait}`);
    this.setState({ searchKeyword }, () => {
      wait ? this.debounceSearching(searchKeyword, 1000) : this.searchByFilter();
    });
  }

  debounceSearching(searchKeyword, time) {
    window.clearInterval(this.setTimeInterval);
    let count = 0;
    console.log(`outside count ${count} / ${time}`);
    this.setTimeInterval = window.setInterval(() => {
      count++;
      if (count === 10) {
        console.log(`inside count ${count} / ${time}`);
        window.clearInterval(this.setTimeInterval);
        this.searchByFilter();
      }
    }, Math.floor(time / 10));
  }

  searchByFilter() {
    this.setState({ currentPage: 1 }, () => this.loadData());
  }

  renderRoleListTable = () => {
    let { feature, data } = this.state;
    if (data.length <= 0) return <b>No Data To Show</b>;
    return (
      <div className="table-responsive">
        <table className="table table-bordered  table-striped table-hover">
          <thead>
            <tr>
              <th>Status</th>
              <th>Role Name</th>
              <th>Updated Date</th>
              <th>Update By</th>
              {feature.editPerm !== 0 || feature.deletePerm !== 0 ?
                <th>Action</th> : ""
              }
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) =>
              <tr key={idx}>
                <td>
                  {
                    item.recordStatus === "Active" ?
                      <Badge color="success">Active</Badge> :
                      <Badge color="secondary">Inactive</Badge>
                  }
                </td>
                <td>{item.roleName}</td>
                {/* { 
                  item.roleName === "Administrator" || item.roleName === "Checker" || item.roleName === "Maker" ?
                  <td> 
                    {item.roleName}
                  </td>:
                  <td> 
                      <a onClick={()=>this.NewRoleFeature(item.roleKey)} style={{cursor:"pointer",color:"blue"}} >{item.roleName}</a>:
                      <span>{item.roleName}</span>
                  </td>
                } */}
                <td>
                  <span>{dateFormatter(item.updatedDate == null ? item.createdDate : item.updatedDate)}</span>
                </td>
                <td>
                  <span>{item.updatedBy == null ? item.createdBy : item.updatedBy}</span>
                </td>
                {item.roleName === "Administrator" || item.roleName === "Checker" || item.roleName === "Maker" ?
                  <td></td> :
                  <>
                    <td>
                      <span>
                        <Button color="primary" onClick={() => this.handleEdit(item.roleKey)} > <i className="fa fa-edit"></i></Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button color="danger" onClick={() => this.toggle(idx)}> <i className="fa fa-trash"></i></Button>
                      </span>
                    </td>
                  </>
                }

                <Modal isOpen={this.state.deleteModal === idx} toggle={() => this.toggle(idx)}>
                  <ModalHeader toggle={() => this.toggle(idx)}>Delete Role Name</ModalHeader>
                  <ModalBody>
                    Are you sure you want to delete "{item.roleName}"?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={() => this.handleDelete(item)}>Yes</Button>
                    <Button color="secondary" onClick={() => this.toggle(idx)}>No</Button>
                  </ModalFooter>
                </Modal>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const { totalPage, currentPage, rowPerPage, totalRecord, searchKeyword, feature, isLoading } = this.state;
    return (
      <>
        {/* {isLoading && <LoadingSpinner />} */}
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <PageTitle sm="4" title="Role List" subtitle="CBM MIS" className="text-sm-left" />
          </Row>
          <Row >
            {this.state.isLoading && <LoadingSpinner />}
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <Button color="primary" className="float-right" onClick={() => this.New()} >New Role</Button>
                </CardHeader>
                <CardBody>
                  {this.state.errorMessage !== "" &&
                    <Alert theme="danger">{this.state.errorMessage}</Alert>
                  }
                  {this.state.successMessage !== "" &&
                    <Alert theme="success">{this.state.successMessage}</Alert>
                  }
                  <SearchBox value={searchKeyword} onSearchKeywordChange={(searchKeyword, wait) => this.handleSearch(searchKeyword, wait)} />
                  <br />
                  {/* <div>
                    <Table responsive="lg">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Role Name</th>
                          <th>Updated By</th>
                          <th>Updated Date</th>
                          { feature.editPerm !== 0 || feature.deletePerm !== 0?
                            <th></th>:""
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {this.renderRoleList()}
                      </tbody>
                    </Table>
                  </div> */}
                  {this.renderRoleListTable()}
                  <Pagination
                    className=""
                    totalPage={totalPage}
                    currentPage={currentPage}
                    rowPerPage={rowPerPage}
                    totalRecord={totalRecord}
                    besideRangeDisplayed={2}
                    onClickPageNumber={(e, index) => this.onClickPageNumber(e, index)}
                    onClickRowPerPage={(e) => this.onClickRowPerPage(e)}
                  />
                </CardBody>
              </Card>
            </Col>

          </Row>
        </Container>
      </>
    );
  }

  clearMessages() {
    this.setState({
      errorMessage: "",
      successMessage: ""
    });
  }

  async handleEdit(roleKey) {
    this.props.history.push({ pathname: `/EditRole/${roleKey}` });
    //this.props.history.push({pathname: '/EditRole',roleKey})
  }

  async handleDelete(rowObj) {
    this.setState({ isLoading: true });
    this.clearMessages();
    var res = await deleteRole(rowObj);
    if (res) {
      this.loadData();
      this.setState({ successMessage: "Delete " + rowObj.roleName + " Successful.", deleteModal: -1, isLoading: false });
    } else {
      this.setState({ errorMessage: res.message, deleteModal: -1, isLoading: false });
    }
  }

  NewRoleFeature(roleKey) {
    this.props.history.push({ pathname: `/Role/RoleFeature/${roleKey}` });
  }

  async loadData(isContinueFetch = false) {
    this.setState({ isLoading: true });
    const { currentPage, rowPerPage, searchKeyword } = this.state;
    // currentPage 1 , rowPerPage 10 , seachKeyword 
    // console.log(`currentPage ${currentPage} , rowPerPage ${rowPerPage} , seachKeyword ${searchKeyword}`)
    const res = await fetchRoleByFilter(currentPage, rowPerPage, searchKeyword);
    // res.records [object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object] , res.totalRecord 12 , result 2
    // console.log(`res.records ${res.records} , res.totalRecord ${res.totalRecord} , result ${Math.ceil(res.totalRecord / rowPerPage)}`)
    this.setState({
      data: res.records,
      totalRecord: res.totalRecord,
      totalPage: Math.ceil(res.totalRecord / rowPerPage)
    }, () => isContinueFetch ? this.loadOptions() : this.setState({ isLoading: false }));
  }

  async loadOptions() { }

  New() {
    this.props.history.push({ pathname: "/newrole" });
  }
}

export default RoleList;
