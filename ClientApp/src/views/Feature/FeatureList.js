import React from "react";
import { Row, Col, Card, CardHeader, Button, CardBody, Alert, Modal, ModalBody, ModalFooter, ModalHeader, Container, Collapse, CardColumns, CardGroup, CardFooter, Table } from 'reactstrap';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { dateFormatter } from '../../components/helper/func';
import { Pagination } from '../../components/Pagination/Pagination';
import PageTitle from '../../components/common/PageTitle';
import { fetchFeatureByFilter } from "../../api/Feature";
import { deleteFeature } from "../../api/Feature";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from 'reactstrap';
import DetailPage from "../Route/DetailPage";


class FeatureList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,

            //for Pagination
            currentPage: 1,
            totalPage: 0,
            rowPerPage: 10,
            totalRecord: 0,


            //For Admin Permisstion (Edit and Delete)
            feature: {},

            //Data is saving is successful or not
            errorMessage: "",
            successMessage: "",

            //Delete Box
            deleteModal: false,

            //Drop Down
            dropDownOpen: false,
            selectDropDown: "",
            // displaySubRoute: false,
            // groupSubRoute: '',


            // collapse: -1,
            // holes: [],
            // successMessagetable: "",

            routeName : "",
        }
    }

    async componentDidMount() {
        this.loadData();
    }

    async loadData(isContinueFetch = false) {
        this.setState({ isLoading: true });
        console.log(this.state.selectDropDown);
        const { currentPage, rowPerPage } = this.state;
        const res = await fetchFeatureByFilter(currentPage, rowPerPage);
        this.setState({
            data: res.featureRecords,
            totalRecord: res.featureTotalRecord,
            totalPage: Math.ceil(res.featureTotalRecord / rowPerPage)
        }, () => isContinueFetch ? this.loadOptions() : this.setState({ isLoading: false }));
    }

    async loadOptions() { }

    //Pagination  onClickPageNumber button
    onClickPageNumber(e, index) {
        e.preventDefault();
        this.setState({ currentPage: index }, () => this.loadData());
    }

    //Pagination  onClickRowPerPage select
    onClickRowPerPage(e) {
        this.setState({
            currentPage: 1,
            //
            rowPerPage: Number(e.target.value),
            // 12 / 100 = 0.12 -> 1
            totalPage: Math.ceil(this.state.data.length / Number(e.target.value)),
        }, () => this.loadData());
    }

    toggle(index) {
        const { deleteModal } = this.state;
        this.setState({ deleteModal: deleteModal === index ? -1 : index });
    }

    toggleDropDown() {
        let { dropDownOpen } = this.state;
        this.setState({
            dropDownOpen: !dropDownOpen,
        })
    }

    clearMessages() {
        this.setState({
            errorMessage: "",
            successMessage: ""
        });
    }

    async handleDelete(rowObj) {
        this.setState({ isLoading: true });
        this.clearMessages();
        var res = await deleteFeature(rowObj);
        if (res) {
            this.loadData();
            this.setState({ successMessage: "Delete " + rowObj.roleName + " Successful.", deleteModal: -1, isLoading: false });
        } else {
            this.setState({ errorMessage: res.message, deleteModal: -1, isLoading: false });
        }
    }

    New() {
        this.props.history.push({ pathname: "/newfeature" });
    }

    handleEdit(featureID) {
        console.log(`/editfeature/${featureID}`);
        this.props.history.push({ pathname: `/editfeature/${featureID}`});
    }

    ToPageFeature(data) {
        // console.log("data");
        // console.log(data.featureID);
        this.props.history.push({ pathname: `/pagefeature${data.pageURL}`, state: data });
    }

    ToDetailFeature(data) {
        console.log(data.pageURL);
        console.log(`/${data.menuGroupCode + data.pageURL}`);
        this.props.history.push({pathname: `/${data.menuGroupCode + data.pageURL}` , state: data});
        // this.props.history.push({ pathname: `/feature${data.pageURL}`, state: data });
    }

    DropDownMenu(){
        console.log(this.state.selectDropDown);
    }

    renderRoleListTable = () => {
        let { feature, data } = this.state;
        if (data.length <= 0) return <b>No Data To Show</b>;
        return (
            <div className="table-responsive">
                <table className="table table-bordered table-hover ">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Menu</th>
                            <th>Group</th>
                            <th>Module</th>
                            <th>Page URL</th>
                            {/* <th>Updated Date</th>
                            <th>Update By</th> */}
                            {feature.editPerm !== 0 || feature.deletePerm !== 0 ?
                                <th>Action</th> : ""
                            }
                        </tr>
                    </thead>
                    <tbody>

                        {data.map((item, idx) =>
                        (item.menuType === "ME" ?
                            <tr key={idx}>

                                <td  className="text-right">{item.menuName}</td>
                                <td  className="text-right">{item.menuCode}</td>
                                <td  className="text-right">{item.menuGroupCode}</td>
                                <td  className="text-right">{item.moduleCode}</td>
                                {/* <td onClick={() => this.ToDetailFeature(item)} style={{color: "blue"}} className="text-right">{item.pageURL}</td> */}
                                <td><Link to={`/detail/${item.menuGroupCode}${item.pageURL}`}>{item.pageURL}</Link></td>
                                {item.roleName === "Administrator" || item.roleName === "Checker" || item.roleName === "Maker" ?
                                    <td></td> :
                                    <>
                                        <td>
                                            <span>
                                                <Col>
                                                    <Button style={{ marginTop: "5px" }} color="primary" onClick={() => this.handleEdit(item.featureID)} > <i className="fa fa-edit"></i></Button>
                                                    &nbsp;&nbsp;&nbsp;
                                                    <Button style={{ marginTop: "5px" }} color="danger" onClick={() => this.toggle(idx)}> <i className="fa fa-trash"></i></Button>
                                                    &nbsp;&nbsp;&nbsp;
                                                    {item.menuType === "ME" ?
                                                        <Button style={{ marginTop: "5px" }} color="warning" onClick={() => this.ToPageFeature(item)}>Route</Button> :
                                                        ""
                                                    }
                                                </Col>
                                            </span>
                                        </td>
                                    </>
                                }

                                <Modal isOpen={this.state.deleteModal === idx} toggle={() => this.toggle(idx)}>
                                    <ModalHeader toggle={() => this.toggle(idx)}>Delete Feature Name</ModalHeader>
                                    <ModalBody>
                                        Are you sure you want to delete "{item.menuCode}"?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" onClick={() => this.handleDelete(item)}>Yes</Button>
                                        <Button color="secondary" onClick={() => this.toggle(idx)}>No</Button>
                                    </ModalFooter>
                                </Modal>
                            </tr>
                            :
                            <tr key={idx} >
                                <th>{item.menuName}</th>
                                <th>{item.menuCode}</th>
                                <th>{item.menuGroupCode}</th>
                                <th>{item.moduleCode}</th>
                                <th>{item.pageURL}</th>
                                {item.roleName === "Administrator" || item.roleName === "Checker" || item.roleName === "Maker" ?
                                    <td></td> :
                                    <>
                                        <td>
                                            <span>
                                                <Col>
                                                    <Button style={{ marginTop: "5px" }} color="primary" onClick={() => this.handleEdit(item.featureID)} > <i className="fa fa-edit"></i></Button>
                                                    &nbsp;&nbsp;&nbsp;
                                                    <Button style={{ marginTop: "5px" }} color="danger" onClick={() => this.toggle(idx)}> <i className="fa fa-trash"></i></Button>
                                                </Col>
                                            </span>
                                        </td>
                                    </>
                                }

                                <Modal isOpen={this.state.deleteModal === idx} toggle={() => this.toggle(idx)}>
                                    <ModalHeader toggle={() => this.toggle(idx)}>Delete Feature Name</ModalHeader>
                                    <ModalBody>
                                        Are you sure you want to delete "{item.menuCode}"?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" onClick={() => this.handleDelete(item)}>Yes</Button>
                                        <Button color="secondary" onClick={() => this.toggle(idx)}>No</Button>
                                    </ModalFooter>
                                </Modal>
                            </tr>
                        )
                        )}

                    </tbody>
                </table>
            </div>
        );
    }

    toggleTest(index) {
        let { collapse } = this.state;
        this.setState({
            collapse: collapse === index ? -1 : index
        });
    }

    render() {
        const { data, totalPage, currentPage, rowPerPage, totalRecord, selectDropDown, feature, isLoading } = this.state;
        return (
            <>
                {isLoading && <LoadingSpinner />}
                <Container fluid className="main-content-container px-4">
                    <Row noGutters className="page-header py-4">
                        <PageTitle sm="4" title="Feature List" subtitle="CBM MIS" className="text-sm-left" />
                    </Row>
                    <Row >
                        {this.state.isLoading && <LoadingSpinner />}
                        <Col xs="12" lg="12">
                            <Card>
                                <CardHeader>
                                    <Row xs="0" className="float-right">
                                        &nbsp;&nbsp;&nbsp;
                                        <Button color="primary" onClick={() => this.New()}>New Feature</Button>
                                        &nbsp;&nbsp;&nbsp;
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    {this.state.errorMessage !== "" &&
                                        <Alert theme="danger">{this.state.errorMessage}</Alert>
                                    }
                                    {this.state.successMessage !== "" &&
                                        <Alert theme="success">{this.state.successMessage}</Alert>
                                    }
                                    <br />
                                    {this.renderRoleListTable()}
                                    <Pagination
                                        className=""
                                        totalPage={totalPage} //2
                                        currentPage={currentPage} //1
                                        rowPerPage={rowPerPage} //10
                                        totalRecord={totalRecord} //12
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
}

export default FeatureList;