import React from "react";
import HardwareIT from '../../views/Route/HardwareIT';
import SoftwareIT from '../../views/Route/SoftwareIT';
import NotFound from "../../views/Route/NotFound";

class DetailPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.location.pathname);
        // console.log(`${this.props.location.state.menuGroupCode}`);
        // console.log(`${this.props.location.state.moduleCode}`);
    }

    render() {
        const pj = () => {
            console.log("test",this.props.location.pathname);
            switch (this.props.location.pathname) {
                case "/detail/IT/SIT":
                    return <SoftwareIT />
                case "/detail/IT/HIT":
                    return <HardwareIT />
                default:
                    return <NotFound />
            }
        }

        return (
            pj()
            // <div>Hello Detail</div>
        )
    }
}

export default DetailPage;