import React from 'react';
import { Row, Col, Card, CardBody, CardFooter, Button, Form, Input, FormGroup, Alert, Container, Label } from 'reactstrap';
import { saveRole, fetchRole, fetchDuplicateRole } from '../../api/Role';
import PageTitle from '../../components/common/PageTitle';

class NewRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      GoToList: false,
      gotolist: false,
      formState: "new",

      errors: [],
      successMessage: '',
      messageVisible: false,

      isLoading: false,

      rowKey: "",
      roleName: "",
      recordStatus: "Active",

      // showParameterButton: false,
    }
  }

  async componentDidMount() {
    const roleKey = this.props.match.params.id;
    console.log(roleKey)
    if (roleKey) {
      this.setState({
        roleKey,
      }, () => this.loadData())
    }
  }

  async loadData() {
    const roleKey = this.state.roleKey;
    if (roleKey) {
      this.setState({ isLoading: true });

      const rowKey = roleKey;
      const res = await fetchRole(rowKey);
      if (res) {
        this.setState({
          isLoading: false,
          formState: "edit",
          rowKey: rowKey,
          roleName: res.roleName,
          recordStatus: res.recordStatus,
        });
      }
    }
  }
  //  render(){
  //   return (
  //     <>
  //     <h6>Hello</h6>
  //     </>
  //   )
  //  }
  render() {
    let { isLoading, recordStatus } = this.state;
    return (
      <>
        {/* {isLoading && <LoadingSpinner />} */}
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            {this.state.formState === "new" ?
              <PageTitle sm="4" title="New Role" subtitle="CBM MIS" className="text-sm-left" /> :
              <PageTitle sm="4" title="Edit Role" subtitle="CBM MIS" className="text-sm-left" />
            }
          </Row>
          <Row>
            <Col xs="12" lg="6">
              <Card>
                <CardBody>
                  {/* <Form action="" method="post" onSubmit={(values) => this.submitHandle(values)}> */}
                  <Form>
                    <Row xs="12" lg="12">
                      <Col xs="12" lg="12">
                        <FormGroup row>
                          <Col xs="2" lg="2">
                            <label htmlFor="roleName">Role Name</label>
                          </Col>
                          <Col xs="4" lg="4">
                            <Input id='roleName' placeholder='Role Name' type='text' value={this.state.roleName} onChange={(evt) => this.updateState("roleName", evt.target.value)} />
                          </Col>
                        </FormGroup>
                        <FormGroup
                          check
                          inline
                        >
                          <Input id='recordStatus' type="checkbox" checked={recordStatus === "Active"} onChange={() => this.updateState("recordStatus", this.state.recordStatus === "Active" ? "Inactive" : "Active")} />
                          <Label check>
                            Status
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                  {this.state.errors.length > 0 &&
                    <Alert color="danger" isOpen={this.state.messageVisible} toggle={() => this.setState({ messageVisible: false })}>
                      {this.state.errors.map((msg, index) => (
                        <span key={index}>{msg}<br /></span>
                      ))}
                    </Alert>
                  }
                  {this.state.successMessage !== "" &&
                    <Alert isOpen={this.state.messageVisible} toggle={() => this.setState({ messageVisible: false })}>
                      <span>{this.state.successMessage}<br /></span>
                    </Alert>
                  }
                </CardBody>
                {(this.state.formState === "new") ?
                  <CardFooter>
                    <Button type="submit" color="primary" onClick={() => this.submitHandle()} ><i className="fa fa-save"></i> Save</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="reset" color="danger" onClick={() => this.resetHandle()} ><i className="fa fa-ban"></i> Reset</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="reset" color="info" onClick={() => this.cancelHandle()}  ><i className="fa fa-list-alt"></i> Go To List</Button>
                  </CardFooter> : ""
                }
                {(this.state.formState === "edit") ?
                  <CardFooter>
                    <Button type="submit" size="sm" color="primary" onClick={() => this.submitHandle()} ><i className="fa fa-dot-circle-o"></i> Update</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="reset" size="sm" color="danger" onClick={() => this.cancelHandle()} ><i className="fa fa-ban"></i> Cancel</Button>
                  </CardFooter> : ""
                }
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  updateState(prop, value) {
    this.setState({ [prop]: value },()=>console.log(this.state));
  }

  resetHandle() {
    this.setState({
      rowKey: "",
      // code: "",
      roleName: "",
      recordStatus: "Active",
      // showParameterButton: false,
    })

  }

  cancelHandle() { this.props.history.push({ pathname: "/Role/RoleList" }) }


  validate() {
    let errors = [];

    if (this.state.roleName.trim() === "") {
      errors.push("* Role Name cannot be blank.");
    }
    if (errors.length > 0) {
      this.setState({
        errors, messageVisible: true,
        successMessage: '',
      })
      return false;
    } else
      return true;
  }

  clearMessages() {
    this.setState({
      errors: [],
      successMessage: "",
    });
  }

  async submitHandle() {
    this.setState({ isLoading: true });
    this.clearMessages();
    var count = await fetchDuplicateRole(this.state.roleName);
    if (this.validate() === false) return;
    if (count !== 0 && this.state.formState === "new") {
      this.setState({
        messageVisible: true,
        errors: ["* Role Name is already exist."]
      })
      return;
    }
    else {
      var res = await saveRole(this.state);
      if (res) {
        this.setState({
          isLoading: false,
          errors: [],
          successMessage: "Role has been saved successful.",
          messageVisible: true,

          rowKey: "",
          code: "",
          roleName: "",
          recordStatus: "Active",

        });
        // if (this.state.formState === "edit")
        //   this.props.history.push({ pathname: "/role/rolelist" })
      }
      else {
        this.setState({ errors: [res.message], messageVisible: true, successMessage: "", isLoading: false, });
      }
    }
  }
}

export default NewRole;
